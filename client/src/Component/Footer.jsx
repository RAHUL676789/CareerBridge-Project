import React from 'react'
import { FaLinkedin } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { FaGithub } from "react-icons/fa6";
import "../public/Footer.css"

const Footer = () => {
  return (
    <div className='footer'>
      <p className='text-white mt-2 fs-5'>Join CareerBridge today and experience smarter professional collaboration!</p>
      <span className='follow mx-2'>Follow Us On </span>
        <ul style={{ listStyleType: "none", color: "#555" }}>
         
          <li className='socia-link'>
          <a href="https://www.linkedin.com/in/rahul-lodhi/" className='socia-item' target='blank'><FaLinkedin size={20} /></a>
          </li>
          <li  className='socia-link'>
           <a href="https://www.instagram.com/rahull0dhi45/profilecard/?igsh=aWtkZng5a2w2bnpz" className='socia-item' target='blank'><FaInstagram  size={20}/></a>
          </li>
         <li  className='socia-link'>
            <a href="https://github.com/RAHUL676789" className='socia-item' target='blank'><FaGithub size={20} /></a>
         </li>
            
        </ul>
         
    </div>
  )
}

export default Footer
