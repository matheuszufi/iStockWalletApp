import React from 'react'
import Cards from '../components/Cards'
import CardsFII from '../components/CardsFII'
import CardsETF from '../components/CardsETF.jsx'
import '../index.css';

function Wallet() {
  return (
    <div className='wallet-container'>
     
      <div className='cards-container'>
      <h1 className='titulo'>STOCKS</h1>
        <div className='cards-stocks'>
          <Cards/>
        </div>

        <div className='divisoria-wallet'></div>

        <h1 className='titulo'> FIIs</h1>
        <div className='cards-fiis'>
          <CardsFII/>
        </div>

        <div className='divisoria-wallet'></div>

        <h1 className='titulo'>ETFs</h1>
        <div className='cards-etfs'>
          <CardsETF/>
        </div>

      </div>

    </div>
  )
}

export default Wallet