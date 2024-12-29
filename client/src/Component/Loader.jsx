import React from 'react'
import { RxCross1 } from "react-icons/rx";

const Loader = ({handleIsloading}) => {
  return (

    <div class="singupLoader">
        <div className='crossmarker'>
              <RxCross1  size={25} onClick={handleIsloading}/>
        </div>
    <div class="spinner-border " role="status">
      <span class="sr-only"></span>
    </div>
  </div>
   
  )
}

export default Loader
