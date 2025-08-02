import React, { useState, useEffect } from 'react';
import { db } from '../firebase.config';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { toast } from 'react-toastify';
import { 
  fetchAssetPrices, 
  calculatePortfolioMetrics, 
  formatCurrency, 
  formatPercent, 
  getGainLossColor,
  categorizeAsset 
} from '../utils/portfolioUtils';
import '../index.css';

const UserPortfolio = ({ refreshTrigger }) => {
  const [assets, setAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPrices, setCurrentPrices] = useState({});
  const [portfolioMetrics, setPortfolioMetrics] = useState({
    totalInvested: 0,
    currentValue: 0,
    totalGainLoss: 0,
    totalGainLossPercent: 0
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserAssets();
  }, [refreshTrigger]);

  useEffect(() => {
    if (assets.length > 0) {
      updateCurrentPrices();
    }
  }, [assets]);

  const updateCurrentPrices = async () => {
    try {
      const symbols = assets.map(asset => asset.symbol);
      const prices = await fetchAssetPrices(symbols);
      setCurrentPrices(prices);
      
      const metrics = calculatePortfolioMetrics(assets, prices);
      setPortfolioMetrics(metrics);
    } catch (error) {
      console.error('Erro ao atualizar preços:', error);
    }
  };

  const fetchUserAssets = async () => {
    try {
      setError(null);
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        console.log('Usuário não autenticado');
        setAssets([]);
        setIsLoading(false);
        return;
      }

      const q = query(
        collection(db, 'portfolios'),
        where('userId', '==', user.uid)
      );

      const querySnapshot = await getDocs(q);
      const userAssets = [];

      querySnapshot.forEach((doc) => {
        const asset = { id: doc.id, ...doc.data() };
        userAssets.push(asset);
      });

      setAssets(userAssets);
    } catch (error) {
      console.error('Erro ao carregar ativos:', error);
      setError('Erro ao carregar seus ativos. Tente novamente.');
      setAssets([]);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAsset = async (assetId) => {
    if (window.confirm('Tem certeza que deseja remover este ativo?')) {
      try {
        await deleteDoc(doc(db, 'portfolios', assetId));
        toast.success('Ativo removido com sucesso');
        fetchUserAssets();
      } catch (error) {
        console.error('Erro ao remover ativo:', error);
        toast.error('Erro ao remover ativo');
      }
    }
  };

  const calculateAssetValue = (asset) => {
    const currentPrice = currentPrices[asset.symbol]?.price || asset.purchasePrice;
    return asset.quantity * currentPrice;
  };

  const calculateAssetGainLoss = (asset) => {
    const currentValue = calculateAssetValue(asset);
    const investedValue = asset.quantity * asset.purchasePrice;
    return currentValue - investedValue;
  };

  const calculateAssetGainLossPercent = (asset) => {
    const gainLoss = calculateAssetGainLoss(asset);
    const investedValue = asset.quantity * asset.purchasePrice;
    return investedValue > 0 ? (gainLoss / investedValue) * 100 : 0;
  };

  if (error) {
    return (
      <div className="portfolio-error">
        <h3>⚠️ Erro no Portfolio</h3>
        <p>{error}</p>
        <button 
          onClick={() => {
            setError(null);
            fetchUserAssets();
          }}
          className="retry-btn"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="portfolio-loading">
        <div className="spinner"></div>
        <p>Carregando sua carteira...</p>
      </div>
    );
  }

  if (assets.length === 0) {
    return (
      <div className="portfolio-empty">
        <h3>Sua carteira está vazia</h3>
        <p>Adicione seus primeiros ativos para começar a acompanhar seus investimentos!</p>
      </div>
    );
  }

  return (
    <div className="user-portfolio">
      {/* Resumo da Carteira */}
      <div className="portfolio-summary">
        <h3>Resumo da Carteira</h3>
        <div className="summary-cards">
          <div className="summary-card">
            <h4>Valor Investido</h4>
            <p className="value">{formatCurrency(portfolioMetrics.totalInvested)}</p>
          </div>
          <div className="summary-card">
            <h4>Valor Atual</h4>
            <p className="value">{formatCurrency(portfolioMetrics.currentValue)}</p>
          </div>
          <div className="summary-card">
            <h4>Ganho/Perda</h4>
            <p 
              className="value"
              style={{ color: getGainLossColor(portfolioMetrics.totalGainLoss) }}
            >
              {formatCurrency(portfolioMetrics.totalGainLoss)}
            </p>
            <p 
              className="percent"
              style={{ color: getGainLossColor(portfolioMetrics.totalGainLoss) }}
            >
              {portfolioMetrics.totalGainLoss >= 0 ? (
                <span className="trend-icon">↗</span>
              ) : (
                <span className="trend-icon">↘</span>
              )}
              {formatPercent(portfolioMetrics.totalGainLossPercent)}
            </p>
          </div>
        </div>
      </div>

      {/* Lista de Ativos */}
      <div className="portfolio-assets">
        <h3>Meus Ativos ({assets.length})</h3>
        <div className="assets-grid">
          {assets.map((asset) => {
            const currentPrice = currentPrices[asset.symbol]?.price || asset.purchasePrice;
            const currentValue = calculateAssetValue(asset);
            const gainLoss = calculateAssetGainLoss(asset);
            const gainLossPercent = calculateAssetGainLossPercent(asset);
            const priceChange = currentPrices[asset.symbol]?.changePercent || 0;

            return (
              <div key={asset.id} className="asset-card">
                <div className="asset-header">
                  <div className="asset-info">
                    <h4>{asset.symbol}</h4>
                    <span className="asset-category">
                      {categorizeAsset(asset.symbol)}
                    </span>
                  </div>
                  <div className="asset-actions">
                    <button 
                      className="action-btn edit"
                      title="Editar ativo"
                    >
                      ✏️
                    </button>
                    <button 
                      className="action-btn delete"
                      onClick={() => deleteAsset(asset.id)}
                      title="Remover ativo"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div className="asset-details">
                  <div className="detail-row">
                    <span>Quantidade:</span>
                    <span>{asset.quantity.toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="detail-row">
                    <span>Preço Médio:</span>
                    <span>{formatCurrency(asset.purchasePrice)}</span>
                  </div>
                  <div className="detail-row">
                    <span>Preço Atual:</span>
                    <span 
                      style={{ 
                        color: getGainLossColor(priceChange),
                        fontWeight: 'bold' 
                      }}
                    >
                      {formatCurrency(currentPrice)}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span>Valor Investido:</span>
                    <span>{formatCurrency(asset.quantity * asset.purchasePrice)}</span>
                  </div>
                  <div className="detail-row">
                    <span>Valor Atual:</span>
                    <span className="current-value">
                      {formatCurrency(currentValue)}
                    </span>
                  </div>
                  <div className="detail-row gain-loss">
                    <span>Resultado:</span>
                    <div className="gain-loss-values">
                      <span 
                        style={{ 
                          color: getGainLossColor(gainLoss),
                          fontWeight: 'bold' 
                        }}
                      >
                        {formatCurrency(gainLoss)}
                      </span>
                      <span 
                        className="gain-loss-percent"
                        style={{ color: getGainLossColor(gainLoss) }}
                      >
                        ({formatPercent(gainLossPercent)})
                      </span>
                    </div>
                  </div>
                </div>

                {asset.date && (
                  <div className="asset-date">
                    Adicionado em: {new Date(asset.date).toLocaleDateString('pt-BR')}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Botão para atualizar preços */}
      <div className="portfolio-actions">
        <button 
          className="refresh-btn"
          onClick={updateCurrentPrices}
          disabled={isLoading}
        >
          Atualizar Preços
        </button>
      </div>
    </div>
  );
};

export default UserPortfolio;
