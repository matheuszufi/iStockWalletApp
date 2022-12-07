import {useState} from 'react'
import {toast} from 'react-toastify'
import {Link, useNavigate} from 'react-router-dom'
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth'
import {ReactComponent as ArrowRightIcon} from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'
import { FaGoogleWallet } from 'react-icons/fa'


function SignIn() {
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        password: ''

    })

    const {email, password} = formData

    const navigate = useNavigate()
    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value
        
        }))
    }

    const onSubmit = async (e) => {
        e.preventDefault()

        try {
            const auth = getAuth()

            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            if(userCredential.user) {
                navigate('/')
            } 


        } catch (error) {
            toast.error('Login ou senha inválidos.')
        }
    }
    



    return (
        <>
            <Link to='/' className=''>
            <FaGoogleWallet  fill='#00cc66' className='logoicon'/>
            </Link>
               
            <div className='pageContainer'>
                <header>
                    <p className='pageHeader'> Bem vindo de volta!</p>
                </header>
            
                <form onSubmit={onSubmit}>
                    <input type='email' className='emailInput' placeholder='Email' id='email' value={email} onChange={onChange} />
                
                    <div className='passwordInputDiv'>
                        <input type={showPassword ? 'text' : 'password'} className='passwordInput' placeholder='Senha'  id='password' value={password} onChange={onChange}/>

                        <img src={visibilityIcon} alt='show password' className='showPassword' onClick={() => setShowPassword((prevState) => !prevState)} />
                    </div>
                
                    <Link to='/forgot-password' className='forgotPasswordLink'> Esqueci minha senha </Link>

                    <div className="signInBar">
                        <p className="signInText">Login</p>

                        <button className="signInButton">
                            <ArrowRightIcon fill='#f1f1f1' whidth='34px' height='34px' />
                        </button>
                    </div>
                </form>
            
                {/* GOOGLE AUTH */}

                <Link to='/sign-up' className='registerLink'>Registre-se</Link>
            
            
            
            
            
            
            </div>
        </>
    )
}

export default SignIn