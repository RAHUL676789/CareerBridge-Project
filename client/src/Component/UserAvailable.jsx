import React from 'react'
import { useSelector,useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Error from './Error';

const UserAvailable = ({availableArray}) => {
  const currUser = useSelector((state)=>state.currentUser);
  const param = useParams();
  const userID = localStorage.getItem("userId");
  const socketConnectionn = useSelector((state) => state.currentUser.socketConnection);
  const sortedArray = availableArray.sort((a, b) => new Date(a.day) - new Date(b.day));
    const handleMeetinRequest = (meetinId)=>{
        console.log("meeting function run");

        if(!userID){
          toast.error("you are not login please login")
          return;
        }
     
       try{
        if(socketConnectionn){
          console.log("socketconnection available")
          let payload = {
            host:param.id,
            participant:userID,
            availableId : meetinId
          }
    
          socketConnectionn.emit("schedule-meeting",(payload));
          socketConnectionn.on("meeting-request-receiving",(data)=>{
                
                 if(data.success){
                  alert(data.message)
                  dispatch(setUserMeetings(data.data));
                 }
                 
          })
    
          socketConnectionn.on("meeting-request-sending",(data)=>{
            toast.success("meeting request has been send successfully");
          })
    
        }else{
          console.log("socketConnetion not available");
        }
       }catch(e){
        console.log("there is someting error while scheduleing meeting ",e);
       }
    
    
      }


      const groupByDate = sortedArray.reduce((acc,curr)=>{
        const date = curr.day.split("T")[0]
        
        if(!acc[date]){
          acc[date]=[]
        }
        acc[date].push(curr);
        return acc
      },{})


  return (
    <div className='availableTime'>
    {sortedArray.length > 0 ? Object.keys(groupByDate).map((date, idx) => (
      <div key={idx} className='bg-light m-1 p-1 rounded '>
        <h5 className='text-dark'>{date}</h5> {/* Date heading */}
        { groupByDate[date].map((item, i) => (

             <div className='avb' key={i}>
              <div className=''>
              <span className='start m-1 shadow-lg font-weight-dark rounded p-2'>{item.start}</span>
              <span className='font-weight-bold'>-</span>
              <span className='end m-1 shadow-lg   font-weignt-bold rounded p-2'>{item.end}</span>
              <button className='btn btn-success1 m-2'onClick={()=>handleMeetinRequest(item._id)}>Request</button>
            </div>

          </div> 
        ))}
      </div>
    )): <div className='Error-Handle-userAvailable'>

    
       <Error message={"Not Avaialable "}/>
   
    
     
   </div>}
  </div>
  )
}

export default UserAvailable
