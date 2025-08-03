import React, { useState, useEffect } from 'react';
import { getStockData } from '../services/brapiService';

function StockCard({ 
  ticker = 'ITUB3', 
  showQuantity = false, 
  userQuantity = 0, 
  averagePrice = 0, 
  totalInvested = 0 
}) {
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getStockData(ticker);
        
        if (data && data.results && data.results.length > 0) {
          setStockData(data.results[0]);
        } else {
          setError('Dados não encontrados');
        }
      } catch (err) {
        console.error('Erro ao carregar dados da ação:', err);
        setError('Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
    
    // Atualizar a cada 30 segundos
    const interval = setInterval(fetchStockData, 30000);
    
    return () => clearInterval(interval);
  }, [ticker]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPercentage = (value) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  if (loading) {
    return (
      <div className="stock-card loading">
        <div className="stock-card-header">
          <h3>{ticker}</h3>
        </div>
        <div className="stock-card-content">
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stock-card error">
        <div className="stock-card-header">
          <h3>{ticker}</h3>
        </div>
        <div className="stock-card-content">
          <p className="error-message">{error}</p>
        </div>
      </div>
    );
  }

  if (!stockData) {
    return null;
  }

  const changePercent = stockData.regularMarketChangePercent || 0;
  const isPositive = changePercent >= 0;

  return (
    <div className="stock-card">
      <div className="stock-card-header">
        <div className="stock-info">
          <h3>{stockData.symbol}</h3>
          <p className="stock-name">{stockData.shortName || stockData.longName}</p>
        </div>
        <div className="stock-logo">
          {stockData.logourl && (
            <img src={stockData.logourl} alt={stockData.symbol} />
          )}
        </div>
      </div>
      
      <div className="stock-card-content">
        <div className="stock-price">
          <span className="current-price">
            {formatCurrency(stockData.regularMarketPrice)}
          </span>
        </div>
        
        <div className={`stock-change ${isPositive ? 'positive' : 'negative'}`}>
          <span className="change-value">
            {formatCurrency(stockData.regularMarketChange || 0)}
          </span>
          <span className="change-percent">
            ({formatPercentage(changePercent)})
          </span>
        </div>
        
        <div className="stock-details">
          <div className="detail-item">
            <span>Abertura:</span>
            <span>{formatCurrency(stockData.regularMarketOpen || 0)}</span>
          </div>
          <div className="detail-item">
            <span>Máx:</span>
            <span>{formatCurrency(stockData.regularMarketDayHigh || 0)}</span>
          </div>
          <div className="detail-item">
            <span>Mín:</span>
            <span>{formatCurrency(stockData.regularMarketDayLow || 0)}</span>
          </div>
        </div>
        
        {/* Informações da carteira do usuário */}
        {showQuantity && (
          <div className="wallet-info">
            <div className="wallet-divider">Sua Posição</div>
            <div className="detail-item">
              <span>Quantidade:</span>
              <span>{userQuantity}</span>
            </div>
            <div className="detail-item">
              <span>Preço Médio:</span>
              <span>{formatCurrency(averagePrice)}</span>
            </div>
            <div className="detail-item">
              <span>Total Investido:</span>
              <span>{formatCurrency(totalInvested)}</span>
            </div>
            <div className="detail-item">
              <span>Valor Atual:</span>
              <span>{formatCurrency(stockData.regularMarketPrice * userQuantity)}</span>
            </div>
            <div className="detail-item wallet-result">
              <span>Resultado:</span>
              <span className={
                (stockData.regularMarketPrice * userQuantity - totalInvested) >= 0 ? 'positive' : 'negative'
              }>
                {formatCurrency(stockData.regularMarketPrice * userQuantity - totalInvested)}
                {' '}
                ({formatPercentage(((stockData.regularMarketPrice * userQuantity - totalInvested) / totalInvested) * 100)})
              </span>
            </div>
          </div>
        )}
        
        <div className="last-update">
          <small>
            Última atualização: {new Date().toLocaleTimeString('pt-BR')}
          </small>
        </div>
      </div>
    </div>
  );
}

export default StockCard;
