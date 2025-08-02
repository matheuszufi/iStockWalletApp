import {Link} from 'react-router-dom'
import {FaQuestionCircle} from 'react-icons/fa'
import {FaGoogleWallet, FaMoneyBill} from 'react-icons/fa'
// import MinhaImagem from '../assets/png/istockwalletlogo.png';

function Home() {
    return (
        <>

        <section className="heading">
   
          
            <div className='home-content'>
            <div className="logo-ss">
            <FaGoogleWallet  fill='#00cc66' className='logoicon'/>
            </div>
                <div className='home-text'>
                {/* <img className='logoimg' src={MinhaImagem} alt="Descrição da imagem" /> */}
                    <h1>Bem vindo ao iStockWallet</h1>
             
                    <p className="pHome">O app que organiza seus investimentos! Aqui você tem em tempo real a cotação de suas ações, de maneira organizada, com indicadores e relatórios empresariais, !</p>
                    <div id="btn-div">
                    <Link to='/sign-in' className='btn btn-reverse btn-block'>
                    <FaMoneyBill/> COMEÇAR AGORA
                    </Link>

                    <Link to='/about' className='btn btn-block'>
                    <FaQuestionCircle/>QUEM SOMOS
                    </Link>
                    </div>
                </div>
            
                <div className='home-cards'>
                    <div className="home-placeholder">
                        <p>📊 Informações de mercado em breve...</p>
                    </div>
                </div>
            </div>
      
       
        
    </section>
  
     </>
    )
}

export default Home