import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../index.css';

const CardsHome = () => {
    const [results, setResults] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get("https://brapi.dev/api/quote/BBAS3,PETR4,VALE3?range=max&fundamental=true&dividends=true")
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
        ) : results && results.length > 0 ? (
        results.map(result => {
          
          console.log(result[1])

          return <div key={result.symbol} className='cartao-home'>
            <div className='cartao-home-header'>
              <div className='cartao-home-header-left'> 
                <img  alt="Stock Logo" src={result.logourl} />
              </div>
              <div className='cartao-home-header-mid'>
                  <h1>{result.longName}</h1>
                  <p>{result.symbol}</p>
              </div>
              <div className='cartao-home-header-right'>
                  <p>Valor:</p>
                  <h2>R${result.regularMarketPrice?.toFixed(2) || 'N/A'}</h2>
              </div>
            </div>


        
          </div>
        })
        ) : (
          <div className='cartao-home'>
            <p>Erro ao carregar dados das ações</p>
          </div>
        )
    )
  };
  
  export default CardsHome;
  