import React from 'react'
import { RxCross1 } from "react-icons/rx";

const Loader = () => {
  return (

    <div class="singupLoader">
        <div className='crossmarker'>
              <RxCross1  size={25}/>
        </div>
    <div class="spinner-border " role="status">
      <span class="sr-only"></span>
    </div>
  </div>
   
  )
}

export default Loader
