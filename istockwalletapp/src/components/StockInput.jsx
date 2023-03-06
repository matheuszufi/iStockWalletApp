import React, { useState } from 'react';

function NumberInput() {
  const [valueAESB3, setValueAESB3] = useState(localStorage.getItem('AESB3{quantidade}') || '');
  
  const handleChange = event => {
    setValueAESB3(event.target.value);
  };

  const handleSubmit = event => {
    event.preventDefault();
    localStorage.setItem('AESB3{quantidade}', valueAESB3);
  };

  console.log(localStorage)

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Número:
        <input
          type="AESB3/quantidade"
          value={valueAESB3}
          onChange={handleChange}
        />
      </label>
      <button type="submit">Salvar</button>
      {/* <p>{localStorage.getItem('AESB3{quantidade}')}</p> */}
    </form>
  );
}

export default NumberInput;
