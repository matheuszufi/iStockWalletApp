import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../index.css';



const Abev3Itub4ValueScraper = () => {
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {

      try {
        const response = await axios.get("https://brapi.dev/api/quote/PETR4,MGLU3,TAEE11")
        const results = response.data.results
        
        setResults(results);

        setIsLoading(false);
      } catch (error) {
        console.error('Erro ao fazer requisição:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
      isLoading ? (
        <p>Carregando...</p>
      ) : (
      results.map(result => {
        console.log(result)
        return <div key={result.symbol} className='cartao'>
          <div className='cartao-header'>
            <div className='cartao-header-left'>
                <h1>{result.longName}</h1>
                <p>{result.symbol}</p>
            </div>
            <div className='cartao-header-right'>
                <p>Valor atual:</p>
                <h2>R${result.regularMarketPrice.toFixed(2)}</h2>
            </div>
          </div>
        </div>
      }))
  )
};

export default Abev3Itub4ValueScraper;
