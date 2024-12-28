import React from 'react'
import { CiHeart } from "react-icons/ci";
import { FaRupeeSign } from "react-icons/fa";
import unknown from "../assets/unknown.png"
import { FaArrowDown } from "react-icons/fa";
import { MdEventAvailable } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";

const UserCard = ({user,handleMessageClick}) => {

  
  return (
    <div className="singleUser">
                <div className="profile-box">

                  <p className='like-button ' title={user?.available.length > 0 ? "available":"not available"}><MdEventAvailable size={20} className={user?.available.length>0 ? "text-success":"text-warning"}/> </p>
                  <span className='charges'><FaRupeeSign size={20} className="d-inline"/> {user?.charge}/min</span>
                  <img src={user?.profilePic  != "" ? user.profilePic : unknown} alt="profile-pic" className='profile-pic' />
                  <h3>{user?.username}</h3>
                  <p>{user?.profession}</p>
                 
                </div>

                <div className="btn-container12"> 
                <button onClick={()=>handleMessageClick(user._id)} className='msg-btn text-decoration-none' type='button'>Message</button>
                </div>
                <Link to={`/user/${user?._id}`} className="profile-bottom text-decoration-none">
                  <p>Know More About My Profile</p>
                  <span><FaArrowDown /></span>
                </Link>
              </div>
  )
}

export default UserCard
