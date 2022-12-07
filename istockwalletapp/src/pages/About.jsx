
import {Link, useNavigate} from 'react-router-dom'
import { FaGoogleWallet } from 'react-icons/fa'


function About() {
    return (
        <>
        <Link to='/' className=''>
            <FaGoogleWallet  fill='#00cc66' className='logoicon'/>
        </Link>
        <h1>Quem somos</h1>
        </>
    )
}

export default About