import React from 'react'

function StockMeusDados() {
  return (
    <div className='stock-my-wallet'>
    <div className='stock-my-wallet-header'>
      <h1>MEUS DADOS:</h1>
    </div>
    <div className='stock-infos-body'>
      <h2>VALOR TOTAL DA AÇÃO: <p>R$ 0,00</p></h2>
      <h2>Nº DE AÇÕES: <p>0</p></h2>
      <h2>PREÇO MÉDIO PAGO: <p>R$ 0,00</p></h2>
      <h2>% DO ATIVO NA CARTEIRA: <p>0%</p></h2>
      <h2>% DO SETOR NA CARTEIRA: <p>0%</p></h2>
      <h2>VALOR DO LUCRO: <p>R$ 0,00</p></h2>
      <h2>% DE LUCRO: <p>0%</p></h2>
    </div>
  </div>
  )
}

export default StockMeusDados