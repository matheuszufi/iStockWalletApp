import React, { useState, useEffect, useCallback } from 'react';
import { useAuthStatus } from '../hooks/useAuthStatus';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, push, onValue, remove, set } from 'firebase/database';
import { toast } from 'react-toastify';
import AssetsPieChart from '../components/AssetsPieChart';
import StockCard from '../components/StockCard';
import { getStockData, getMultipleStocks } from '../services/brapiService';

function Wallet() {
  const [showModal, setShowModal] = useState(false);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('type'); // 'type' ou 'sector'
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [stockLogos, setStockLogos] = useState({});
  const [currentPrices, setCurrentPrices] = useState({});
  const [companyData, setCompanyData] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isLoadingAssetDetails, setIsLoadingAssetDetails] = useState(false);
  const { loggedIn } = useAuthStatus();
  
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    sector: '',
    fiiType: '',
    cryptoType: '',
    tesouroType: '',
    rendaFixaType: '',
    paidValue: '',
    quantity: ''
  });

  const auth = getAuth();
  const database = getDatabase();

  // Função para carregar dados completos dos ativos da API
  const fetchAssetsData = useCallback(async (assetsList) => {
    console.log('🚀 fetchAssetsData chamada com:', assetsList?.length, 'ativos');
    
    if (!assetsList || assetsList.length === 0) {
      console.log('❌ Lista de ativos vazia ou inexistente');
      setDataLoaded(true);
      return;
    }
    
    // Filtrar apenas ativos que precisam de dados da API (não são tesouro/renda fixa)
    const apiTickers = assetsList
      .filter(asset => {
        const needsAPI = !asset.name.startsWith('TESOURO-') && 
          !asset.name.includes('CDB-') && 
          !asset.name.includes('LCI-') && 
          !asset.name.includes('LCA-') && 
          !asset.name.includes('CRI-') && 
          !asset.name.includes('CRA-') && 
          !asset.name.includes('DEBENTURE-') && 
          !asset.name.includes('LF-') && 
          !asset.name.includes('LC-') && 
          !asset.name.includes('CDCA-') && 
          !asset.name.includes('FUNDOS-');
        
        console.log(`🔍 Ativo ${asset.name} precisa de API:`, needsAPI);
        return needsAPI;
      })
      .map(asset => asset.name);
      
    console.log('📊 Tickers filtrados para API:', apiTickers);
    console.log('📋 Lista completa de ativos:', assetsList.map(a => ({ name: a.name, type: a.type })));
      
    if (apiTickers.length === 0) {
      console.log('⚠️ Nenhum ticker válido para buscar na API');
      setDataLoaded(true);
      return;
    }

    // Função para fazer retry da API em caso de erro 429
    const fetchWithRetry = async (tickers, retries = 3) => {
      try {
        console.log(`🚀 Tentativa de busca para: ${tickers}, tentativas restantes: ${retries}`);
        const response = await getMultipleStocks(tickers);
        return response;
      } catch (error) {
        console.error(`❌ Erro na API (tentativa ${4-retries}):`, error.message);
        
        if (error.response?.status === 429 && retries > 1) {
          const delay = Math.pow(2, 4-retries) * 1000; // Backoff exponencial
          console.log(`⏰ Aguardando ${delay}ms antes de tentar novamente...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          return fetchWithRetry(tickers, retries - 1);
        }
        throw error;
      }
    };

    try {
      console.log('🚀 Buscando dados para:', apiTickers);
      const response = await fetchWithRetry(apiTickers.join(','));
      console.log('📦 Resposta completa da API:', response);
      
      if (response && response.results && response.results.length > 0) {
        console.log('📝 Processando', response.results.length, 'resultados da API');
        
        const logos = {};
        const prices = {};
        const companies = {};
        
        response.results.forEach(stock => {
          console.log(`💰 Processando ${stock.symbol}: R$ ${stock.regularMarketPrice}`);
          
          // Validar se o preço existe e é válido
          if (stock.regularMarketPrice !== null && 
              stock.regularMarketPrice !== undefined && 
              !isNaN(stock.regularMarketPrice) && 
              stock.regularMarketPrice > 0) {
            prices[stock.symbol] = parseFloat(stock.regularMarketPrice);
            console.log(`✅ Preço válido para ${stock.symbol}: R$ ${prices[stock.symbol]}`);
          } else {
            console.log(`⚠️ Preço inválido para ${stock.symbol}:`, stock.regularMarketPrice);
          }
          
          // Processar logo
          if (stock.logourl) {
            logos[stock.symbol] = stock.logourl;
            console.log(`🖼️ Logo salvo para ${stock.symbol}`);
          }
          
          // Armazenar dados completos da empresa
          companies[stock.symbol] = {
            symbol: stock.symbol,
            shortName: stock.shortName,
            longName: stock.longName,
            currency: stock.currency,
            marketCap: stock.marketCap,
            regularMarketChange: stock.regularMarketChange,
            regularMarketChangePercent: stock.regularMarketChangePercent,
            regularMarketTime: stock.regularMarketTime,
            regularMarketDayHigh: stock.regularMarketDayHigh,
            regularMarketDayLow: stock.regularMarketDayLow,
            regularMarketVolume: stock.regularMarketVolume,
            fiftyTwoWeekHigh: stock.fiftyTwoWeekHigh,
            fiftyTwoWeekLow: stock.fiftyTwoWeekLow,
            dividendYield: stock.dividendYield,
            dividendDate: stock.dividendDate,
            earningsTimestamp: stock.earningsTimestamp,
            earningsTimestampStart: stock.earningsTimestampStart,
            earningsTimestampEnd: stock.earningsTimestampEnd,
            trailingPE: stock.trailingPE,
            forwardPE: stock.forwardPE,
            region: stock.region,
            summaryProfile: stock.summaryProfile
          };
        });
        
        console.log('✅ Dados processados:');
        console.log('📊 Logos:', Object.keys(logos).length, '- Símbolos:', Object.keys(logos));
        console.log('💲 Preços:', Object.keys(prices).length, '- Preços encontrados:', prices);
        console.log('🏢 Empresas:', Object.keys(companies).length, '- Símbolos:', Object.keys(companies));
        
        // Atualizar os estados com os novos dados
        setStockLogos(prev => {
          const updated = { ...prev, ...logos };
          console.log('🔄 StockLogos atualizado:', updated);
          return updated;
        });
        
        setCurrentPrices(prev => {
          const updated = { ...prev, ...prices };
          console.log('🔄 CurrentPrices atualizado:', updated);
          return updated;
        });
        
        setCompanyData(prev => {
          const updated = { ...prev, ...companies };
          console.log('🔄 CompanyData atualizado:', Object.keys(updated));
          return updated;
        });
        
        // Verificar se todos os ativos têm preços
        const assetsWithoutPrices = apiTickers.filter(ticker => !prices[ticker]);
        if (assetsWithoutPrices.length > 0) {
          console.log('⚠️ Ativos sem preços encontrados:', assetsWithoutPrices);
        }
        
      } else {
        console.log('❌ Nenhum resultado válido da API');
        console.log('📦 Response recebido:', response);
      }
    } catch (error) {
      console.error('❌ Erro ao buscar dados:', error);
      console.error('📋 Detalhes do erro:', error.message, error.stack);
      
      // Em caso de erro, ainda marcar como carregado para não ficar infinitamente carregando
      if (error.response?.status === 429) {
        console.log('⚠️ Limite de API atingido, tentará novamente em 30 segundos');
      }
    } finally {
      setDataLoaded(true);
      console.log('✅ fetchAssetsData finalizada - dataLoaded = true');
    }
  }, []);

  // Carregar ativos do Firebase
  useEffect(() => {
    if (loggedIn && auth.currentUser) {
      const assetsRef = ref(database, `users/${auth.currentUser.uid}/assets`);
      
      const unsubscribe = onValue(assetsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const assetsList = Object.entries(data).map(([id, asset]) => ({
            id,
            ...asset
          }));
          console.log('📊 Ativos carregados do Firebase:', assetsList.map(a => a.name));
          setAssets(assetsList);
        } else {
          setAssets([]);
          setDataLoaded(true);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, [loggedIn, auth.currentUser, database]);

  // Buscar dados da API quando os ativos mudarem
  useEffect(() => {
    console.log('🔍 useEffect [assets] disparado - assets.length:', assets.length);
    console.log('📋 Lista de ativos:', assets.map(a => a.name));
    
    if (assets.length > 0) {
      console.log('🔄 Iniciando busca automática de dados...');
      // Resetar dataLoaded para mostrar estado de carregamento
      setDataLoaded(false);
      fetchAssetsData(assets);
    } else {
      console.log('⚠️ Nenhum ativo encontrado para buscar dados');
      setDataLoaded(true);
    }
  }, [assets, fetchAssetsData]);

  // Atualizar dados automaticamente a cada 2 minutos (evitar limite da API)
  useEffect(() => {
    if (assets.length > 0 && dataLoaded) {
      const interval = setInterval(() => {
        console.log('🔄 Atualizando dados automaticamente...');
        fetchAssetsData(assets);
      }, 120000); // 2 minutos em vez de 30 segundos

      return () => clearInterval(interval);
    }
  }, [assets, dataLoaded, fetchAssetsData]);

  // Função para criar informações de ativos manuais (Tesouro e Renda Fixa)
  const createManualAssetInfo = (assetCode) => {
    const assetMappings = {
      // Tesouro Direto
      'TESOURO-SELIC': { name: 'Tesouro Selic', type: 'tesouro', subType: 'selic', description: 'Título pós-fixado indexado à taxa Selic' },
      'TESOURO-PREFIXADO': { name: 'Tesouro Prefixado', type: 'tesouro', subType: 'prefixado', description: 'Título com rentabilidade definida no momento da compra' },
      'TESOURO-IPCA': { name: 'Tesouro IPCA+', type: 'tesouro', subType: 'ipca', description: 'Título híbrido indexado ao IPCA + taxa prefixada' },
      'TESOURO-IGPM': { name: 'Tesouro IGPM+', type: 'tesouro', subType: 'igpm', description: 'Título híbrido indexado ao IGPM + taxa prefixada' },
      'TESOURO-SELIC-2026': { name: 'Tesouro Selic 2026', type: 'tesouro', subType: 'selic', description: 'Tesouro Selic com vencimento em 2026' },
      'TESOURO-SELIC-2029': { name: 'Tesouro Selic 2029', type: 'tesouro', subType: 'selic', description: 'Tesouro Selic com vencimento em 2029' },
      'TESOURO-PREFIXADO-2026': { name: 'Tesouro Prefixado 2026', type: 'tesouro', subType: 'prefixado', description: 'Tesouro Prefixado com vencimento em 2026' },
      'TESOURO-PREFIXADO-2029': { name: 'Tesouro Prefixado 2029', type: 'tesouro', subType: 'prefixado', description: 'Tesouro Prefixado com vencimento em 2029' },
      'TESOURO-IPCA-2030': { name: 'Tesouro IPCA+ 2030', type: 'tesouro', subType: 'ipca', description: 'Tesouro IPCA+ com vencimento em 2030' },
      'TESOURO-IPCA-2035': { name: 'Tesouro IPCA+ 2035', type: 'tesouro', subType: 'ipca', description: 'Tesouro IPCA+ com vencimento em 2035' },
      'TESOURO-IPCA-2045': { name: 'Tesouro IPCA+ 2045', type: 'tesouro', subType: 'ipca', description: 'Tesouro IPCA+ com vencimento em 2045' },
      'TESOURO-RENDA-2030': { name: 'Tesouro Renda+ 2030', type: 'tesouro', subType: 'renda', description: 'Tesouro para aposentadoria com vencimento em 2030' },
      'TESOURO-RENDA-2035': { name: 'Tesouro Renda+ 2035', type: 'tesouro', subType: 'renda', description: 'Tesouro para aposentadoria com vencimento em 2035' },
      
      // Renda Fixa
      'CDB-ITAU': { name: 'CDB Itaú', type: 'renda-fixa', subType: 'cdb', description: 'Certificado de Depósito Bancário do Itaú' },
      'CDB-BRADESCO': { name: 'CDB Bradesco', type: 'renda-fixa', subType: 'cdb', description: 'Certificado de Depósito Bancário do Bradesco' },
      'CDB-SANTANDER': { name: 'CDB Santander', type: 'renda-fixa', subType: 'cdb', description: 'Certificado de Depósito Bancário do Santander' },
      'CDB-BTG': { name: 'CDB BTG Pactual', type: 'renda-fixa', subType: 'cdb', description: 'Certificado de Depósito Bancário do BTG Pactual' },
      'LCI-ITAU': { name: 'LCI Itaú', type: 'renda-fixa', subType: 'lci', description: 'Letra de Crédito Imobiliário do Itaú' },
      'LCA-BRADESCO': { name: 'LCA Bradesco', type: 'renda-fixa', subType: 'lca', description: 'Letra de Crédito do Agronegócio do Bradesco' },
      'CRI-XP': { name: 'CRI XP', type: 'renda-fixa', subType: 'cri', description: 'Certificado de Recebíveis Imobiliários da XP' },
      'CRA-BTG': { name: 'CRA BTG', type: 'renda-fixa', subType: 'cra', description: 'Certificado de Recebíveis do Agronegócio do BTG' },
      'DEBENTURE-PETROBRAS': { name: 'Debênture Petrobras', type: 'renda-fixa', subType: 'debenture', description: 'Debênture da Petrobras' },
      'DEBENTURE-VALE': { name: 'Debênture Vale', type: 'renda-fixa', subType: 'debenture', description: 'Debênture da Vale' },
      'LF-SANTANDER': { name: 'Letra Financeira Santander', type: 'renda-fixa', subType: 'lf', description: 'Letra Financeira do Santander' },
      'LC-BANCO-INTER': { name: 'Letra de Câmbio Banco Inter', type: 'renda-fixa', subType: 'lc', description: 'Letra de Câmbio do Banco Inter' },
      'CDCA-SANTANDER': { name: 'CDCA Santander', type: 'renda-fixa', subType: 'cdca', description: 'Certificado de Direitos Creditórios do Agronegócio' },
      'FUNDOS-DI': { name: 'Fundos DI', type: 'renda-fixa', subType: 'fundos-di', description: 'Fundos de Investimento em DI' }
    };

    const info = assetMappings[assetCode];
    if (info) {
      return {
        symbol: assetCode,
        shortName: info.name,
        longName: info.description,
        regularMarketPrice: null, // Será preenchido manualmente
        logourl: null,
        manualAsset: true,
        assetType: info.type,
        assetSubType: info.subType
      };
    }

    // Fallback para ativos não mapeados
    return {
      symbol: assetCode,
      shortName: assetCode.replace(/-/g, ' '),
      longName: `Ativo de ${assetCode.includes('TESOURO') ? 'Tesouro Direto' : 'Renda Fixa'}`,
      regularMarketPrice: null,
      logourl: null,
      manualAsset: true,
      assetType: assetCode.includes('TESOURO') ? 'tesouro' : 'renda-fixa',
      assetSubType: 'outros'
    };
  };

  // Função para buscar ativos disponíveis
  const searchAvailableAssets = async (searchTerm) => {
    if (searchTerm.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // Lista de ativos disponíveis (Ações, FIIs, Criptomoedas, Tesouro e Renda Fixa)
      const popularAssets = [
        // Ações
        'PETR4', 'VALE3', 'ITUB4', 'BBDC4', 'ABEV3', 'MGLU3', 'B3SA3',
        'WEGE3', 'RENT3', 'LREN3', 'JBSS3', 'BEEF3', 'SUZB3', 'RAIL3',
        'BBAS3', 'SANB11', 'BPAC11', 'CIEL3', 'CMIG4', 'EGIE3',
        'VIVT3', 'KLBN11', 'CSNA3', 'USIM5', 'GOAU4', 'TOTS3',
        // FIIs (Fundos Imobiliários)
        'KNRI11', 'HGLG11', 'XPML11', 'BTLG11', 'BCFF11', 'HGRE11',
        'VISC11', 'KNCR11', 'XPLG11', 'MXRF11', 'BRCO11', 'VRTA11',
        'GGRC11', 'RBRR11', 'VILG11', 'RBVA11', 'HABT11', 'HSML11',
        'BBPO11', 'BBFI11', 'SADI11', 'XPIN11', 'CXRI11', 'MALL11',
        'ALZR11', 'HCTR11', 'IRDM11', 'GAME11', 'RBRD11', 'TRXF11',
        // Criptomoedas
        'BTC-USD', 'ETH-USD', 'BNB-USD', 'XRP-USD', 'ADA-USD', 'DOGE-USD',
        'SOL-USD', 'DOT-USD', 'AVAX-USD', 'SHIB-USD', 'MATIC-USD', 'LTC-USD',
        'UNI-USD', 'LINK-USD', 'BCH-USD', 'ALGO-USD', 'XLM-USD', 'VET-USD',
        'FIL-USD', 'TRX-USD', 'ETC-USD', 'THETA-USD', 'ATOM-USD', 'NEAR-USD',
        // Tesouro Direto
        'TESOURO-SELIC', 'TESOURO-PREFIXADO', 'TESOURO-IPCA', 'TESOURO-IGPM',
        'TESOURO-SELIC-2026', 'TESOURO-SELIC-2029', 'TESOURO-PREFIXADO-2026',
        'TESOURO-PREFIXADO-2029', 'TESOURO-IPCA-2030', 'TESOURO-IPCA-2035',
        'TESOURO-IPCA-2045', 'TESOURO-RENDA-2030', 'TESOURO-RENDA-2035',
        // Renda Fixa
        'CDB-ITAU', 'CDB-BRADESCO', 'CDB-SANTANDER', 'CDB-BTG',
        'LCI-ITAU', 'LCA-BRADESCO', 'CRI-XP', 'CRA-BTG',
        'DEBENTURE-PETROBRAS', 'DEBENTURE-VALE', 'LF-SANTANDER',
        'LC-BANCO-INTER', 'CDCA-SANTANDER', 'FUNDOS-DI'
      ];

      const filtered = popularAssets.filter(asset => 
        asset.toLowerCase().includes(searchTerm.toLowerCase())
      );

      // Separar ativos que precisam de API (ações, FIIs, criptos) dos que são manuais (tesouro, renda fixa)
      const apiAssets = filtered.filter(asset => 
        !asset.startsWith('TESOURO-') && 
        !asset.includes('CDB-') && 
        !asset.includes('LCI-') && 
        !asset.includes('LCA-') && 
        !asset.includes('CRI-') && 
        !asset.includes('CRA-') && 
        !asset.includes('DEBENTURE-') && 
        !asset.includes('LF-') && 
        !asset.includes('LC-') && 
        !asset.includes('CDCA-') && 
        !asset.includes('FUNDOS-')
      );

      const manualAssets = filtered.filter(asset => 
        asset.startsWith('TESOURO-') || 
        asset.includes('CDB-') || 
        asset.includes('LCI-') || 
        asset.includes('LCA-') || 
        asset.includes('CRI-') || 
        asset.includes('CRA-') || 
        asset.includes('DEBENTURE-') || 
        asset.includes('LF-') || 
        asset.includes('LC-') || 
        asset.includes('CDCA-') || 
        asset.includes('FUNDOS-')
      );

      let combinedResults = [];

      // Buscar dados da API para ações, FIIs e criptos
      if (apiAssets.length > 0) {
        const stocksData = await getMultipleStocks(apiAssets.slice(0, 10).join(','));
        if (stocksData && stocksData.results) {
          combinedResults = [...stocksData.results];
          // Salvar logos dos resultados da busca
          const logos = {};
          stocksData.results.forEach(stock => {
            if (stock.logourl) {
              logos[stock.symbol] = stock.logourl;
            }
          });
          setStockLogos(prev => ({ ...prev, ...logos }));
        }
      }

      // Adicionar ativos manuais (Tesouro e Renda Fixa)
      manualAssets.forEach(asset => {
        const assetInfo = createManualAssetInfo(asset);
        combinedResults.push(assetInfo);
      });

      setSearchResults(combinedResults.slice(0, 10));
    } catch (error) {
      console.error('Erro na busca:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Buscar ativos automaticamente quando o usuário digita no campo name
    if (name === 'name') {
      searchAvailableAssets(value);
    }
  };

  // Função para selecionar um ativo da busca
  const selectAsset = async (selectedAsset) => {
    setIsLoadingAssetDetails(true);
    try {
      // Buscar informações completas do ativo
      const detailedStock = await getStockData(selectedAsset.symbol);
      
      let assetType = 'acao'; // Padrão
      let sector = '';
      let fiiType = ''; // Declarar fiiType fora do bloco condicional
      let cryptoType = ''; // Declarar cryptoType para criptomoedas
      let tesouroType = ''; // Declarar tesouroType para títulos do tesouro
      let rendaFixaType = ''; // Declarar rendaFixaType para renda fixa
      
      // Verificar se é um ativo manual (Tesouro ou Renda Fixa)
      if (selectedAsset.manualAsset) {
        assetType = selectedAsset.assetType;
        if (assetType === 'tesouro') {
          tesouroType = selectedAsset.assetSubType;
          sector = 'governo';
        } else if (assetType === 'renda-fixa') {
          rendaFixaType = selectedAsset.assetSubType;
          sector = 'financeiro';
        }
      } else if (detailedStock && detailedStock.results && detailedStock.results.length > 0) {
        const stockInfo = detailedStock.results[0];
        
        // Determinar o tipo baseado no símbolo
        if (selectedAsset.symbol.includes('-USD') || selectedAsset.symbol.includes('-BTC')) {
          assetType = 'cripto';
          // Para criptomoedas, classificar por categoria
          const cryptoSymbol = selectedAsset.symbol.replace('-USD', '').replace('-BTC', '');
          
          // Principais criptomoedas por categoria
          const cryptoCategories = {
            'bitcoin': ['BTC'],
            'ethereum': ['ETH'],
            'altcoin': ['ADA', 'DOT', 'SOL', 'AVAX', 'ATOM', 'NEAR', 'ALGO'],
            'defi': ['UNI', 'LINK', 'MATIC'],
            'meme': ['DOGE', 'SHIB'],
            'exchange': ['BNB'],
            'payment': ['XRP', 'XLM', 'LTC'],
            'storage': ['FIL'],
            'platform': ['TRX', 'VET', 'THETA'],
            'fork': ['BCH', 'ETC']
          };
          
          // Encontrar categoria da criptomoeda
          for (const [category, symbols] of Object.entries(cryptoCategories)) {
            if (symbols.includes(cryptoSymbol)) {
              cryptoType = category;
              break;
            }
          }
          
          if (!cryptoType) {
            cryptoType = 'altcoin'; // Padrão para criptos não categorizadas
          }
          
          sector = 'blockchain'; // Setor padrão para criptomoedas
        } else if (selectedAsset.symbol.endsWith('11')) {
          assetType = 'fii';
        } else if (selectedAsset.symbol.endsWith('3') || selectedAsset.symbol.endsWith('4')) {
          assetType = 'acao';
        }
        
        // Pegar o setor da API
        sector = stockInfo.sector || '';
        
        // Para FIIs, usar informações específicas se disponível
        if (assetType === 'fii') {
          // FIIs podem ter setores específicos como Real Estate
          if (sector === 'Real Estate' || sector === 'Imobiliário' || !sector) {
            sector = 'imobiliario';
          }
        }
        
        // Mapear setores em inglês para português (se necessário)
        const sectorMapping = {
          'Technology': 'tecnologia',
          'Financial Services': 'bancario',
          'Financial': 'bancario',
          'Banks': 'bancario',
          'Healthcare': 'saude',
          'Health Care': 'saude',
          'Energy': 'energia',
          'Oil & Gas': 'petroleo-gas',
          'Consumer Defensive': 'bens-consumo',
          'Consumer Cyclical': 'bens-consumo',
          'Consumer Staples': 'bens-consumo',
          'Consumer Discretionary': 'bens-consumo',
          'Retail': 'varejo',
          'Basic Materials': 'materiais-basicos',
          'Materials': 'materiais-basicos',
          'Industrials': 'industrial',
          'Industrial': 'industrial',
          'Utilities': 'utilidades-publicas',
          'Real Estate': 'imobiliario',
          'Communication Services': 'comunicacao',
          'Communication': 'comunicacao',
          'Telecommunications': 'comunicacao',
          'Education': 'educacao',
          'Transportation': 'logistica',
          'Logistics': 'logistica'
        };
        
        // Se o setor estiver em inglês, traduzir
        if (sectorMapping[sector]) {
          sector = sectorMapping[sector];
        } else if (sector) {
          // Se não encontrar mapeamento, converter para lowercase e usar como está
          sector = sector.toLowerCase().replace(/\s+/g, '-');
        }
        
        // Determinar tipo de FII baseado no nome (heurística)
        if (assetType === 'fii') {
          const fiiName = (selectedAsset.shortName || selectedAsset.longName || '').toLowerCase();
          
          if (fiiName.includes('logistica') || fiiName.includes('log')) {
            fiiType = 'logistica';
          } else if (fiiName.includes('shopping') || fiiName.includes('mall')) {
            fiiType = 'shopping';
          } else if (fiiName.includes('corporativo') || fiiName.includes('corp') || fiiName.includes('laje')) {
            fiiType = 'corporativo';
          } else if (fiiName.includes('residencial') || fiiName.includes('resid')) {
            fiiType = 'residencial';
          } else if (fiiName.includes('hospital') || fiiName.includes('saude')) {
            fiiType = 'hospitalar';
          } else if (fiiName.includes('educacional') || fiiName.includes('educacao')) {
            fiiType = 'educacional';
          } else if (fiiName.includes('papel') || fiiName.includes('cri') || fiiName.includes('cra') || fiiName.includes('receivables')) {
            fiiType = 'papel';
          } else if (fiiName.includes('hibrido') || fiiName.includes('misto')) {
            fiiType = 'hibrido';
          } else {
            fiiType = 'tijolo'; // Padrão para FIIs não identificados especificamente
          }
        }
      }
      
      setFormData(prev => ({
        ...prev,
        name: selectedAsset.symbol,
        type: assetType,
        sector: assetType === 'acao' ? sector : (assetType === 'cripto' ? sector : (assetType === 'tesouro' || assetType === 'renda-fixa' ? sector : '')),
        fiiType: assetType === 'fii' ? fiiType : '',
        cryptoType: assetType === 'cripto' ? cryptoType : '',
        tesouroType: assetType === 'tesouro' ? tesouroType : '',
        rendaFixaType: assetType === 'renda-fixa' ? rendaFixaType : ''
      }));
      
      setSearchResults([]);
      
      if (assetType === 'acao' && sector) {
        toast.success(`Setor "${sector}" carregado automaticamente!`);
      } else if (assetType === 'fii' && fiiType) {
        toast.success(`Tipo de FII "${fiiType}" identificado automaticamente!`);
      } else if (assetType === 'cripto' && cryptoType) {
        toast.success(`Criptomoeda "${cryptoType}" identificada automaticamente!`);
      } else if (assetType === 'tesouro' && tesouroType) {
        toast.success(`Tipo do Tesouro "${tesouroType}" identificado automaticamente!`);
      } else if (assetType === 'renda-fixa' && rendaFixaType) {
        toast.success(`Tipo de Renda Fixa "${rendaFixaType}" identificado automaticamente!`);
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes do ativo:', error);
      // Em caso de erro, usar valores padrão
      setFormData(prev => ({
        ...prev,
        name: selectedAsset.symbol,
        type: 'acao'
      }));
      setSearchResults([]);
      toast.warning('Não foi possível carregar o setor automaticamente. Selecione manualmente.');
    } finally {
      setIsLoadingAssetDetails(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.type || !formData.paidValue || !formData.quantity) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    try {
      const tickerName = formData.name.toUpperCase();
      const newQuantity = parseInt(formData.quantity);
      const newPaidValue = parseFloat(formData.paidValue);
      
      // Verificar se o ativo já existe
      const existingAsset = assets.find(asset => asset.name === tickerName);
      
      if (existingAsset) {
        // Calcular média ponderada do valor pago
        const currentTotalInvested = existingAsset.quantity * existingAsset.paidValue;
        const newTotalInvested = newQuantity * newPaidValue;
        const totalQuantity = existingAsset.quantity + newQuantity;
        const averagePaidValue = (currentTotalInvested + newTotalInvested) / totalQuantity;
        
        // Atualizar ativo existente
        const assetRef = ref(database, `users/${auth.currentUser.uid}/assets/${existingAsset.id}`);
        const updatedAssetData = {
          ...existingAsset,
          quantity: totalQuantity,
          paidValue: averagePaidValue,
          totalValue: averagePaidValue * totalQuantity,
          updatedAt: new Date().toISOString()
        };
        
        await set(assetRef, updatedAssetData);
        
        toast.success(`${tickerName} consolidado! Nova quantidade: ${totalQuantity}, Valor médio: R$ ${averagePaidValue.toFixed(2)}`);
      } else {
        // Criar novo ativo
        const assetsRef = ref(database, `users/${auth.currentUser.uid}/assets`);
        
        const assetData = {
          name: tickerName,
          type: formData.type,
          sector: formData.sector || null,
          fiiType: formData.fiiType || null,
          cryptoType: formData.cryptoType || null,
          tesouroType: formData.tesouroType || null,
          rendaFixaType: formData.rendaFixaType || null,
          paidValue: newPaidValue,
          quantity: newQuantity,
          totalValue: newPaidValue * newQuantity,
          createdAt: new Date().toISOString()
        };

        await push(assetsRef, assetData);
        toast.success('Ativo adicionado com sucesso!');
      }
      
      setShowModal(false);
      setSearchResults([]);
      setFormData({
        name: '',
        type: '',
        sector: '',
        fiiType: '',
        cryptoType: '',
        tesouroType: '',
        rendaFixaType: '',
        paidValue: '',
        quantity: ''
      });
    } catch (error) {
      console.error('Erro ao processar ativo:', error);
      toast.error('Erro ao processar ativo');
    }
  };

  const handleDeleteAsset = async (assetId) => {
    if (window.confirm('Tem certeza que deseja remover este ativo?')) {
      try {
        const assetRef = ref(database, `users/${auth.currentUser.uid}/assets/${assetId}`);
        await remove(assetRef);
        toast.success('Ativo removido com sucesso!');
      } catch (error) {
        console.error('Erro ao remover ativo:', error);
        toast.error('Erro ao remover ativo');
      }
    }
  };

  const getTotalInvested = () => {
    return assets.reduce((total, asset) => total + asset.totalValue, 0);
  };

  // Função para calcular o valor atual de um ativo
  const getCurrentValue = (asset) => {
    const currentPrice = currentPrices[asset.name];
    
    if (currentPrice !== null && currentPrice !== undefined && currentPrice > 0) {
      const currentValue = currentPrice * asset.quantity;
      return currentValue;
    }
    return null;
  };

  // Função para calcular o resultado (profit/loss) de um ativo
  const getAssetResult = (asset) => {
    const currentValue = getCurrentValue(asset);
    if (currentValue !== null) {
      const investedValue = asset.totalValue;
      const result = currentValue - investedValue;
      const percentage = investedValue > 0 ? (result / investedValue) * 100 : 0;
      return {
        value: result,
        percentage: percentage,
        isPositive: result >= 0
      };
    }
    return null;
  };

  // Função para calcular totais da carteira
  const getPortfolioTotals = () => {
    let totalInvested = 0;
    let totalCurrent = 0;
    let assetsWithData = 0;

    assets.forEach(asset => {
      totalInvested += asset.totalValue;
      const currentValue = getCurrentValue(asset);
      if (currentValue !== null) {
        totalCurrent += currentValue;
        assetsWithData++;
      }
    });

    const totalResult = totalCurrent - totalInvested;
    const totalPercentage = totalInvested > 0 ? (totalResult / totalInvested) * 100 : 0;

    return {
      totalInvested,
      totalCurrent,
      totalResult,
      totalPercentage,
      assetsWithData,
      isPositive: totalResult >= 0
    };
  };

  if (!loggedIn) {
    return (
      <div className="wallet-container">
        <div className="wallet-content">
          <p>Você precisa estar logado para acessar sua carteira</p>
        </div>
      </div>
    );
  }

  return (
    <div className="wallet-container">
      {/* Header */}
      <div className="wallet-header">
        <h1>Minha Carteira</h1>
        <p>Gerencie seus investimentos</p>
      </div>

      {/* Botão Adicionar Ativo */}
      <div className="wallet-actions">
        <button 
          className="btn-add-asset"
          onClick={() => setShowModal(true)}
        >
          <span>+</span>
          Adicionar Ativo
        </button>
        
        {assets.length > 0 && (
          <button 
            className="btn-refresh-data"
            onClick={() => {
              console.log('🔄 Atualizando dados manualmente...');
              setDataLoaded(false);
              fetchAssetsData(assets);
            }}
            disabled={!dataLoaded}
            style={{
              background: dataLoaded ? '#667eea' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 20px',
              margin: '0 0 0 12px',
              cursor: dataLoaded ? 'pointer' : 'not-allowed',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>🔄</span>
            {dataLoaded ? 'Atualizar Preços' : 'Carregando...'}
          </button>
        )}
      </div>

      {/* Resumo da Carteira */}
      {assets.length > 0 && (
        <div className="portfolio-summary">
          <div className="portfolio-info">
            <h3>Resumo da Carteira</h3>
            <div className="portfolio-stats">
              <div className="stat-item">
                <p>Total de Ativos</p>
                <strong>{assets.length}</strong>
              </div>
              <div className="stat-item">
                <p>Total Investido</p>
                <strong>R$ {getPortfolioTotals().totalInvested.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
              </div>
              {getPortfolioTotals().assetsWithData > 0 && (
                <>
                  <div className="stat-item">
                    <p>Valor Atual</p>
                    <strong>R$ {getPortfolioTotals().totalCurrent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                  </div>
                  <div className="stat-item">
                    <p>Resultado</p>
                    <strong className={getPortfolioTotals().isPositive ? 'positive' : 'negative'}>
                      R$ {getPortfolioTotals().totalResult.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} 
                      ({getPortfolioTotals().totalPercentage > 0 ? '+' : ''}{getPortfolioTotals().totalPercentage.toFixed(2)}%)
                    </strong>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="chart-container">
            <AssetsPieChart assets={assets} viewMode={viewMode} />
              <div className="chart-controls">
            
            <button className={`chart-btn ${viewMode === 'type' ? 'active' : ''}`} onClick={() => setViewMode('type')}>Por Tipo</button>
            <button className={`chart-btn ${viewMode === 'sector' ? 'active' : ''}`} onClick={() => setViewMode('sector')}>Por Setor</button>
          </div>
          </div>
        
        </div>
      )}

      {/* Lista de Ativos */}
      {loading ? (
        <div className="loading">Carregando ativos...</div>
      ) : assets.length === 0 ? (
        <div className="empty-portfolio">
          <h3>Sua carteira está vazia</h3>
          <p>Comece adicionando seus primeiros ativos para acompanhar seus investimentos</p>
        </div>
      ) : (
        <div className="assets-grid">
          {assets.map((asset) => {
            // Verificar se é um ativo que precisa de dados da API (ações, criptos, fiis)
            const needsStockCard = !asset.name.startsWith('TESOURO-') && 
              !asset.name.includes('CDB-') && 
              !asset.name.includes('LCI-') && 
              !asset.name.includes('LCA-') && 
              !asset.name.includes('CRI-') && 
              !asset.name.includes('CRA-') && 
              !asset.name.includes('DEBENTURE-') && 
              !asset.name.includes('LF-') && 
              !asset.name.includes('LC-') && 
              !asset.name.includes('CDCA-') && 
              !asset.name.includes('FUNDOS-');

            if (needsStockCard) {
              // Para ativos que precisam de dados da API, usar StockCard
              return (
                <div key={asset.id} className="wallet-stock-card">
                  <div className="wallet-asset-info">
                    <div className="wallet-asset-header">
                      <span className="wallet-asset-type">{asset.type.toUpperCase()}</span>
                      <button 
                        className="wallet-delete-btn"
                        onClick={() => handleDeleteAsset(asset.id)}
                        title="Remover ativo"
                      >
                        🗑️
                      </button>
                    </div>
                    <div className="wallet-asset-details">
                      <div className="wallet-detail-row">
                        <span>Quantidade:</span>
                        <strong>{asset.quantity}</strong>
                      </div>
                      <div className="wallet-detail-row">
                        <span>Valor Pago Total:</span>
                        <strong>R$ {asset.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                      </div>
                      <div className="wallet-detail-row">
                        <span>Preço Médio Pago:</span>
                        <strong>R$ {asset.paidValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                      </div>
                    </div>
                  </div>
                  <StockCard 
                    ticker={asset.name} 
                    showQuantity={true}
                    userQuantity={asset.quantity}
                    averagePrice={asset.paidValue}
                    totalInvested={asset.totalValue}
                  />
                </div>
              );
            } else {
              // Para ativos de renda fixa, manter o card original
              const currentValue = getCurrentValue(asset);
              const result = getAssetResult(asset);
              
              return (
                <div key={asset.id} className="asset-card fixed-income" data-type={asset.type}>
                  <div className="asset-header">
                    <div className="asset-info">
                      <div className="asset-title-row">
                        <h4>{asset.name}</h4>
                      </div>
                      <p className="asset-name">{asset.type.toUpperCase()}</p>
                      <span className="asset-type">
                        {asset.sector || asset.fiiType || asset.cryptoType || asset.tesouroType || asset.rendaFixaType || asset.type}
                      </span>
                    </div>
                    <div className="asset-actions">
                      <button 
                        className="action-btn delete-btn"
                        onClick={() => handleDeleteAsset(asset.id)}
                        title="Remover ativo"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  
                  <div className="asset-details">
                    <div className="detail-row">
                      <span>Quantidade:</span>
                      <strong>{asset.quantity}</strong>
                    </div>
                    <div className="detail-row">
                      <span>Valor Pago:</span>
                      <strong>R$ {asset.paidValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                    </div>
                    <div className="detail-row">
                      <span>Total Investido:</span>
                      <strong>R$ {asset.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                    </div>
                    <div className="detail-row">
                      <span>Status:</span>
                      <strong className="fixed-income-status">Renda Fixa</strong>
                    </div>
                  </div>
                </div>
              );
            }
          })}
        </div>
      )}

      {/* Modal de Adicionar Ativo */}
      {showModal && (
        <div className="modal-overlay" onClick={() => {
          setShowModal(false);
          setSearchResults([]);
        }}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Adicionar Novo Ativo</h2>
              <button 
                className="close-button"
                onClick={() => {
                  setShowModal(false);
                  setSearchResults([]);
                }}
              >
                ×
              </button>
            </div>
            
            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nome do Ativo *</label>
                <div className="asset-search-container">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Digite o ticker (ex: PETR4, BTC-USD, TESOURO-SELIC, CDB-ITAU)"
                    className="form-input"
                    required
                  />
                  {isSearching && (
                    <div className="search-loading">Buscando...</div>
                  )}
                  {searchResults.length > 0 && (
                    <div className="search-results">
                      {searchResults.map((asset) => (
                        <div
                          key={asset.symbol}
                          className="search-result-item"
                          onClick={() => selectAsset(asset)}
                        >
                          <div className="search-result-info">
                            {asset.logourl && (
                              <img 
                                src={asset.logourl} 
                                alt={asset.symbol}
                                className="search-result-logo"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            )}
                            <div>
                              <strong>{asset.symbol}</strong>
                              <p>{asset.shortName || asset.longName}</p>
                            </div>
                          </div>
                          <div className="search-result-price">
                            R$ {asset.regularMarketPrice?.toFixed(2) || 'N/A'}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Tipo de Ativo *</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                >
                  <option value="">Selecione o tipo</option>
                  <option value="acao">Ação</option>
                  <option value="fii">FII</option>
                  <option value="cripto">Criptomoeda</option>
                  <option value="tesouro">Tesouro</option>
                  <option value="renda-fixa">Renda Fixa</option>
                </select>
              </div>

              {formData.type === 'acao' && (
                <div className="form-group">
                  <label>
                    Setor
                    {isLoadingAssetDetails && (
                      <span className="loading-indicator"> (Carregando...)</span>
                    )}
                  </label>
                  <select
                    name="sector"
                    value={formData.sector}
                    onChange={handleInputChange}
                    className="form-select"
                    disabled={isLoadingAssetDetails}
                  >
                    <option value="">
                      {isLoadingAssetDetails ? 'Carregando setor...' : 'Selecione o setor'}
                    </option>
                    <option value="bancario">Bancário</option>
                    <option value="saude">Saúde</option>
                    <option value="energia">Energia</option>
                    <option value="bens-consumo">Bens de Consumo</option>
                    <option value="tecnologia">Tecnologia</option>
                    <option value="materiais-basicos">Materiais Básicos</option>
                    <option value="industrial">Industrial</option>
                    <option value="utilidades-publicas">Utilidades Públicas</option>
                    <option value="imobiliario">Imobiliário</option>
                    <option value="comunicacao">Comunicação</option>
                    <option value="petroleo-gas">Petróleo e Gás</option>
                    <option value="varejo">Varejo</option>
                    <option value="educacao">Educação</option>
                    <option value="logistica">Logística</option>
                  </select>
                </div>
              )}

              {formData.type === 'fii' && (
                <div className="form-group">
                  <label>Tipo de FII</label>
                  <select
                    name="fiiType"
                    value={formData.fiiType}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="">Selecione o tipo</option>
                    <option value="tijolo">Tijolo (Imóveis Físicos)</option>
                    <option value="papel">Papel (CRI/CRA)</option>
                    <option value="hibrido">Híbrido</option>
                    <option value="logistica">Logística</option>
                    <option value="shopping">Shopping Centers</option>
                    <option value="corporativo">Corporativo</option>
                    <option value="residencial">Residencial</option>
                    <option value="hospitalar">Hospitalar</option>
                    <option value="educacional">Educacional</option>
                  </select>
                </div>
              )}

              {formData.type === 'cripto' && (
                <div className="form-group">
                  <label>
                    Categoria de Criptomoeda
                    {isLoadingAssetDetails && (
                      <span className="loading-indicator"> (Carregando...)</span>
                    )}
                  </label>
                  <select
                    name="cryptoType"
                    value={formData.cryptoType}
                    onChange={handleInputChange}
                    className="form-select"
                    disabled={isLoadingAssetDetails}
                  >
                    <option value="">
                      {isLoadingAssetDetails ? 'Carregando categoria...' : 'Selecione a categoria'}
                    </option>
                    <option value="bitcoin">Bitcoin</option>
                    <option value="ethereum">Ethereum</option>
                    <option value="altcoin">Altcoin</option>
                    <option value="defi">DeFi</option>
                    <option value="meme">Meme Coin</option>
                    <option value="exchange">Token de Exchange</option>
                    <option value="payment">Pagamento</option>
                    <option value="storage">Armazenamento</option>
                    <option value="platform">Plataforma</option>
                    <option value="fork">Fork</option>
                    <option value="stablecoin">Stablecoin</option>
                  </select>
                </div>
              )}

              {formData.type === 'tesouro' && (
                <div className="form-group">
                  <label>
                    Tipo de Título do Tesouro
                    {isLoadingAssetDetails && (
                      <span className="loading-indicator"> (Carregando...)</span>
                    )}
                  </label>
                  <select
                    name="tesouroType"
                    value={formData.tesouroType}
                    onChange={handleInputChange}
                    className="form-select"
                    disabled={isLoadingAssetDetails}
                  >
                    <option value="">
                      {isLoadingAssetDetails ? 'Carregando tipo...' : 'Selecione o tipo'}
                    </option>
                    <option value="selic">Tesouro Selic (Pós-fixado)</option>
                    <option value="prefixado">Tesouro Prefixado</option>
                    <option value="ipca">Tesouro IPCA+ (Híbrido)</option>
                    <option value="igpm">Tesouro IGPM+ (Híbrido)</option>
                    <option value="renda">Tesouro Renda+ (Aposentadoria)</option>
                  </select>
                </div>
              )}

              {formData.type === 'renda-fixa' && (
                <div className="form-group">
                  <label>
                    Tipo de Renda Fixa
                    {isLoadingAssetDetails && (
                      <span className="loading-indicator"> (Carregando...)</span>
                    )}
                  </label>
                  <select
                    name="rendaFixaType"
                    value={formData.rendaFixaType}
                    onChange={handleInputChange}
                    className="form-select"
                    disabled={isLoadingAssetDetails}
                  >
                    <option value="">
                      {isLoadingAssetDetails ? 'Carregando tipo...' : 'Selecione o tipo'}
                    </option>
                    <option value="cdb">CDB (Certificado de Depósito Bancário)</option>
                    <option value="lci">LCI (Letra de Crédito Imobiliário)</option>
                    <option value="lca">LCA (Letra de Crédito do Agronegócio)</option>
                    <option value="cri">CRI (Certificado de Recebíveis Imobiliários)</option>
                    <option value="cra">CRA (Certificado de Recebíveis do Agronegócio)</option>
                    <option value="debenture">Debêntures</option>
                    <option value="lf">LF (Letra Financeira)</option>
                    <option value="lc">LC (Letra de Câmbio)</option>
                    <option value="cdca">CDCA (Certificado de Direitos Creditórios)</option>
                    <option value="fundos-di">Fundos DI</option>
                  </select>
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label>Valor Pago (R$) *</label>
                  <input
                    type="number"
                    name="paidValue"
                    value={formData.paidValue}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Quantidade *</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    min="1"
                    placeholder="1"
                    className="form-input"
                    required
                  />
                </div>
              </div>

              {formData.paidValue && formData.quantity && (
                <div className="total-value">
                  <p>
                    <strong>Total: R$ {(parseFloat(formData.paidValue || 0) * parseInt(formData.quantity || 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                  </p>
                </div>
              )}

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn-cancel"
                  onClick={() => {
                    setShowModal(false);
                    setSearchResults([]);
                  }}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn-add"
                >
                  Adicionar Ativo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Wallet;
