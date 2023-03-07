import React from 'react'

// import StockInput from './StockInput'

function StockMeusDados() {
  const AESB3qtddParse = parseFloat(localStorage.getItem('AESB3qtdd'));
  const AESB3pmParse = parseFloat(localStorage.getItem('AESB3pm'));
  const multiplicationResult = parseFloat(AESB3qtddParse * AESB3pmParse).toFixed(2);


// console.log(AESB3resultado)
  return (
    <div className='stock-my-wallet'>
    <div className='stock-my-wallet-header'>
      <h1>MEUS DADOS:</h1>
    </div>
    <div className='stock-infos-body'>
      <h2>VALOR TOTAL DA AÇÃO: <p>R$ {multiplicationResult}</p></h2>
      <h2>Nº DE AÇÕES: <p>{localStorage.getItem('AESB3qtdd')}</p></h2>
      <h2>PREÇO MÉDIO PAGO: <p>R$ {localStorage.getItem('AESB3pm')}</p></h2>
      <h2>% DO ATIVO NA CARTEIRA: <p>0%</p></h2>
      <h2>% DO SETOR NA CARTEIRA: <p>0%</p></h2>
      <h2>VALOR DO LUCRO: <p>R$ 0,00</p></h2>
      <h2>% DE LUCRO: <p>0%</p></h2>
    </div>
  </div>
  )
}

export default StockMeusDados