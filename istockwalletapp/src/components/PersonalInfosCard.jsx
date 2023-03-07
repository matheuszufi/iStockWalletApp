import React from 'react'

function PersonalInfosCard() {
  const AESB3qtddParse = parseFloat(localStorage.getItem('AESB3qtdd'));
  const AESB3pmParse = parseFloat(localStorage.getItem('AESB3pm'));
  const multiplicationResult = parseFloat(AESB3qtddParse * AESB3pmParse).toFixed(2);



  return (
    <div className='card-personal-infos'>
        <div className='card-personal-infos-top'>
            <p>P.M.:</p><p>R${localStorage.getItem('AESB3pm')}</p>
        </div>
        <div className='card-personal-infos-bottom'>
            <p>QTD:</p><p>{localStorage.getItem('AESB3qtdd')}</p>
        </div>
    </div>
  )
}

export default PersonalInfosCard