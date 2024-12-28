
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentUser,setUserMeetings } from '../feature/users/CurrentUser';
import toast from 'react-hot-toast';
import { Link, useParams } from 'react-router-dom';
import Error from './Error';



const Available = ({ availableArray, user, }) => {
  const URL = import.meta.env.VITE_BACKEND_URL;
 const currUser = useSelector((state)=>state.currentUser);
  const socketConnectionn = useSelector((state) => state.currentUser.socketConnection);
 console.log("currentuser",currUser);
 const dispatch = useDispatch();
 const param = useParams();
  const [avbArray,setAvbArray] = useState(availableArray);
  const userID = localStorage.getItem("userId");
  console.log("availarray", availableArray);
  const sortedArray = availableArray.sort((a, b) => new Date(a.day) - new Date(b.day));

  console.log(sortedArray,"this is the sortedavailable araay");

  const groupByDate = sortedArray.reduce((acc,curr)=>{
    const date = curr.day.split("T")[0]
    
    if(!acc[date]){
      acc[date]=[]
    }
    acc[date].push(curr);
    return acc
  },{})


  

  const handleDeletion = async(availableId)=>{

    console.log(userID);
           try{
            const response = await fetch(`${URL}/CareerBridge/user/${userID}/${availableId}`,{
              method:"Delete",
               credentials: "include",
               headers: {
                "Content-Type": "application/json",
            },
             });
             const result = await response.json();
             console.log("sdlsgdkjflddelete",result);
             if(result.success){
              toast.success(result.message);
              console.log("resltrjkf",result.data);
               dispatch(setCurrentUser(result.data));
             }
           }catch(e){
            toast.error(e.message || "there is someting error");
           }
  }
  return (
    <div className='availableTime'>
    { sortedArray.length >  0 ?  Object.keys(groupByDate).map((date, idx) => (
      <div key={idx} className='bg-light m-1 p-1 rounded '>
        <h5 className='text-dark'>{date}</h5> {/* Date heading */}
        {groupByDate[date].map((item, i) => (
          <div className='avb' key={i}>
              <div className=''>
              <span className='start m-1 shadow-lg font-weight-dark rounded p-2'>{item.start}</span>
              <span className='font-weight-bold'>--</span>
              <span className='end m-1 shadow-lg   font-weignt-bold rounded p-2'>{item.end}</span>
              <button className=' btn-danger1 m-2'onClick={()=>handleDeletion(item._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    )):<div className='text-warning'> 
      <Error message={"set Your Avaialblity for today or for next days"}/></div>}
  </div>
  )
}

export default Available
