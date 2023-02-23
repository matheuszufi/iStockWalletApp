import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_KEY = '1N7LZJYVH9JVQ0LH';

const Abev3Itub4ValueScraper = () => {
  const [abev3Value, setAbev3Value] = useState(null);
  const [itub4Value, setItub4Value] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const abev3Url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=ABEV3.SAO&apikey=${API_KEY}`;
      const itub4Url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=ITUB4.SAO&apikey=${API_KEY}`;

      try {
        const abev3Response = await axios.get(abev3Url, { mode: 'cors' });
        const abev3Data = abev3Response.data;

        const abev3ValueText = abev3Data['Global Quote']['05. price'];
        const parsedAbev3Value = parseFloat(abev3ValueText);

        setAbev3Value(parsedAbev3Value);

        const itub4Response = await axios.get(itub4Url, { mode: 'cors' });
        const itub4Data = itub4Response.data;

        const itub4ValueText = itub4Data['Global Quote']['05. price'];
        const parsedItub4Value = parseFloat(itub4ValueText);

        setItub4Value(parsedItub4Value);

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
          <p>Valor da Ação ABEV3: R${abev3Value.toFixed(2)}</p>
          <p>Valor da Ação ITUB4: R${itub4Value.toFixed(2)}</p>
        </>
      )}
    </div>
  );
};

export default Abev3Itub4ValueScraper;
