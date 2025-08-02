// utils/portfolioUtils.js

// Função para buscar preços atuais dos ativos (versão simplificada)
export const fetchAssetPrices = async (symbols) => {
  try {
    // Por enquanto, retorna um objeto vazio para não quebrar a aplicação
    // Pode ser implementado posteriormente com a API
    console.log('Buscando preços para:', symbols);
    return {};
  } catch (error) {
    console.error('Erro ao buscar preços dos ativos:', error);
    return {};
  }
};

// Função para calcular métricas do portfolio
export const calculatePortfolioMetrics = (assets, currentPrices) => {
  if (!assets || assets.length === 0) {
    return {
      totalInvested: 0,
      currentValue: 0,
      totalGainLoss: 0,
      totalGainLossPercent: 0
    };
  }

  let totalInvested = 0;
  let currentValue = 0;

  assets.forEach(asset => {
    const invested = asset.quantity * asset.purchasePrice;
    totalInvested += invested;

    const currentPrice = currentPrices[asset.symbol]?.price || asset.purchasePrice;
    const current = asset.quantity * currentPrice;
    currentValue += current;
  });

  const totalGainLoss = currentValue - totalInvested;
  const totalGainLossPercent = totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0;

  return {
    totalInvested,
    currentValue,
    totalGainLoss,
    totalGainLossPercent
  };
};

// Função para formatar valores monetários
export const formatCurrency = (value, currency = 'BRL') => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value || 0);
};

// Função para formatar percentuais
export const formatPercent = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format((value || 0) / 100);
};

// Função para obter cor baseada em ganho/perda
export const getGainLossColor = (value) => {
  if (value > 0) return '#10b981'; // Verde
  if (value < 0) return '#ef4444'; // Vermelho
  return '#6b7280'; // Cinza neutro
};

// Função para categorizar ativos
export const categorizeAsset = (symbol) => {
  if (symbol.endsWith('3') || symbol.endsWith('4') || symbol.endsWith('11')) {
    return 'Ação';
  }
  if (symbol.includes('11') && symbol.length === 6) {
    return 'FII';
  }
  if (['BTC', 'ETH', 'ADA', 'DOT', 'MATIC'].includes(symbol)) {
    return 'Crypto';
  }
  if (['USD', 'EUR', 'GBP', 'JPY'].includes(symbol)) {
    return 'Moeda';
  }
  return 'Outros';
};

// Função para validar símbolo de ativo
export const validateAssetSymbol = (symbol, type) => {
  if (!symbol || symbol.trim() === '') {
    return 'Símbolo é obrigatório';
  }

  const upperSymbol = symbol.toUpperCase().trim();
  
  switch (type) {
    case 'stock':
      if (!/^[A-Z]{4}[34]$/.test(upperSymbol)) {
        return 'Formato inválido para ação (ex: PETR4, VALE3)';
      }
      break;
    case 'fii':
      if (!/^[A-Z]{4}11$/.test(upperSymbol)) {
        return 'Formato inválido para FII (ex: HGLG11, XPML11)';
      }
      break;
    case 'crypto':
      if (!['BTC', 'ETH', 'ADA', 'DOT', 'MATIC'].includes(upperSymbol)) {
        return 'Criptomoeda não suportada';
      }
      break;
    case 'currency':
      if (!['USD', 'EUR', 'GBP', 'JPY'].includes(upperSymbol)) {
        return 'Moeda não suportada';
      }
      break;
    default:
      return null;
  }
  
  return null;
};

export default {
  fetchAssetPrices,
  calculatePortfolioMetrics,
  formatCurrency,
  formatPercent,
  getGainLossColor,
  categorizeAsset,
  validateAssetSymbol
};
