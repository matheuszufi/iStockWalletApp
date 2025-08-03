// Teste da API com múltiplos ativos
const axios = require('axios');

async function testMultipleAPI() {
  try {
    console.log('🧪 Testando API com múltiplos ativos...');
    
    const tickers = ['PETR4', 'VALE3', 'ITUB4'];
    const response = await axios.get(`https://brapi.dev/api/quote/${tickers.join(',')}?token=2tV7KV3mJU7zGG9Uzhq6ac`);
    
    console.log('✅ Resposta da API:');
    console.log('📊 Total de resultados:', response.data.results?.length || 0);
    
    if (response.data && response.data.results) {
      response.data.results.forEach(stock => {
        console.log(`💰 ${stock.symbol}: R$ ${stock.regularMarketPrice} - ${stock.shortName}`);
      });
    } else {
      console.log('❌ Nenhum resultado encontrado');
    }
    
  } catch (error) {
    console.error('❌ Erro na API:', error.message);
  }
}

testMultipleAPI();
