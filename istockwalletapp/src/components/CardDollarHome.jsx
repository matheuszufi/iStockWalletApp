import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../index.css';
import USAicon from '../assets/png/usaico.png'

const CardDollarHome = () => {
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get("https://brapi.dev/api/v2/currency?currency=USD-BRL%2CEUR-USD%2CETH-BRL%2CBTC-BRL")
          const result = response.data.currency
          setResult(result);
           console.log(result) 
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
        ) : result && result.length > 0 ? (   
                <div className='cartao-home'>
                    <div className='cartao-home-header'>
                        <div className='cartao-home-header-left'> 
                        <div className='currency-img'>
                        <img className='usa-icon' alt="Stock Logo" src={USAicon} />
                        </div>
                         
                        </div>
                        <div className='cartao-home-header-mid'>
                            <h1>{result[0]?.name || 'Dólar'}</h1>
                            <p>{result[0]?.fromCurrency || 'USD'}</p>
                            
                        </div>
                        <div className='cartao-home-header-right'>
                            <p>Valor:</p>
                            <h2>R${result[0]?.askPrice || 'N/A'}</h2>
                        </div>
                      
                    </div> 
                </div>
        ) : (
          <div className='cartao-home'>
            <p>Erro ao carregar dados do câmbio</p>
          </div>
        )
    )
  };
  
  export default CardDollarHome;
  