import {Link} from 'react-router-dom'
import {FaQuestionCircle} from 'react-icons/fa'
import {FaGoogleWallet, FaMoneyBill} from 'react-icons/fa'
import CardsHome from '../components/CardsHome'


function Home() {
    return (
        <>

        <section className="heading">
            <div className="logo-ss">
            <FaGoogleWallet  fill='#00cc66' className='logoicon'/>
            </div>
        <div className='home-content'>
        <div className='home-text'>
        <h1>Bem vindo ao iStockWallet</h1>
         <p className="pHome">O app que organiza seus investimentos! Aqui você tem em tempo real a cotação de suas ações, de maneira organizada, com indicadores e relatórios empresariais, além de muito mais!</p>
        </div>
      
        <div className='home-cards'>
        <CardsHome />
        </div>
        </div>
   


         <Link to='/sign-in' className='btn btn-reverse btn-block'>
        <FaMoneyBill/> COMEÇAR AGORA
        </Link>

        <Link to='/about' className='btn btn-block'>
        <FaQuestionCircle/>QUEM SOMOS
        </Link>

        </section>
  
     </>
    )
}

export default Home