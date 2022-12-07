import {Link} from 'react-router-dom'
import {FaQuestionCircle} from 'react-icons/fa'
import {FaGoogleWallet, FaMoneyBill} from 'react-icons/fa'


function Home() {
    return (
        <>
        <FaGoogleWallet  fill='#00cc66' className='logoicon'/>
        <section className="heading">
         <h1>Bem vindo ao iStockWallet</h1>
         <p>O app que organiza seus investimentos!</p>

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