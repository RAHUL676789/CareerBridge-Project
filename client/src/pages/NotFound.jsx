import React from 'react'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
    const navigate = useNavigate();
     const handleClick = ()=>{
        navigate("/")
     }
  return (
    <div className='notfound'>
      <h1>Page not found</h1>
      <div className='notfoundButton'>
       <button className='primary1' onClick={handleClick}>
        Go To Home Page
       </button>
      </div>
    </div>
  )
}

export default NotFound
