import React, { useState, useEffect } from 'react';
import {FaPenSquare} from 'react-icons/fa'
import axios from 'axios';
// import { db } from '../../firebase.config'
// import { updateDoc, doc } from 'firebase/firestore'


const StockInput = () => {
    // const auth = getAuth()
    const [results, setResults] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
      //   const [formData, setFormData] = useState({
  //     ativos: auth.currentUser.ativos.AESB3.numAtivos,
  //     precoMedio: auth.currentUser.ativos.AESB3.precoMedio
  //   })

  //   const { ativos, precoMedio } = formData

  //   const onSubmit = async () => {
  //     try {
  //         if (auth.currentUser.ativos.AESB3.numAtivos !== ativos) {
  //             await updateProfile(auth.currentUser, { ativos: name})

  //             const userRef = doc(db, 'users', auth.currentUser.uid)
  //             await updateDoc(userRef, {
  //                 name
  //             })
  //         }


  //     } catch (error) {
  //         toast.error('Não foi possivel alterar os detalhes')
  //     }
  // }

  // const onChange = (e) => {
  //   setFormData((prevState) => ({
  //     ...prevState,
  //     [e.target.id]: e.target.value,
  //   }))
  // }


    useEffect(() => {

    
        const fetchData = async () => {    
          
          try {
            const response2 = await axios.get("https://brapi.dev/api/quote/AESB3?range=max&fundamental=true&dividends=true")
            const results2 = response2.data.results
            
            setResults(results2);
            setIsLoading(false);   
            
          } catch (error) {
            console.error('Erro ao fazer requisição:', error);
            setIsLoading(false);
          }
        };
    
        fetchData();
    
      }, []);
    

  return ( isLoading ? (
    <p>Carregando...</p>
  ) : (
    <div className='stock-header-value'>
        <div className='stock-amount'>
            <label for="stock-amount">N° DE AÇÕES:</label>
            <input id="stock-amount" type="number"></input>
            <FaPenSquare />
        </div>
        <div className='stock-average-price'>
            <label for="stock-average-price">PREÇO MÉDIO:</label>
            <input id="stock-average-price"></input>
            <FaPenSquare />
        </div>
  </div>
  ))
}

export default StockInput