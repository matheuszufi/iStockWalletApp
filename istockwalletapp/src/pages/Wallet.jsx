import React, { useState, useEffect } from 'react';
import { useAuthStatus } from '../hooks/useAuthStatus';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, push, onValue, remove, set } from 'firebase/database';
import { toast } from 'react-toastify';
import AssetsPieChart from '../components/AssetsPieChart';

function Wallet() {
  const [showModal, setShowModal] = useState(false);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('type'); // 'type' ou 'sector'
  const { loggedIn } = useAuthStatus();
  
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    sector: '',
    fiiType: '',
    paidValue: '',
    quantity: ''
  });

  const auth = getAuth();
  const database = getDatabase();

  // Carregar ativos do Firebase
  useEffect(() => {
    if (loggedIn && auth.currentUser) {
      const assetsRef = ref(database, `users/${auth.currentUser.uid}/assets`);
      
      const unsubscribe = onValue(assetsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const assetsList = Object.entries(data).map(([id, asset]) => ({
            id,
            ...asset
          }));
          setAssets(assetsList);
        } else {
          setAssets([]);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [loggedIn, auth.currentUser, database]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.type || !formData.paidValue || !formData.quantity) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    try {
      const tickerName = formData.name.toUpperCase();
      const newQuantity = parseInt(formData.quantity);
      const newPaidValue = parseFloat(formData.paidValue);
      
      // Verificar se o ativo já existe
      const existingAsset = assets.find(asset => asset.name === tickerName);
      
      if (existingAsset) {
        // Calcular média ponderada do valor pago
        const currentTotalInvested = existingAsset.quantity * existingAsset.paidValue;
        const newTotalInvested = newQuantity * newPaidValue;
        const totalQuantity = existingAsset.quantity + newQuantity;
        const averagePaidValue = (currentTotalInvested + newTotalInvested) / totalQuantity;
        
        // Atualizar ativo existente
        const assetRef = ref(database, `users/${auth.currentUser.uid}/assets/${existingAsset.id}`);
        const updatedAssetData = {
          ...existingAsset,
          quantity: totalQuantity,
          paidValue: averagePaidValue,
          totalValue: averagePaidValue * totalQuantity,
          updatedAt: new Date().toISOString()
        };
        
        await set(assetRef, updatedAssetData);
        
        toast.success(`${tickerName} consolidado! Nova quantidade: ${totalQuantity}, Valor médio: R$ ${averagePaidValue.toFixed(2)}`);
      } else {
        // Criar novo ativo
        const assetsRef = ref(database, `users/${auth.currentUser.uid}/assets`);
        
        const assetData = {
          name: tickerName,
          type: formData.type,
          sector: formData.sector || null,
          fiiType: formData.fiiType || null,
          paidValue: newPaidValue,
          quantity: newQuantity,
          totalValue: newPaidValue * newQuantity,
          createdAt: new Date().toISOString()
        };

        await push(assetsRef, assetData);
        toast.success('Ativo adicionado com sucesso!');
      }
      
      setShowModal(false);
      setFormData({
        name: '',
        type: '',
        sector: '',
        fiiType: '',
        paidValue: '',
        quantity: ''
      });
    } catch (error) {
      console.error('Erro ao processar ativo:', error);
      toast.error('Erro ao processar ativo');
    }
  };

  const handleDeleteAsset = async (assetId) => {
    if (window.confirm('Tem certeza que deseja remover este ativo?')) {
      try {
        const assetRef = ref(database, `users/${auth.currentUser.uid}/assets/${assetId}`);
        await remove(assetRef);
        toast.success('Ativo removido com sucesso!');
      } catch (error) {
        console.error('Erro ao remover ativo:', error);
        toast.error('Erro ao remover ativo');
      }
    }
  };

  const getTotalInvested = () => {
    return assets.reduce((total, asset) => total + asset.totalValue, 0);
  };

  if (!loggedIn) {
    return (
      <div className="wallet-container">
        <div className="wallet-content">
          <p>Você precisa estar logado para acessar sua carteira</p>
        </div>
      </div>
    );
  }

  return (
    <div className="wallet-container">
      {/* Header */}
      <div className="wallet-header">
        <h1>Minha Carteira</h1>
        <p>Gerencie seus investimentos</p>
      </div>

      {/* Botão Adicionar Ativo */}
      <div className="wallet-actions">
        <button 
          className="btn-add-asset"
          onClick={() => setShowModal(true)}
        >
          <span>+</span>
          Adicionar Ativo
        </button>
      </div>

      {/* Resumo da Carteira */}
      {assets.length > 0 && (
        <div className="portfolio-summary">
          <div className="portfolio-info">
            <h3>Resumo da Carteira</h3>
            <div className="portfolio-stats">
              <div className="stat-item">
                <p>Total de Ativos</p>
                <strong>{assets.length}</strong>
              </div>
              <div className="stat-item">
                <p>Total Investido</p>
                <strong>R$ {getTotalInvested().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
              </div>
            </div>
          </div>
          <div className="chart-container">
            <AssetsPieChart assets={assets} viewMode={viewMode} />
              <div className="chart-controls">
            
            <button className={`chart-btn ${viewMode === 'type' ? 'active' : ''}`} onClick={() => setViewMode('type')}>Por Tipo</button>
            <button className={`chart-btn ${viewMode === 'sector' ? 'active' : ''}`} onClick={() => setViewMode('sector')}>Por Setor</button>
          </div>
          </div>
        
        </div>
      )}

      {/* Lista de Ativos */}
      {loading ? (
        <div className="loading">Carregando ativos...</div>
      ) : assets.length === 0 ? (
        <div className="empty-portfolio">
          <h3>Sua carteira está vazia</h3>
          <p>Comece adicionando seus primeiros ativos para acompanhar seus investimentos</p>
        </div>
      ) : (
        <div className="assets-grid">
          {assets.map((asset) => (
            <div key={asset.id} className="asset-card">
              <div className="asset-header">
                <div className="asset-info">
                  <h4>{asset.name}</h4>
                  <p className="asset-name">{asset.type.toUpperCase()}</p>
                  <span className="asset-type">
                    {asset.sector || asset.fiiType || asset.type}
                  </span>
                </div>
                <div className="asset-actions">
                  <button 
                    className="action-btn delete-btn"
                    onClick={() => handleDeleteAsset(asset.id)}
                    title="Remover ativo"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              
              <div className="asset-details">
                <div className="detail-row">
                  <span>Quantidade:</span>
                  <strong>{asset.quantity}</strong>
                </div>
                <div className="detail-row">
                  <span>Valor Pago:</span>
                  <strong>R$ {asset.paidValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                </div>
                <div className="detail-row">
                  <span>Total Investido:</span>
                  <strong>R$ {asset.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Adicionar Ativo */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Adicionar Novo Ativo</h2>
              <button 
                className="close-button"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            
            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nome do Ativo *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ex: PETR4, VALE3, ITUB4"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label>Tipo de Ativo *</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                >
                  <option value="">Selecione o tipo</option>
                  <option value="acao">Ação</option>
                  <option value="fii">FII</option>
                  <option value="tesouro">Tesouro</option>
                  <option value="renda-fixa">Renda Fixa</option>
                </select>
              </div>

              {formData.type === 'acao' && (
                <div className="form-group">
                  <label>Setor</label>
                  <select
                    name="sector"
                    value={formData.sector}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="">Selecione o setor</option>
                    <option value="bancario">Bancário</option>
                    <option value="saude">Saúde</option>
                    <option value="energia">Energia</option>
                    <option value="bens-consumo">Bens de Consumo</option>
                  </select>
                </div>
              )}

              {formData.type === 'fii' && (
                <div className="form-group">
                  <label>Tipo de FII</label>
                  <select
                    name="fiiType"
                    value={formData.fiiType}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="">Selecione o tipo</option>
                    <option value="tijolo">Tijolo</option>
                    <option value="papel">Papel</option>
                    <option value="hibrido">Híbrido</option>
                  </select>
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label>Valor Pago (R$) *</label>
                  <input
                    type="number"
                    name="paidValue"
                    value={formData.paidValue}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Quantidade *</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    min="1"
                    placeholder="1"
                    className="form-input"
                    required
                  />
                </div>
              </div>

              {formData.paidValue && formData.quantity && (
                <div className="total-value">
                  <p>
                    <strong>Total: R$ {(parseFloat(formData.paidValue || 0) * parseInt(formData.quantity || 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                  </p>
                </div>
              )}

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn-cancel"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn-add"
                >
                  Adicionar Ativo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Wallet;
