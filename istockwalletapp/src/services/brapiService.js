import axios from 'axios';

const BRAPI_BASE_URL = 'https://brapi.dev/api';
const API_KEY = '2tV7KV3mJU7zGG9Uzhq6ac';

// Configuração do axios para a API da Brapi
const brapiApi = axios.create({
  baseURL: BRAPI_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para adicionar a chave da API em todas as requisições
brapiApi.interceptors.request.use((config) => {
  config.params = {
    ...config.params,
    token: API_KEY
  };
  return config;
});

// Função para buscar dados de uma ação específica
export const getStockData = async (ticker) => {
  try {
    const response = await brapiApi.get(`/quote/${ticker}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar dados da ação:', error);
    throw error;
  }
};

// Função para buscar dados de múltiplas ações
export const getMultipleStocks = async (tickers) => {
  try {
    const tickersString = Array.isArray(tickers) ? tickers.join(',') : tickers;
    const response = await brapiApi.get(`/quote/${tickersString}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar dados das ações:', error);
    throw error;
  }
};

// Função para buscar dados do mercado (índices)
export const getMarketData = async () => {
  try {
    const response = await brapiApi.get('/quote/list');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar dados do mercado:', error);
    throw error;
  }
};

// Função para buscar informações de dividendos
export const getDividends = async (ticker) => {
  try {
    const response = await brapiApi.get(`/quote/${ticker}/dividends`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar dividendos:', error);
    throw error;
  }
};

export default brapiApi;
