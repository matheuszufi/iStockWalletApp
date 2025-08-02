import React, { useState } from 'react'

function Wallet() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div style={{padding: '20px', minHeight: '100vh', backgroundColor: '#f5f5f5'}}>
      <h1 style={{color: '#333', marginBottom: '20px'}}>🏦 Wallet - Página de Investimentos</h1>
      
      <div style={{marginBottom: '30px'}}>
        <button 
          style={{
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            padding: '12px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            marginRight: '10px'
          }}
        >
          ➕ ADICIONAR ATIVO
        </button>
        <button style={{
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          padding: '12px 20px',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold'
        }}>
          💼 MINHA CARTEIRA
        </button>
      </div>

      {/* Campo de Busca Simples */}
      <div style={{
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h3 style={{margin: '0 0 15px 0', color: '#333'}}>🔍 Buscar Ativos</h3>
        
        <input
          type="text"
          placeholder="Digite o código do ativo (ex: PETR4, VALE3, BTC...)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            border: '2px solid #ddd',
            borderRadius: '6px',
            outline: 'none',
            boxSizing: 'border-box'
          }}
        />
        
        {searchQuery && (
          <div style={{
            marginTop: '15px',
            padding: '10px',
            backgroundColor: '#f8f9fa',
            borderRadius: '4px',
            color: '#666'
          }}>
            Buscando por: <strong>{searchQuery}</strong>
          </div>
        )}
      </div>

      {/* Portfolio Simples */}
      <div style={{
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{margin: '0 0 15px 0', color: '#333'}}>📊 Sua Carteira</h3>
        <p style={{color: '#666', textAlign: 'center', margin: '40px 0'}}>
          Sua carteira está vazia. Use o campo de busca acima para adicionar ativos!
        </p>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
          marginTop: '20px'
        }}>
          <div style={{
            padding: '15px',
            backgroundColor: '#f8f9fa',
            borderRadius: '6px',
            textAlign: 'center'
          }}>
            <h4 style={{margin: '0 0 10px 0', color: '#666'}}>Valor Investido</h4>
            <p style={{margin: 0, fontSize: '1.2em', fontWeight: 'bold', color: '#28a745'}}>R$ 0,00</p>
          </div>
          <div style={{
            padding: '15px',
            backgroundColor: '#f8f9fa',
            borderRadius: '6px',
            textAlign: 'center'
          }}>
            <h4 style={{margin: '0 0 10px 0', color: '#666'}}>Valor Atual</h4>
            <p style={{margin: 0, fontSize: '1.2em', fontWeight: 'bold', color: '#17a2b8'}}>R$ 0,00</p>
          </div>
          <div style={{
            padding: '15px',
            backgroundColor: '#f8f9fa',
            borderRadius: '6px',
            textAlign: 'center'
          }}>
            <h4 style={{margin: '0 0 10px 0', color: '#666'}}>Resultado</h4>
            <p style={{margin: 0, fontSize: '1.2em', fontWeight: 'bold', color: '#666'}}>R$ 0,00 (0%)</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Wallet
