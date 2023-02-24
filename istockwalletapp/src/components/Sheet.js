import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Sheet = () => {
  const [itauStockValue, setItauStockValue] = useState(0);

  useEffect(() => {
    const fetchItauStockValue = async () => {
      const response = await axios.get('https://cloud.iexapis.com/stable/stock/ITUB/quote?token=pk_b59b0d57bc01466db3aa143cae969ec7'); // Inserir URL da API da IEX Cloud e seu token de acesso
      setItauStockValue(response.data.latestPrice);
    };

    fetchItauStockValue();
    const interval = setInterval(() => {
      fetchItauStockValue();
    }, 5000); // Atualiza o valor a cada 5 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>Valor da ação ITUB:</h2>
      <p>R$ {itauStockValue.toFixed(2)}</p>
    </div>
  );
};

export default Sheet;
