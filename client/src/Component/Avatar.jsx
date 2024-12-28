import React from 'react'
import { PiUserCircleBold } from "react-icons/pi";

const Avatar = ({ username, height, width, profilePic,email}) => {
 



  let userIcon = username;
  if (username) {
    userIcon = username.split(" ");
   
    if (userIcon.length > 0) {
     
      userIcon = userIcon[0][0] + userIcon[0][1];
      userIcon = userIcon.toUpperCase();
   
    } else {
      userIcon = userIcon[0][0] + userIcon[0][1];
      userIcon = userIcon.toUpperCase();
    }


  }


  return (
    <div className='userDetail'>
      {profilePic ? (<div className='profilePic mb-3'> <img src={profilePic} alt={name} style={{ width: width + "px", height: height + "px" }} className='rounded-full border border-primary' /> 
        </div>
      ) :
        (username ?
          (
               <div className='iconsOfUser fs-6 bg-white text-dark ' style={{height:height+"px",width:width+"px",backgroundColor:"dark",color:`${"white"}`,border:`1px solid black`}} title={username}>
                  {userIcon}
                
              </div>
               
             ) :
         <div className='withoutUserName'>
           <PiUserCircleBold size={width} className='' />
           
         </div>)
      }
    </div>
  )
}

export default Avatar
