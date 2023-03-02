import { Link } from 'react-router-dom'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../index.css';
import grafico from '../assets/png/graficoex.jpg'

const Cards = () => {
    const [results, setResults] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get("https://brapi.dev/api/quote/AESB3,ABEV3,BBAS3,BBSE3,BBDC4,CPLE6,EGIE3,FLRY3,HYPE3,ITUB4,ITSA4,KLBN11,MDIA3,MGLU3,ODPV3,PETR4,PSSA3,RADL3,SAPR11,TAEE11,VALE3,WEGE3?range=max&fundamental=true&dividends=true")
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

        return <div className='cartao-with-increments'> 
                <div key={result} className='cartao'>
                  <div className='cartao-header'>
                    <Link to={`/wallet/${result.symbol}`} className='link-empresa'>  
                    <div className='cartao-header-left'> 
                      <img  alt="Stock Logo" src={result.logourl} />
                    </div>
                    <div className='cartao-header-mid'>
                      <h1>{result.longName}</h1>
                      <p>{result.symbol}</p>
                    </div>
                    </Link>
                    <div className='cartao-header-right'>
                      <div className='cartao-header-right-top'>
                        <div className='cartao-number'>
                          <div className='cartao-number-decrement'>-</div>
                          <div className='cartao-number-number'>0</div>
                          <div className='cartao-number-increment'>+</div>
                        </div>
                      </div>
                      <div className='cartao-header-right-bottom'>
                        <p>Valor:</p>
                        <h2>R${result.regularMarketPrice.toFixed(2)}</h2>
                      </div>
                    </div>

                  </div>
                </div>
               
                <div className='grafico'>
                  <img src={grafico} />
                </div>
            
 
        </div>
        }))
    )
  };
  
  export default Cards;
  