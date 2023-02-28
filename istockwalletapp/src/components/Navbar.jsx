import {useNavigate, useLocation} from 'react-router-dom'

import {ReactComponent as PersonOutlineIcon} from '../assets/svg/personOutlineIcon.svg'

import {FaWallet, FaGoogleWallet} from 'react-icons/fa'





function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();

    const pathMatchRoute = (route) => {
        if(route === location.pathname) {
            return true
        }
    }

    return ( 
        <div>

            <footer className='navbarTop'>
                <nav className="navbarNavTop">
                    <ul className='navbarListItemsTop'>
                        <li className='navbarListItemTop' onClick={() => navigate('/')}>
                            <FaGoogleWallet className='faicons' fill={pathMatchRoute('/') ? '#00cc66' : 'rgb(20,20,20)'} width='36px' height='36px'/>
                            <p className={pathMatchRoute('/') ? 'navbarTopListItemNameActive' : 'navbarTopListItemName'}>Início</p>
                        </li>
                        <div className='navRight'>
                        <li className='navbarListItemTop' onClick={() => navigate('/wallet')}>
                        <FaWallet fill={pathMatchRoute('/wallet') ?'rgb(20,20,20)' : 'rgb(20,20,20)'} width='20px' height='20px'/>
                            <p className={pathMatchRoute('/wallet') ? 'navbarTopListItemNameActive' : 'navbarTopListItemName'}>Carteira</p>
                        </li>

                        <li className='navbarListItemTop' onClick={() => navigate('/profile')}>
                            <PersonOutlineIcon fill={pathMatchRoute('/profile') ? 'rgb(20,20,20)' : 'rgb(20,20,20)'} width='24px' height='24px'/>
                            <p className={pathMatchRoute('/profile') ? 'navbarTopListItemNameActive' : 'navbarTopListItemName'}>Perfil</p>
                        </li>
                        </div>
           

                    </ul>
                </nav>
            </footer>

        
        </div>
     

       
    )
}

export default Navbar