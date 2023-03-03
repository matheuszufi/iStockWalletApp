import React from 'react'
import { Link } from 'react-router-dom'
import Cards from '../components/Cards'
import CardsFII from '../components/CardsFII'
import CardsETF from '../components/CardsETF.jsx'
import '../index.css';
import {FaSearch, FaWallet} from 'react-icons/fa';
import CardDollar from '../components/CardDollar'
import CardEuro from '../components/CardEuro'
import CardBTC from '../components/CardBtc'
import CardETH from '../components/CardEth'

function Wallet() {
  return (
    <div className='wallet-container'>
      <div className='wallet-header'>
        <form>
          <input type="text" placeholder='EX: ABEV3'></input>
          <button type='submit' className='btn-filtrar'>+ ADICIONAR ATIVO</button>
        </form>
        <h2>MEU PATRIMÔNIO: R$0,00</h2>
        <Link to={`/my-wallet`} className='btn-minha-carteira'><button type=''><FaWallet/><p>MINHA CARTEIRA</p></button></Link>
      </div>
      <div className='cards-container'>
        
        <h1 className='titulo'>Moedas</h1>
        <div className='cards-currency'>
          <CardDollar />
          <CardEuro />
          <CardBTC />
          <CardETH />
        </div>

        <div className='divisoria-wallet'></div>
        
        <h1 className='titulo'>Ações</h1>
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