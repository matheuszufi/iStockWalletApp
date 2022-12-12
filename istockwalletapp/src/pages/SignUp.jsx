import {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {toast} from 'react-toastify'
import {getAuth, createUserWithEmailAndPassword, updateProfile} from 'firebase/auth'
import {setDoc, doc, serverTimestamp}from 'firebase/firestore'
import {db} from '../firebase.config'
import {ReactComponent as ArrowRightIcon} from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'
import { FaGoogleWallet } from 'react-icons/fa'
import OAuth from '../components/OAuth'


function SignUp() {
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''

    })

    const {name, email, password} = formData

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
    
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          )
    
          const user = userCredential.user
    
          updateProfile(auth.currentUser, {
            displayName: name,
          })
    
          const formDataCopy = {...formData}
          delete formDataCopy.password
          formDataCopy.timestamp = serverTimestamp()

          await setDoc(doc(db, 'users', user.uid), formDataCopy)
    
          navigate('/')
        } catch (error) {
            toast.error('Alguma informação está incorreta.')
        }
      }


    return (
        <>

            <Link to='/' className=''>
                <FaGoogleWallet  fill='#00cc66' className='logoicon'/>
            </Link>
            <div className='pageContainer'>
                <header>
                    <p className='pageHeader'> Complete as informações para o registro.</p>
                </header>
            
                <form onSubmit={onSubmit}>
                    <input type='name' className='nameInput' placeholder='Nome' id='name' value={name} onChange={onChange} />
                    <input type='email' className='emailInput' placeholder='Email' id='email' value={email} onChange={onChange} />
                
                    <div className='passwordInputDiv'>
                        <input type={showPassword ? 'text' : 'password'} className='passwordInput' placeholder='Senha'  id='password' value={password} onChange={onChange}/>

                        <img src={visibilityIcon} alt='show password' className='showPassword' onClick={() => setShowPassword((prevState) => !prevState)} />
                    </div>
         

                    <div className="signUpBar">
                        <p className="signUpText">Cadastrar</p>

                        <button className="signUpButton">
                            <ArrowRightIcon fill='#f1f1f1' whidth='34px' height='34px' />
                        </button>
                    </div>
                </form>

                <OAuth />

                <Link to='/sign-in' className='registerLink'> Já possuo uma conta</Link>
            
            
            
            
            
            
            </div>
        </>
    )
}

export default SignUp