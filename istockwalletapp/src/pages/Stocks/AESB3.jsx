import { Link } from 'react-router-dom'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {FaChevronDown, FaQuestionCircle, FaPenSquare} from 'react-icons/fa'
import '../../styles/stock.css';
import grafico from '../../assets/png/graficoex.jpg'


const cheerio = require("cheerio");


const AESB3 = () => {
    const [showIndicators, setShowIndicators] = useState(false);
    const [results, setResults] = useState(null);
    const [isLoading, setIsLoading] = useState(true);


    const toggleIndicators = () => {
      setShowIndicators(!showIndicators);
    }
  
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
                <div className='stock-header-left'>
                <div className='stock-header-logo'>
                  <img  alt="Stock Logo" src={result.logourl} />
                </div>
                <div className='stock-header-name'>
                  <h1>{result.longName}</h1>
                  <p>{result.symbol}</p>
                </div>
                </div>
                <div className='stock-header-value'>
                  <p>R${result.regularMarketPrice.toFixed(2)}</p>
                  <div className='stock-amount'><label for="stock-amount">N° DE AÇÕES:</label><input id="stock-amount" type="number"></input><FaPenSquare /></div>
                  <div className='stock-average-price'><label for="stock-average-price">PREÇO MÉDIO:</label><input id="stock-average-price"></input><FaPenSquare /></div>
                </div>
         
     
     
     
     
             </div>
          
            <div className='stock-content'>
          
          
          
          <div className='stock-infos'>
            <div className='stock-infos-header'>
              <h1>INFOS:</h1>
              
            </div>
            <div className='stock-infos-body'>

            </div>
          </div>
           
           
           
           
           
            <div className='stock-index'>
                <div className='stock-index-header'>
                  <h1>INDICE:</h1>
                </div>
                <div className='stock-index-body'>
                  <img src={grafico} />
         
                </div>
       
              </div>
          
          
          
          
            <div className={`stock-indicators ${showIndicators ? 'show' : ''}`}>
                <div className='stock-indicators-header'>
                  <h1>INDICADORES:</h1>
                  <FaChevronDown className={`chevronicon ${!showIndicators ? 'show' : ''}`} onClick={() => toggleIndicators()} />

                </div>

  

                <div className='stock-indicators-body'>   
     
                  <div className='stock-indicators-valuation'>
                    <div className='stock-indicators-valuation-header'>
                      <h1>INDICADORES DE VALUATION</h1>
                    </div>
                    <div className='stock-indicators-valuation-body'>
                    <div className='stock-indicator'><FaQuestionCircle className='info-icon'/><p>D.Y.</p><p>1,08%</p></div>
                    <div className='stock-indicator'><p>P/L</p><p>40,09</p></div>
                    <div className='stock-indicator'><p>PEG RATIO</p><p>-</p></div>
                    <div className='stock-indicator'><p>P/VP</p><p>1,08</p></div>
                    <div className='stock-indicator'><p>EV/EBITDA</p><p>-</p></div>
                    <div className='stock-indicator'><p>EV/EBIT</p><p>18,79</p></div>
                    <div className='stock-indicator'><p>P/EBITDA</p><p>-</p></div>
                    <div className='stock-indicator'><p>P/EBIT</p><p>8,60</p></div>
                    <div className='stock-indicator'><p>VPA</p><p>9,26</p></div>
                    <div className='stock-indicator'><p>P/ATIVO</p><p>0,32</p></div>
                    <div className='stock-indicator'><p>LPA</p><p>0,25</p></div>
                    <div className='stock-indicator'><p>P/SR</p><p>2,11</p></div>
                    <div className='stock-indicator'><p>P/CAP. GIRO</p><p>2,04</p></div>
                    <div className='stock-indicator'><p>P/ATIVO CIRC. LIQ</p><p>-0,42</p></div>
                    </div>
                  </div>

                  <div className={`division-indicators ${!showIndicators ? 'show' : ''}`}></div>

                  <div className={`stock-indicators-indebtedness ${!showIndicators ? 'show' : ''}`}>
                    <div className='stock-indicators-indebtedness-header'>
                      <h1>INDICADORES DE ENDIVIDAMENTO</h1>
                    </div>
                    <div className='stock-indicators-indebtedness-body'>
                      <div className='stock-indicator'><p>DIV. LIQUIDA/PL</p><p>1,28</p></div>
                      <div className='stock-indicator'><p>DIV. LIQUIDA/ EBITDA</p><p>-</p></div>
                      <div className='stock-indicator'><p>DIV. LIQUIDA/ EBIT</p><p>10,19</p></div>
                      <div className='stock-indicator'><p>PL/ATIVOS</p><p>0,29</p></div>
                      <div className='stock-indicator'><p>PASSIVOS/ ATIVOS</p><p>0,71</p></div>
                      <div className='stock-indicator'><p>LIQ. CORRENTE</p><p>2,60</p></div>
                    </div>
                  </div>
                  
                  <div className={`division-indicators ${!showIndicators ? 'show' : ''}`}></div>

                  <div className={`stock-indicators-efficiency ${!showIndicators ? 'show' : ''}`}>
                    <div className='stock-indicators-efficiency-header'>
                      <h1>INDICADORES DE EFICIENCIA</h1>
                    </div>
                    <div className='stock-indicators-efficiency-body'>
                      <div className='stock-indicator'><p>M. BRUTA</p><p>31,84%</p></div>
                      <div className='stock-indicator'><p>M. EBITDA</p><p>-%</p></div>
                      <div className='stock-indicator'><p>M. EBIT</p><p>24,53%</p></div>
                      <div className='stock-indicator'><p>M. LIQUIDA</p><p>5,26%</p></div>
                    </div>
                  </div>

                  <div className={`division-indicators ${!showIndicators ? 'show' : ''}`}></div>

                  <div className={`stock-indicators-profitability ${!showIndicators ? 'show' : ''}`}>
                    <div className='stock-indicators-profitability-header'>
                      <h1>INDICADORES DE RENTABILIDADE</h1>
                    </div>
                    <div className='stock-indicators-profitability-body'>
                      <div className='stock-indicator'><p>ROE:</p><p>2,69%</p></div>
                      <div className='stock-indicator'><p>ROA:</p><p>0,795</p></div>
                      <div className='stock-indicator'><p>ROIC:</p><p>3,82%</p></div>
                      <div className='stock-indicator'><p>GIRO:</p><p>0,15</p></div>
                    </div>
                  </div>

                  <div className={`division-indicators ${!showIndicators ? 'show' : ''}`}></div>

                  <div className={`stock-indicators-growth ${!showIndicators ? 'show' : ''}`}>
                    <div className='stock-indicators-growth-header'>
                      <h1>INDICADORES DE CRESCIMENTO</h1>
                    </div>
                    <div className='stock-indicators-growth-body'>
                      <div className='stock-indicator'><p>CAGR RECEITAS 5 ANOS:</p><p>-%</p></div>
                      <div className='stock-indicator'><p>CAGR LUCROS 5 ANOS:</p><p>-%</p></div>
                    </div>
                  </div>
      
                  <div className={`division-indicators ${!showIndicators ? 'show' : ''}`}></div>
                </div>
              </div>

       

            </div>
          
        

            
        
          </div>

        }))
    )
  };
  
  export default AESB3;
  