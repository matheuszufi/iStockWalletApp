import React, { useState } from 'react';
import {FaPenSquare} from 'react-icons/fa'


function StockInput() {
  const [valueAESB3, setValueAESB3] = useState(localStorage.getItem('AESB3qtdd') || '');
  const [pmAESB3, setpmAESB3] = useState(localStorage.getItem('AESB3pm') || '');
  
  const handleChange = event => {
    setValueAESB3(event.target.value);
 
  
  };
  const handleChange2 = event => {
    setpmAESB3(event.target.value);
  
  };

  const handleSubmit = event => {
    event.preventDefault();
    DbWallet.push(event);
    localStorage.setItem('AESB3qtdd', valueAESB3);
    window.location.reload();
    console.log(event)
  };
  const handleSubmit2 = event => {
    event.preventDefault();
    localStorage.setItem('AESB3pm', pmAESB3);
    window.location.reload();
  };

  console.log(localStorage)
  // localStorage.clear();
  return (
    <div className='form-stocks'>
     <form onSubmit={handleSubmit}>
      <label>
        <p>QTT.:</p>
        <input
          type="AESB3qtdd"
          value={valueAESB3}
          onChange={handleChange}
        />
        </label>
        <button type="submit"><FaPenSquare className='form-stock-icon' /></button>
        {/* <p>{localStorage.getItem('AESB3{quantidade}')}</p> */}
      </form>
      <form onSubmit={handleSubmit2}>
        <label>
          <p>P.M.:</p>
          <input
            type="AESB3qtdd"
            value={pmAESB3}
            onChange={handleChange2}
          />
        </label>
        <button type="submit"><FaPenSquare className='form-stock-icon' /></button>

      </form>
    </div>
   
  );
}

export default StockInput;
