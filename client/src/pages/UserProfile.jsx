import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Avatar from "../Component/Avatar"
import logo from "../assets/logo.png"
import { MdOutlineWatchLater } from "react-icons/md";
import { SiGooglemeet } from "react-icons/si";
import { FcEngineering } from "react-icons/fc";
import toast from 'react-hot-toast';
import { IoSchool } from "react-icons/io5";
import Available from '../Component/Available';
import { useDispatch, useSelector } from 'react-redux';
import UserAvailable from '../Component/UserAvailable';
import { useSocketConnect } from '../Helper/socketConncetion';
import Navbar from '../Component/Navbar';
import { setUserMeetings } from '../feature/users/CurrentUser';
import Loader from '../Component/Loader';
const userProfile = () => {

  // const {socketConnect} = useSocketConnect();
  const socketconnection = useSelector((state)=>state.currentUser.socketconnection);
  const [loading,setLoading] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    if (socketconnection) {
      const handleMeetingRequest = (data) => {
        console.log(data);
        if (data.success) {
          toast.success(data.message);
          dispatch(setUserMeetings(data.data));
        }
      };

      const handleAcceptAlert = (data) => {
        console.log("this is accepting alert for meetign confirmationn");
        if (data) {
          console.log(data);
          toast.success(data.message);
        }
      };

      const handleMeetingAlert = (data)=>{
            if(data){
              toast.success(data.message)
              
            }
      }
      socketconnection.on("meeting-request-receiving", handleMeetingRequest);
      socketconnection.on("accept-alert", handleAcceptAlert);
      socketconnection.on("meeting-alert",handleMeetingAlert)

      return () => {
        socketconnection.off("meeting-request-receiving", handleMeetingRequest);
        socketconnection.off("accept-alert", handleAcceptAlert);
        socketconnection.off("meeting-alert",)
      };
    }
  }, [socketconnection, dispatch]);
  const param = useParams();
  console.log(param);
  const [profileUser, setProfileUSer] = useState([]);

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthOfYear = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"];

  const CurrentDate = new Date();

  const [currentMonth, setCurrentMonth] = useState(CurrentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(CurrentDate.getFullYear());

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const [available,setAvailable] = useState([]);
  const URL = import.meta.env.VITE_BACKEND_URL;

  const getUsersDetails = async (id) => {
    try {
      setLoading(true);
      const userData = await fetch(`${URL}/CareerBridge/user/${id}`,{
        method:"GET",
        credentials: "include",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
      },
      });
      const result = await userData.json();
      console.log(result);
      setProfileUSer(result.data);
      setLoading(false);
      
      setAvailable((prev)=>{
        return [...result.data.available]
      })
      toast.success(result.message)


    } catch (e) {
      console.log(e);
      setLoading(false);
    }

  }
  useEffect(() => {
    getUsersDetails(param.id);
  }, [param.id]);


  const handleMeetinRequest = (meetinId)=>{

    console.log("meeting function run");
    setLoading(true);

    if(!userID){
      toast.error("you are not login please login")
      return;
    }
 
   try{
    if(socketconnection){
      console.log("socketconnection available")
      let payload = {
        host:param.id,
        participant:userID,
        availableId : meetinId
      }

      socketconnection.emit("schedule-meeting",(payload));
      socketconnection.on("meeting-request-receiving",(data)=>{
            
             if(data.success){
              alert(data.message)
              dispatch(setUserMeetings(data.data));
              setLoading(false);
             }
             
      })

      socketconnection.on("meeting-request-sending",(data)=>{
        toast.success("meeting request has been send successfully");
      })

    }else{
      console.log("socketConnetion not available");
      setLoading(false);
    }
   }catch(e){
    toast.error("there is someting error while scheduleing meeting ");
    setLoading(false);
   }


  }
  return (
    <div className=" m-0 p-0">
     
      {loading && <Loader/>}


      <div className='row gap-2   mt-2 profileData '>
      

        <div className='col-md-4 border rounded bg-light'>
          <div className='profileDetails '>
            <div className='profilePicture px-1'>
              <Avatar
                height={60}
                width={60}
                username={profileUser.username}
                profilePic={""}
                email={profileUser.email}
              />
            </div>
            <div className="userEmails text-center">
              <span className='mt-2 '>{profileUser.username && profileUser.username}</span>
              <span className='mb-2 '>{profileUser.email && profileUser.email}</span>
            </div>

          </div>
          <div className='d-flex align-items-center justify-center mt-2'>
            <p className='primary '><FcEngineering size={25} /></p>
            <p className='primary fs-4'>{profileUser?.profession}</p>
          </div>
          <div className='profile-education mt-2'>
            <h5>Education</h5>
            <p><IoSchool size={25} className=' primary' /> &nbsp; {profileUser.education}</p>
          </div>
          <div className='profile-info mt-2 '>
            <p >  <MdOutlineWatchLater size={25} className='primary' /> &nbsp; 30 minutes</p>
            <p ><SiGooglemeet size={22} className='primary' /> &nbsp; Zoom Meeting</p>

          </div>
        </div>

        <div className=' row col-md-8 gap-2'>

          <div className='availability-check col-md-6 '>
            <div className='text-center'>
              <h2 className='bg-light col-md-12 m-2 p-2 font-weight-bold'>Availability</h2>
            </div>
            <div className='weekdays'>
              {daysOfWeek.map((day, idx) => (
                <span >{day}</span>
              ))}
            </div>
            <div className="days">
              {[...Array(firstDayOfMonth).keys()].map((_, key) => (<span />))}
              {[...Array(daysInMonth).keys().map((day, i) => (
                <span className={available?.some((avb,i)=>{
                  let avbDate = new Date(avb.day);
             
                  let targetDate = new Date(currentYear,currentMonth,day+1);
                  
                  return (
                    avbDate.getUTCFullYear() === targetDate.getFullYear() &&
                    avbDate.getUTCMonth() === targetDate.getMonth() &&
                    avbDate.getUTCDate() === targetDate.getDate()
                  )
                 
                
                })&& "current-date"} >{day + 1}</span>
              ))]}
            </div>

          </div>
          <div className=' available  col-md-5 bg-light col-gap-2'>
            <h5 className='text-center mb-3'>Schedule (Available)</h5>

            <div className='text-center'>
              <UserAvailable availableArray={available} user={false} handleMeetinRequest={handleMeetinRequest} />

            </div>

          </div>

        </div>
      </div>
    </div>

  )
}

export default userProfile
