import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../index.css';
import grafico from '../assets/png/graficoex.jpg'
import PersonalInfosCard from './PersonalInfosCard';
import { Link } from 'react-router-dom'

const CardsETF = () => {
    const [results, setResults] = useState(null);
    // const [resultsDY, setResultsDY] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      const fetchData = async () => {
  
        try {
          const response = await axios.get("https://brapi.dev/api/quote/IVVB11,BOVA11,AAPL34?range=5y&fundamental=true&dividends=true")
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
                    <PersonalInfosCard />
                  </div>
                </div>
                <div className='cartao-header-right-bottom'>
                  <p>VALOR ATUAL:</p>
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
  
  export default CardsETF;
  