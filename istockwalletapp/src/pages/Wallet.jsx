import React from 'react'
import Cards from '../components/Cards'
import '../index.css';

function Wallet() {
  return (
    <div className='wallet-container'>
      <h1> EMPRESAS</h1>
      <div className='cards-container'>
      <Cards/>
      </div>

    </div>
  )
}

export default Wallet