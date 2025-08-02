import {useNavigate, useLocation} from 'react-router-dom'

import {ReactComponent as PersonOutlineIcon} from '../assets/svg/personOutlineIcon.svg'

import {FaWallet, FaHome, FaTachometerAlt} from 'react-icons/fa'




function Navbar2() {
    const navigate = useNavigate();
    const location = useLocation();

    const pathMatchRoute = (route) => {
        if(route === location.pathname) {
            return true
        }
    }

    return ( 
        <div>

            <footer className='navbar2'>
                <nav className="navbarNav">
                    <ul className='navbarListItems'>
                        <li className='navbarListItem' onClick={() => navigate('/')}>
                            <FaHome  fill={pathMatchRoute('/') ? '#00cc66' : '#8f8f8f'} width='36px' height='36px'/>
                            <p className={pathMatchRoute('/') ? 'navbarListItemNameActive' : 'navbarListItemName'}>Início</p>
                        </li>

                        <li className='navbarListItem' onClick={() => navigate('/dashboard')}>
                            <FaTachometerAlt  fill={pathMatchRoute('/dashboard') ? '#00cc66' : '#8f8f8f'} width='36px' height='36px'/>
                            <p className={pathMatchRoute('/dashboard') ? 'navbarListItemNameActive' : 'navbarListItemName'}>Dashboard</p>
                        </li>

                        <li className='navbarListItem' onClick={() => navigate('/wallet')}>
                            <FaWallet  fill={pathMatchRoute('/wallet') ? '#00cc66' : '#8f8f8f'} width='36px' height='36px'/>
                            <p className={pathMatchRoute('/wallet') ? 'navbarListItemNameActive' : 'navbarListItemName'}>Carteira</p>
                        </li>

                        <li className='navbarListItem' onClick={() => navigate('/profile')}>
                            <PersonOutlineIcon fill={pathMatchRoute('/profile') ? '#00cc66' : '#8f8f8f'} width='24px' height='24px'/>
                            <p className={pathMatchRoute('/profile') ? 'navbarListItemNameActive' : 'navbarListItemName'}>Perfil</p>
                        </li>

                    </ul>
                </nav>
            </footer>



        
        </div>
     

       
    )
}

export default Navbar2