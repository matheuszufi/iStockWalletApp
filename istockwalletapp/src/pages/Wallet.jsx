import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../index.css';

import Sheet from '../components/Sheet';
import PlanilhaGoogle from '../components/PlanilhaGoogle';

const API_KEY = 'EZL3XCWTMYZEL4MD';
const API_KEY2 = '1N7LZJYVH9JVQ0LH';
const API_KEY3 = '7BMTHDRHWL4TWMDG';
const API_KEY4 = 'RGO3PWMCJ78FJNP4';

const Abev3Itub4ValueScraper = () => {
  const [abev3Value, setAbev3Value] = useState(null);
  const [itub4Value, setItub4Value] = useState(null);
  const [klbn11Value, setKlbn11Value] = useState(null);
  // const [taee11Value, setTaee11Value] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const abev3Url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=ABEV3.SAO&apikey=${API_KEY}`;
      const itub4Url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=ITUB4.SAO&apikey=${API_KEY2}`;
      const klbn11Url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=KLBN11.SAO&apikey=${API_KEY3}`;
      // const taee11Url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=TAEE11.SAO&apikey=${API_KEY4}`;


      try {
        // ABEV
        const abev3Response = await axios.get(abev3Url, { mode: 'cors' });
        const abev3Data = abev3Response.data;

        const abev3ValueText = abev3Data['Global Quote']['05. price'];
        const parsedAbev3Value = parseFloat(abev3ValueText);

        setAbev3Value(parsedAbev3Value);

        //ITUB
        const itub4Response = await axios.get(itub4Url, { mode: 'cors' });
        const itub4Data = itub4Response.data;

        const itub4ValueText = itub4Data['Global Quote']['05. price'];
        const parsedItub4Value = parseFloat(itub4ValueText);

        setItub4Value(parsedItub4Value);

        //KLBN
        const klbn11Response = await axios.get(klbn11Url, { mode: 'cors' });
        const klbn11Data = klbn11Response.data;

        const klbn11ValueText = klbn11Data['Global Quote']['05. price'];
        const parsedklbn11Value = parseFloat(klbn11ValueText);

        setKlbn11Value(parsedklbn11Value);

        // //TAEE
        // const taee11Response = await axios.get(taee11Url, { mode: 'cors' });
        // const taee11Data = taee11Response.data;

        // const taee11ValueText = taee11Data['Global Quote']['05. price'];
        // const parsedtaee11Value = parseFloat(taee11ValueText);

        // setTaee11Value(parsedtaee11Value);
        

        setIsLoading(false);
      } catch (error) {
        console.error('Erro ao fazer requisição:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {isLoading ? (
        <p>Carregando...</p>
      ) : (
        <>
        <div></div>
        <div className='cartao'>
            <div className='cartao-header'>
                <div className='cartao-header-left'>
                    <h1>Ambev</h1>
                    <p>ABEV3</p>
                </div>
                <div className='cartao-header-right'>
                    <p>Valor atual:</p>
                    <h2>R${abev3Value.toFixed(2)}</h2>

                </div>
            </div>
        </div>
        
        <div className='cartao'>
            <div className='cartao-header'>
                <div className='cartao-header-left'>
                    <h1>Itaú</h1>
                    <p>ITUB3</p>
                </div>
                <div className='cartao-header-right'>
                    <p>Valor atual:</p>
                    <h2>R${itub4Value.toFixed(2)}</h2>

                </div>
            </div>
        </div>

        <div className='cartao'>
            <div className='cartao-header'>
                <div className='cartao-header-left'>
                    <h1>Klabin</h1>
                    <p>KLBN11</p>
                </div>
                <div className='cartao-header-right'>
                    <p>Valor atual:</p>
                    <h2>R${klbn11Value.toFixed(2)}</h2>

                </div>
            </div>
        </div>
        {/* <div className='cartao'>
            <div className='cartao-header'>
                <div className='cartao-header-left'>
                    <h1>Taesa</h1>
                    <p>TAEE11</p>
                </div>
                <div className='cartao-header-right'>
                    <p>Valor atual:</p>
                    <h2>R${taee11Value.toFixed(2)}</h2>

                </div>
            </div>
        </div> */}
        
        <Sheet/>
        <PlanilhaGoogle />



        </>
      )}
    </div>
  );
};

export default Abev3Itub4ValueScraper;
