import { Link } from 'react-router-dom'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../index.css';
import grafico from '../assets/png/graficoex.jpg'
// import BTCicon from '../assets/png/btc.png'
import PersonalInfosCard from './PersonalInfosCard';
import {FaBitcoin} from 'react-icons/fa'

const CardBTC = () => {
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get("https://brapi.dev/api/v2/currency?currency=USD-BRL%2CEUR-BRL%2CETH-BRL%2CBTC-BRL")
          const result = response.data.currency
          setResult(result);
     
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
        ) : (   <div className='cartao-with-increments'> 
                  <div key={result} className='cartao'>
                    <div className='cartao-header'>
                      <Link to={`/wallet/${result[3].fromCurrency}`} className='link-empresa'>  
                      <div className='cartao-header-left'> 
                      <div className='currency-img'> 
                      <FaBitcoin />
                      {/* <img className='btc-icon' alt="Stock Logo" src={BTCicon} /> */}
                      </div>
                   
                      </div>
                      <div className='cartao-header-mid'>
                        <h1>{result[3].name}</h1>
                        <p>{result[3].fromCurrency}</p>
                        <span className='stock-percent-profit'>0,00%</span>
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
                          <h2>R${result[3].askPrice}</h2>
                          
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='grafico'>
                    <img src={grafico} />
                  </div>
                </div>
        )
    )
  };
  
  export default CardBTC;
  