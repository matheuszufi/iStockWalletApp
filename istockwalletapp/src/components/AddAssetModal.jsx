import React, { useState, useEffect } from 'react';
import { db } from '../firebase.config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { toast } from 'react-toastify';
import stockAPI from '../services/stockAPI';

const AddAssetModal = ({ isOpen, onClose, selectedAsset, onAssetAdded }) => {
  const [formData, setFormData] = useState({
    symbol: selectedAsset?.symbol || '',
    quantity: '',
    purchasePrice: '',
    purchaseDate: new Date().toISOString().split('T')[0], // Data atual por padrão
    notes: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [loadingPrice, setLoadingPrice] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (selectedAsset) {
      setFormData(prev => ({
        ...prev,
        symbol: selectedAsset.symbol
      }));
      fetchCurrentPrice(selectedAsset.symbol);
    }
  }, [selectedAsset]);

  const fetchCurrentPrice = async (symbol) => {
    setLoadingPrice(true);
    try {
      const quote = await stockAPI.getStockQuote(symbol);
      if (quote) {
        setCurrentPrice(quote);
        // Sugere o preço atual como preço de compra se não estiver preenchido
        if (!formData.purchasePrice) {
          setFormData(prev => ({
            ...prev,
            purchasePrice: quote.price.toFixed(2)
          }));
        }
      }
    } catch (error) {
      console.error('Erro ao buscar preço atual:', error);
    } finally {
      setLoadingPrice(false);
    }
  };

  const searchStocks = async (searchTerm) => {
    if (searchTerm.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await stockAPI.searchStocks(searchTerm);
      setSearchResults(results.slice(0, 5)); // Limita a 5 resultados
    } catch (error) {
      console.error('Erro na busca:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSymbolChange = (e) => {
    const value = e.target.value.toUpperCase();
    setFormData(prev => ({ ...prev, symbol: value }));
    
    // Busca automaticamente conforme o usuário digita
    if (value.length >= 2) {
      searchStocks(value);
    } else {
      setSearchResults([]);
    }
  };

  const selectAsset = (asset) => {
    setFormData(prev => ({
      ...prev,
      symbol: asset.symbol
    }));
    setSearchResults([]);
    fetchCurrentPrice(asset.symbol);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Validações específicas
    if (name === 'quantity' || name === 'purchasePrice') {
      // Permite apenas números e ponto decimal
      if (value && !/^\d*\.?\d*$/.test(value)) {
        return;
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.symbol.trim()) {
      toast.error('Símbolo do ativo é obrigatório');
      return false;
    }
    
    if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
      toast.error('Quantidade deve ser maior que zero');
      return false;
    }
    
    if (!formData.purchasePrice || parseFloat(formData.purchasePrice) <= 0) {
      toast.error('Preço de compra deve ser maior que zero');
      return false;
    }
    
    if (!formData.purchaseDate) {
      toast.error('Data de compra é obrigatória');
      return false;
    }

    // Verifica se a data não é futura
    const purchaseDate = new Date(formData.purchaseDate);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // Final do dia atual
    
    if (purchaseDate > today) {
      toast.error('Data de compra não pode ser no futuro');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        toast.error('Usuário não autenticado');
        return;
      }

      // Busca dados atuais do ativo para complementar informações
      let assetData = selectedAsset;
      if (!assetData) {
        // Se não tem asset selecionado, busca por símbolo
        const searchResults = await stockAPI.searchStocks(formData.symbol);
        assetData = searchResults.find(a => a.symbol === formData.symbol.toUpperCase());
      }

      const portfolioEntry = {
        userId: user.uid,
        symbol: formData.symbol.toUpperCase(),
        name: assetData?.name || formData.symbol,
        type: assetData?.type || 'Ação',
        exchange: assetData?.exchange || 'B3',
        quantity: parseFloat(formData.quantity),
        purchasePrice: parseFloat(formData.purchasePrice),
        purchaseDate: formData.purchaseDate,
        notes: formData.notes.trim(),
        totalInvested: parseFloat(formData.quantity) * parseFloat(formData.purchasePrice),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'portfolios'), portfolioEntry);
      
      toast.success(`${formData.symbol} adicionado à carteira com sucesso!`);
      
      // Reset form
      setFormData({
        symbol: '',
        quantity: '',
        purchasePrice: '',
        purchaseDate: new Date().toISOString().split('T')[0],
        notes: ''
      });
      
      setCurrentPrice(null);
      setSearchResults([]);
      
      // Callback para atualizar a lista
      if (onAssetAdded) {
        onAssetAdded();
      }
      
      onClose();
      
    } catch (error) {
      console.error('Erro ao adicionar ativo:', error);
      toast.error('Erro ao adicionar ativo à carteira');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotalInvestment = () => {
    const quantity = parseFloat(formData.quantity) || 0;
    const price = parseFloat(formData.purchasePrice) || 0;
    return quantity * price;
  };

  if (!isOpen) return null;

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContainerStyle}>
        <div style={modalHeaderStyle}>
          <h2 style={titleStyle}>Adicionar Ativo à Carteira</h2>
          <button 
            style={closeButtonStyle} 
            onClick={onClose}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#ff4444'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#ff6b6b'}
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} style={formStyle}>
          {/* Campo de busca de ativo */}
          <div style={formGroupStyle}>
            <label style={labelStyle}>Símbolo do Ativo</label>
            <div style={searchContainerStyle}>
              <input
                type="text"
                name="symbol"
                value={formData.symbol}
                onChange={handleSymbolChange}
                placeholder="Digite o símbolo (ex: PETR4, VALE3)"
                style={inputStyle}
                autoComplete="off"
              />
              {isSearching && (
                <div style={loadingIndicatorStyle}>Buscando...</div>
              )}
              {searchResults.length > 0 && (
                <div style={searchResultsStyle}>
                  {searchResults.map((asset, index) => (
                    <div
                      key={index}
                      style={searchItemStyle}
                      onClick={() => selectAsset(asset)}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                    >
                      <div style={assetSymbolStyle}>{asset.symbol}</div>
                      <div style={assetNameStyle}>{asset.name}</div>
                      <div style={assetTypeStyle}>{asset.type}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Preço atual */}
          {currentPrice && (
            <div style={currentPriceStyle}>
              <div style={priceInfoStyle}>
                <span>Preço Atual: </span>
                <strong style={priceValueStyle}>
                  R$ {currentPrice.price.toFixed(2)}
                </strong>
                {loadingPrice && <span style={loadingTextStyle}> (Atualizando...)</span>}
              </div>
              {currentPrice.change && (
                <div style={{
                  ...changeStyle,
                  color: currentPrice.change >= 0 ? '#27ae60' : '#e74c3c'
                }}>
                  {currentPrice.change >= 0 ? '+' : ''}{currentPrice.change.toFixed(2)}%
                </div>
              )}
            </div>
          )}

          {/* Quantidade */}
          <div style={formGroupStyle}>
            <label style={labelStyle}>Quantidade</label>
            <input
              type="text"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              placeholder="Ex: 100"
              style={inputStyle}
            />
          </div>

          {/* Preço de compra */}
          <div style={formGroupStyle}>
            <label style={labelStyle}>Preço de Compra (R$)</label>
            <input
              type="text"
              name="purchasePrice"
              value={formData.purchasePrice}
              onChange={handleInputChange}
              placeholder="Ex: 25.50"
              style={inputStyle}
            />
          </div>

          {/* Data de compra */}
          <div style={formGroupStyle}>
            <label style={labelStyle}>Data de Compra</label>
            <input
              type="date"
              name="purchaseDate"
              value={formData.purchaseDate}
              onChange={handleInputChange}
              style={inputStyle}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Observações */}
          <div style={formGroupStyle}>
            <label style={labelStyle}>Observações (opcional)</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Notas sobre esta operação..."
              style={textareaStyle}
              rows="3"
            />
          </div>

          {/* Valor total investido */}
          {formData.quantity && formData.purchasePrice && (
            <div style={totalValueStyle}>
              <span>Valor Total Investido: </span>
              <strong style={totalAmountStyle}>
                R$ {calculateTotalInvestment().toFixed(2)}
              </strong>
            </div>
          )}

          {/* Botões */}
          <div style={buttonContainerStyle}>
            <button 
              type="button" 
              onClick={onClose} 
              style={cancelButtonStyle}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#95a5a6'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#bdc3c7'}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={isLoading} 
              style={{
                ...addButtonStyle,
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
              onMouseEnter={(e) => !isLoading && (e.target.style.backgroundColor = '#2980b9')}
              onMouseLeave={(e) => !isLoading && (e.target.style.backgroundColor = '#3498db')}
            >
              {isLoading ? 'Adicionando...' : 'Adicionar Ativo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Estilos inline para evitar conflitos
const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000
};

const modalContainerStyle = {
  backgroundColor: 'white',
  borderRadius: '8px',
  padding: '0',
  maxWidth: '500px',
  width: '90%',
  maxHeight: '90vh',
  overflow: 'hidden',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
};

const modalHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '20px 24px',
  borderBottom: '1px solid #eee',
  backgroundColor: '#f8f9fa'
};

const titleStyle = {
  margin: 0,
  fontSize: '1.5rem',
  fontWeight: '600',
  color: '#2c3e50'
};

const closeButtonStyle = {
  background: '#ff6b6b',
  border: 'none',
  borderRadius: '50%',
  width: '32px',
  height: '32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '20px',
  color: 'white',
  cursor: 'pointer',
  transition: 'background-color 0.2s'
};

const formStyle = {
  padding: '24px',
  maxHeight: 'calc(90vh - 80px)',
  overflowY: 'auto'
};

const formGroupStyle = {
  marginBottom: '20px',
  position: 'relative'
};

const labelStyle = {
  display: 'block',
  marginBottom: '8px',
  fontWeight: '500',
  color: '#2c3e50',
  fontSize: '14px'
};

const inputStyle = {
  width: '100%',
  padding: '12px',
  border: '1px solid #ddd',
  borderRadius: '6px',
  fontSize: '14px',
  transition: 'border-color 0.2s',
  boxSizing: 'border-box'
};

const textareaStyle = {
  ...inputStyle,
  resize: 'vertical',
  fontFamily: 'inherit'
};

const searchContainerStyle = {
  position: 'relative'
};

const searchResultsStyle = {
  position: 'absolute',
  top: '100%',
  left: 0,
  right: 0,
  backgroundColor: 'white',
  border: '1px solid #ddd',
  borderTop: 'none',
  borderRadius: '0 0 6px 6px',
  maxHeight: '200px',
  overflowY: 'auto',
  zIndex: 10,
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
};

const searchItemStyle = {
  padding: '12px',
  cursor: 'pointer',
  borderBottom: '1px solid #f0f0f0',
  transition: 'background-color 0.2s'
};

const assetSymbolStyle = {
  fontWeight: '600',
  color: '#2c3e50',
  fontSize: '14px'
};

const assetNameStyle = {
  color: '#7f8c8d',
  fontSize: '13px',
  marginTop: '2px'
};

const assetTypeStyle = {
  color: '#95a5a6',
  fontSize: '12px',
  marginTop: '2px'
};

const loadingIndicatorStyle = {
  position: 'absolute',
  right: '12px',
  top: '50%',
  transform: 'translateY(-50%)',
  color: '#7f8c8d',
  fontSize: '12px'
};

const currentPriceStyle = {
  backgroundColor: '#f8f9fa',
  padding: '12px',
  borderRadius: '6px',
  marginBottom: '20px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const priceInfoStyle = {
  fontSize: '14px',
  color: '#2c3e50'
};

const priceValueStyle = {
  fontSize: '16px',
  color: '#27ae60'
};

const loadingTextStyle = {
  fontSize: '12px',
  color: '#7f8c8d'
};

const changeStyle = {
  fontSize: '14px',
  fontWeight: '500'
};

const totalValueStyle = {
  backgroundColor: '#e3f2fd',
  padding: '12px',
  borderRadius: '6px',
  marginBottom: '20px',
  textAlign: 'center',
  fontSize: '14px',
  color: '#1976d2'
};

const totalAmountStyle = {
  fontSize: '16px',
  color: '#1565c0'
};

const buttonContainerStyle = {
  display: 'flex',
  gap: '12px',
  justifyContent: 'flex-end',
  marginTop: '24px'
};

const cancelButtonStyle = {
  padding: '12px 24px',
  border: 'none',
  borderRadius: '6px',
  fontSize: '14px',
  fontWeight: '500',
  cursor: 'pointer',
  backgroundColor: '#bdc3c7',
  color: 'white',
  transition: 'background-color 0.2s'
};

const addButtonStyle = {
  padding: '12px 24px',
  border: 'none',
  borderRadius: '6px',
  fontSize: '14px',
  fontWeight: '500',
  cursor: 'pointer',
  backgroundColor: '#3498db',
  color: 'white',
  transition: 'background-color 0.2s'
};

export default AddAssetModal;
