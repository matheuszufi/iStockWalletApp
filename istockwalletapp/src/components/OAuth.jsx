import { useLocation, useNavigate } from "react-router-dom"
import {getAuth, signInWithPopup, GoogleAuthProvider} from 'firebase/auth'
import {doc, setDoc, getDoc, serverTimestamp} from 'firebase/firestore'
import {db} from '../firebase.config'
import {toast} from 'react-toastify'

import googeIcon from '../assets/svg/googleIcon.svg'


function OAuth() {
    const navigate = useNavigate()
    const location = useLocation()

    const onGoogleClick = async () => {
        try {
            const auth = getAuth()
            const provider = new GoogleAuthProvider()
            const result = await signInWithPopup(auth, provider)
            const user = result.user

            const docRef = doc(db, 'users', user.uid)
            const docSnap = await getDoc(docRef)

            if(!docSnap.exists()) {
                await setDoc(doc(db, 'users', user.uid), {
                    name: user.displayName,
                    email: user.email,
                    timestamp: serverTimestamp()
                })
            }
            navigate('/')

        } catch (error) {
            toast.error('Houve algum erro com a conta Google.')
        }
    }
    
    return <div className="socialLogin">
        <p>{location.pathname === '/sign-up' ? 'Registre-se com uma conta' : 'Fazer login com uma conta'} </p>
        <button className="socialIconDiv" onClick={onGoogleClick}>
            <img className="socialIconImg" src={googeIcon} alt='google' />
        </button>
    </div>
}

export default OAuth