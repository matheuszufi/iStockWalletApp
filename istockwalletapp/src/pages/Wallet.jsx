
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
            <select type="text" placeholder='TICKER (EX: VALE3)' className='stockInput'>
                <option value="Vale S.A.(VALE3)">Vale S.A.(VALE3)</option>
                <option value="Itaú Unibanco(ITUB4)">Itaú Unibanco(ITUB4)</option>
                <option value="Apple Inc(AAPL)">Apple Inc(AAPL)</option>
                <option value="Microsoft Corp(MSFT)">Microsoft Corp(MSFT)</option>
                <option value="Vanguard 500 Index Fund ETF(VOO)">Vanguard 500 Index Fund ETF(VOO)</option>
                <option value="International Business Machine(IBM)">International Business Machine(IBM)</option>
            </select>
            <FaSearch  className='stockIcon'/>
            <button className="btn btn-primary">Obter Dados</button>
            </div>
           
        </header>

        </>
    )
}

export default Wallet