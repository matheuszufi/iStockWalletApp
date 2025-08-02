import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { db } from '../firebase.config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { validateAssetSymbol } from '../utils/portfolioUtils';
import '../index.css';

const AddAssetModal = ({ isOpen, onClose, onAssetAdded }) => {
  const [formData, setFormData] = useState({
    symbol: '',
    name: '',
    quantity: '',
    purchasePrice: '',
    type: 'stock' // stock, fii, etf, crypto
  });
  const [isLoading, setIsLoading] = useState(false);

  const { symbol, name, quantity, purchasePrice, type } = formData;

  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (!symbol || !name || !quantity || !purchasePrice) {
      toast.error('Preencha todos os campos');
      return;
    }

    // Validar símbolo do ativo
    const symbolError = validateAssetSymbol(symbol, type);
    if (symbolError) {
      toast.error(symbolError);
      return;
    }

    // Validar valores numéricos
    if (parseFloat(quantity) <= 0) {
      toast.error('Quantidade deve ser maior que zero');
      return;
    }

    if (parseFloat(purchasePrice) <= 0) {
      toast.error('Preço deve ser maior que zero');
      return;
    }

    setIsLoading(true);

    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        toast.error('Usuário não autenticado');
        return;
      }

      // Calcular valor total
      const totalValue = parseFloat(quantity) * parseFloat(purchasePrice);

      const assetData = {
        userId: user.uid,
        symbol: symbol.toUpperCase().trim(),
        name: name.trim(),
        quantity: parseFloat(quantity),
        purchasePrice: parseFloat(purchasePrice),
        totalValue: totalValue,
        type: type,
        date: new Date().toISOString(),
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'portfolios'), assetData);
      
      toast.success('Ativo adicionado com sucesso!');
      
      // Reset form
      setFormData({
        symbol: '',
        name: '',
        quantity: '',
        purchasePrice: '',
        type: 'stock'
      });
      
      onAssetAdded();
      onClose();
    } catch (error) {
      console.error('Erro ao adicionar ativo:', error);
      toast.error('Erro ao adicionar ativo');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Adicionar Ativo à Carteira</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={onSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="type">Tipo de Ativo</label>
            <select id="type" value={type} onChange={onChange} className="form-select">
              <option value="stock">Ação</option>
              <option value="fii">FII</option>
              <option value="etf">ETF</option>
              <option value="crypto">Criptomoeda</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="symbol">Símbolo do Ativo</label>
            <input
              type="text"
              id="symbol"
              value={symbol}
              onChange={onChange}
              placeholder="Ex: PETR4, HGLG11, BTC"
              className="form-input"
              style={{ textTransform: 'uppercase' }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="name">Nome do Ativo</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={onChange}
              placeholder="Ex: Petrobras PN, Hospital Geral"
              className="form-input"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="quantity">Quantidade</label>
              <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={onChange}
                placeholder="Ex: 100"
                className="form-input"
                step="0.01"
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="purchasePrice">Preço de Compra (R$)</label>
              <input
                type="number"
                id="purchasePrice"
                value={purchasePrice}
                onChange={onChange}
                placeholder="Ex: 25.50"
                className="form-input"
                step="0.01"
                min="0"
              />
            </div>
          </div>

          {quantity && purchasePrice && (
            <div className="total-value">
              <p>Valor Total Investido: <strong>R$ {(parseFloat(quantity) * parseFloat(purchasePrice)).toFixed(2)}</strong></p>
            </div>
          )}

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancelar
            </button>
            <button type="submit" disabled={isLoading} className="btn-add">
              {isLoading ? 'Adicionando...' : 'Adicionar Ativo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAssetModal;
