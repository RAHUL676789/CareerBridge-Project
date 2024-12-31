import React from 'react'
import "../public/error.css"
import { MdError } from "react-icons/md";

const Error = ({message}) => {
  return (
    <div className='error'>
         <MdError size={50}/>
         <h5>{message}</h5>
      
    </div>
  )
}

export default Error
