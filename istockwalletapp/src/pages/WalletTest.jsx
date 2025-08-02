import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import '../index.css';

function WalletTest() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className='wallet-container'>
      <div className='wallet-header'>
        <h1>Teste da Página Wallet</h1>
        <div className='wallet-actions'>
          <button 
            className='btn-add-asset'
            onClick={() => setIsModalOpen(true)}
          >
            ➕ ADICIONAR ATIVO
          </button>
          <Link to={`/my-wallet`} className='btn-minha-carteira'>
            <button type=''>
              💼<p>MINHA CARTEIRA</p>
            </button>
          </Link>
        </div>
      </div>

      <div>
        <p>Se você está vendo esta mensagem, a página está funcionando!</p>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h2>Modal de Teste</h2>
            <button onClick={() => setIsModalOpen(false)}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default WalletTest
