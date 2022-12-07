
import {Link, useNavigate} from 'react-router-dom'
import { FaGoogleWallet, FaSearch } from 'react-icons/fa'


function Wallet() {
 
    return (
        <>
        <Link to='/' className=''>
            <FaGoogleWallet  fill='#00cc66' className='logoicon'/>
        </Link>
        <header className="walletHeader">
            <h1>Carteiras</h1>
            <div className='stockInputDiv'>
            <input type="text" placeholder='TICKER (EX: VALE3)' className='stockInput'></input>
            <FaSearch  className='stockIcon'/>
       
            </div>
           
        </header>

        </>
    )
}

export default Wallet