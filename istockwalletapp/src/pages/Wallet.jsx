
import {Link, useNavigate} from 'react-router-dom'
import { FaGoogleWallet, FaSearch, FaArrowUp } from 'react-icons/fa'
import Grafico from '../assets/grafico.png'

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
           
            <div id='stockCardDiv'>
                <div id="stockCard">
                    <div id="cardHeader">
                        <div id=''>
                        <h1>ABEV3</h1>
                        </div>
                        <div id="cardHeaderVolatility">
                            <div id='cardHeaderVolatilityBtn'>
                                <button>D</button>
                                <button>S</button>
                                <button>M</button>
                                <button>1A</button>
                                <button>2A</button>
                                <button>5A</button>     
                            </div>
                            <div id="cardHeaderVolatilityInput">
                            <h3><FaArrowUp /> 2,87%</h3>
                            </div>

                        </div>
                    </div>
               
                    <div id='graficoDiv'>
                    <img id='grafico' src={Grafico} />
                    </div>
                    <div id="compraVendaDiv">
                    <div id="compra">Compra: R$20,45</div>
                    <div id='venda'>Venda: R$41,52</div>
                    </div>
                

                    <div id='cardHoverDiv'>
                        <p>FC Desc.:</p>
                    </div>
                </div>
    
                <div id="stockCard"></div>
                <div id="stockCard"></div>
                <div id="stockCard"></div>
                <div id="stockCard"></div>
                <div id="stockCard"></div>





            </div>








        </header>

        </>
    )
}

export default Wallet