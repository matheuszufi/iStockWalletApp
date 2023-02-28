import { Link } from 'react-router-dom'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../index.css';

const AESB3 = () => {
    const [results, setResults] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get("https://brapi.dev/api/quote/AESB3?range=max&fundamental=true&dividends=true")
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
          return <div key='relatorioAESB3' className='container-stock'>
              <div className='stock-header'>
                <div className='stock-header-logo'>
                  <img  alt="Stock Logo" src={result.logourl} />
                </div>
                <div className='stock-header-name'>
                  <h1>{result.longName}</h1>
                  <p>{result.symbol}</p>
                </div>
     
                <div className='stock-header-value'>
                  <p>R${result.regularMarketPrice.toFixed(2)}</p>
                </div>
         
     
     
     
     
             </div>
          
          
        

            
        
          </div>

        }))
    )
  };
  
  export default AESB3;
  