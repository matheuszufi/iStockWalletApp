import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../index.css';


const CardsFII = () => {
    const [results, setResults] = useState(null);
    // const [resultsDY, setResultsDY] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      const fetchData = async () => {
  
        try {
          const response = await axios.get("https://brapi.dev/api/quote/BCFF11,HGLG11,KNCR11,KNRI11,MXRF11,XPLG11?range=5y&fundamental=true&dividends=true")
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
                <img alt="Stock Logo" src={result.logourl} />
              </div>
              <div className='cartao-header-mid'>
                  <h1>{result.longName}</h1>
                  <p>{result.symbol}</p>
              </div>
              <div className='cartao-header-right'>
                  <p>Valor:</p>
                  <h2>R${result.regularMarketPrice.toFixed(2)}</h2>
              </div>
            </div>

            <div className='cartao-div-respo'>
            <div className='cartao-body'>

              <div className='cartao-body-item'>
                <h6>V.M.:  </h6>
                <p> R${result.marketCap.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}</p>
              </div>

              {/* <div className='cartao-body-item'>
                <h6>Total de ações:</h6>
                <p>{(result.marketCap/result.regularMarketPrice).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}</p>       
              </div> */}
              {/*     
              <div className='cartao-body-item'>
                <h6>P/L:</h6>
                <p>{result.priceEarnings}</p>         
              </div> */}

              </div>

              <div className='cartao-footer'>
                <button>VER RELATÓRIO</button>
              </div>
            </div>
         
         

          </div>
        }))
    )
  };
  
  export default CardsFII;
  