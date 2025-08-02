// Serviço de API para cotações de ações brasileiras
const API_BASE_URL = 'https://brapi.dev/api';

class StockAPIService {
  constructor() {
    // Cache para evitar muitas requisições
    this.cache = new Map();
    this.cacheExpiry = new Map();
    this.CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
  }

  // Verifica se o cache é válido
  isCacheValid(key) {
    const expiry = this.cacheExpiry.get(key);
    return expiry && Date.now() < expiry;
  }

  // Busca ações com cache inteligente
  async searchStocks(query) {
    const cacheKey = `search_${query.toLowerCase()}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/available`);
      const data = await response.json();
      
      // Filtra os resultados baseado na query
      const filteredStocks = data.stocks
        .filter(stock => 
          stock.toLowerCase().includes(query.toLowerCase()) ||
          this.getCompanyName(stock).toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 15) // Limita a 15 resultados
        .map(symbol => ({
          symbol: symbol,
          name: this.getCompanyName(symbol),
          type: this.getAssetType(symbol),
          exchange: 'B3'
        }));

      // Armazena no cache
      this.cache.set(cacheKey, filteredStocks);
      this.cacheExpiry.set(cacheKey, Date.now() + this.CACHE_DURATION);
      
      return filteredStocks;
    } catch (error) {
      console.error('Erro ao buscar ações:', error);
      return this.getFallbackResults(query);
    }
  }

  // Busca cotação atual de uma ação
  async getStockQuote(symbol) {
    const cacheKey = `quote_${symbol}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/quote/${symbol}`);
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const stock = data.results[0];
        const quote = {
          symbol: stock.symbol,
          name: stock.longName || stock.shortName,
          price: stock.regularMarketPrice,
          change: stock.regularMarketChange,
          changePercent: stock.regularMarketChangePercent,
          previousClose: stock.regularMarketPreviousClose,
          marketCap: stock.marketCap,
          volume: stock.regularMarketVolume,
          currency: stock.currency || 'BRL',
          lastUpdate: new Date().toISOString()
        };

        // Armazena no cache
        this.cache.set(cacheKey, quote);
        this.cacheExpiry.set(cacheKey, Date.now() + this.CACHE_DURATION);
        
        return quote;
      }
    } catch (error) {
      console.error(`Erro ao buscar cotação de ${symbol}:`, error);
    }
    
    return null;
  }

  // Busca cotações múltiplas de uma vez (otimizado)
  async getMultipleQuotes(symbols) {
    if (!symbols || symbols.length === 0) return {};

    try {
      // BRAPI permite buscar múltiplas ações em uma única requisição
      const symbolsStr = symbols.join(',');
      const response = await fetch(`${API_BASE_URL}/quote/${symbolsStr}`);
      const data = await response.json();
      
      const quotes = {};
      if (data.results) {
        data.results.forEach(stock => {
          quotes[stock.symbol] = {
            symbol: stock.symbol,
            name: stock.longName || stock.shortName,
            price: stock.regularMarketPrice,
            change: stock.regularMarketChange,
            changePercent: stock.regularMarketChangePercent,
            previousClose: stock.regularMarketPreviousClose,
            volume: stock.regularMarketVolume,
            currency: stock.currency || 'BRL',
            lastUpdate: new Date().toISOString()
          };
        });
      }

      return quotes;
    } catch (error) {
      console.error('Erro ao buscar múltiplas cotações:', error);
      return {};
    }
  }

  // Busca dados históricos para uma data específica
  async getHistoricalPrice(symbol, date) {
    try {
      // Formato da data: YYYY-MM-DD
      const formattedDate = date.split('T')[0];
      const response = await fetch(`${API_BASE_URL}/quote/${symbol}?range=1d&interval=1d`);
      const data = await response.json();
      
      // Para dados históricos mais precisos, usaríamos uma API premium
      // Por enquanto, retornamos o preço atual como fallback
      if (data.results && data.results.length > 0) {
        const stock = data.results[0];
        return {
          symbol: symbol,
          date: formattedDate,
          price: stock.regularMarketPrice,
          open: stock.regularMarketOpen,
          high: stock.regularMarketDayHigh,
          low: stock.regularMarketDayLow,
          close: stock.regularMarketPrice,
          volume: stock.regularMarketVolume
        };
      }
    } catch (error) {
      console.error(`Erro ao buscar dados históricos de ${symbol}:`, error);
    }
    
    return null;
  }

  // Determina o tipo de ativo baseado no símbolo
  getAssetType(symbol) {
    if (symbol.endsWith('11')) return 'FII';
    if (symbol.endsWith('34') || symbol.endsWith('35')) return 'BDR';
    if (symbol.includes('ETF') || symbol.startsWith('BOVA')) return 'ETF';
    if (symbol.endsWith('3') || symbol.endsWith('4')) return 'Ação';
    return 'Outro';
  }

  // Mapeia símbolos para nomes de empresas (base de dados simplificada)
  getCompanyName(symbol) {
    const companies = {
      'PETR4': 'Petróleo Brasileiro S.A. - Petrobras',
      'VALE3': 'Vale S.A.',
      'ITUB4': 'Itaú Unibanco Holding S.A.',
      'BBDC4': 'Banco Bradesco S.A.',
      'ABEV3': 'Ambev S.A.',
      'B3SA3': 'B3 S.A. - Brasil, Bolsa, Balcão',
      'MGLU3': 'Magazine Luiza S.A.',
      'WEGE3': 'WEG S.A.',
      'SUZB3': 'Suzano S.A.',
      'RENT3': 'Localiza Rent a Car S.A.',
      'LREN3': 'Lojas Renner S.A.',
      'GGBR4': 'Gerdau S.A.',
      'USIM5': 'Usinas Siderúrgicas de Minas Gerais S.A.',
      'CSNA3': 'Companhia Siderúrgica Nacional',
      'JBSS3': 'JBS S.A.',
      'HGLG11': 'Hospital General Ibirapuera FII',
      'XPML11': 'XP Malls Fundo de Investimento Imobiliário',
      'HGRE11': 'CSHG Real Estate Fundo de Investimento Imobiliário',
      'BOVA11': 'iShares Núcleo IBOVESPA Fundo de Índice',
      'IVVB11': 'iShares Core S&P 500 Fundo de Índice',
      'SMAL11': 'iShares MSCI Brazil Small Cap Fundo de Índice'
    };
    
    return companies[symbol] || symbol;
  }

  // Retorna resultados de fallback quando a API falha
  getFallbackResults(query) {
    const fallbackStocks = [
      { symbol: 'PETR4', name: 'Petróleo Brasileiro S.A. - Petrobras', type: 'Ação', exchange: 'B3' },
      { symbol: 'VALE3', name: 'Vale S.A.', type: 'Ação', exchange: 'B3' },
      { symbol: 'ITUB4', name: 'Itaú Unibanco Holding S.A.', type: 'Ação', exchange: 'B3' },
      { symbol: 'BBDC4', name: 'Banco Bradesco S.A.', type: 'Ação', exchange: 'B3' },
      { symbol: 'ABEV3', name: 'Ambev S.A.', type: 'Ação', exchange: 'B3' },
      { symbol: 'HGLG11', name: 'Hospital General Ibirapuera FII', type: 'FII', exchange: 'B3' },
      { symbol: 'XPML11', name: 'XP Malls FII', type: 'FII', exchange: 'B3' },
      { symbol: 'BOVA11', name: 'iShares Núcleo IBOVESPA', type: 'ETF', exchange: 'B3' }
    ];

    return fallbackStocks.filter(stock => 
      stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
      stock.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Limpa o cache (útil para forçar atualização)
  clearCache() {
    this.cache.clear();
    this.cacheExpiry.clear();
  }
}

// Instância singleton
const stockAPI = new StockAPIService();

export default stockAPI;
