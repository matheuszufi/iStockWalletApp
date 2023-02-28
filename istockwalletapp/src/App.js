import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Navbar2 from './components/Navbar2'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import PrivateRoute from './components/PrivateRoute'
import Profile from './pages/Profile'
import Wallet from './pages/Wallet'
import About from './pages/About'
import ForgotPassword from './pages/ForgotPassword'
import AESB3 from './pages/Stocks/AESB3.jsx'



function App() {
  return (
    <>
      <Router>
      <Navbar /> 
        <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/about' element={<About />} />
        
        <Route path='/wallet' element={<PrivateRoute />} >
        <Route path='/wallet' element={<Wallet />} />
        <Route path='/wallet/AESB3' element={<AESB3 />} />
        </Route>
        
        <Route path='/forgot-password' element={<ForgotPassword/>} />
   
        <Route path='/profile' element={<PrivateRoute />} >
          <Route path='/profile' element={<Profile />} />
        </Route>
        </Routes>
        <Navbar2 /> 
      </Router>

      <ToastContainer autoClose={3000} />
    </>
  );
}

export default App;