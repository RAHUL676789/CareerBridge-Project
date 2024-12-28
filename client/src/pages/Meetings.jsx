import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import {  useParams, useNavigate } from 'react-router-dom';
import '../public/meeting.css'
import { setCurrentUser, setUserMeetings } from '../feature/users/CurrentUser';
import Loader from "../Component/Loader"
import Error from '../Component/Error';
import { IoIosWarning } from "react-icons/io";
import { AiOutlineDelete } from "react-icons/ai";
import MeetingCard from '../Component/MeetingCard';
import { setMeetingDetails,setHandleDeleteMeeting } from '../feature/users/Meetings';
import { fetchUserDetail,fetchMeetingDetail,getAllRequestMeeting,getAllConfirmMeeting,trackMeetings,handleMeetingDelete,handleCancelRequest,formatDate,useStartMeetingHandler} from '../Helper/meeting';

const Meetings = () => {

    const URL = import.meta.env.VITE_BACKEND_URL;

    const [currUser, setCurrUSer] = useState({})

    const socketConnectionn = useSelector((state) => state.currentUser.socketConnection);
    const meetingDetail = useSelector((state)=>state.meetingDetail);
    const param = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const [warning, setWarning] = useState({
        status: false,
        message: ""
    });

    const [isloading, setisLoading] = useState(false);
    
// fetchin the meeting owner detail / current user detials
    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await fetchUserDetail();
                if (result.success) {
                    setCurrUSer(() => ({ ...result.data }));
                } else {
                    toast.error(result.error || "Unexpected error");
                }
            } catch (error) {
               
                toast.error("An error occurred while fetching user details.");
            }
        };
    
        fetchData();
    }, []);





    // fetching all meeting data related to current user
    
    useEffect(() => {
        const fetchData = async () => {
            if (param.id) {
                setisLoading(true);
                try {
                    const meetinresult = await fetchMeetingDetail(param.id);
                   
    
                    if (meetinresult.success) {
                       dispatch(setMeetingDetails(meetinresult))
                    } else {
                        toast.error("Meeting details could not be fetched");
                    }
                } catch (error) {
                   
                    toast.error("Failed to fetch meeting details");
                } finally {
                    setisLoading(false);
                }
            }
        };
    
        fetchData();
    }, [param.id]); 





    



    const handleAllMeetingFilter = async() => {
        try {
           setisLoading(true)
            const meetinresult = await fetchMeetingDetail(param.id);
          

            if (meetinresult.success) {
                dispatch(setMeetingDetails(meetinresult))
                setisLoading(false);
            } else {
                setisLoading(false);
                toast.error(meetinresult.message);
             
            }
        } catch (e) {
            toast.error(e.message);
           
        }

    }




    // fetchin all confirm meeting of curretn user

    const handleAllMeetingConfirm = async() => {
        try {
         setisLoading(true);
           const meetingresult = await getAllConfirmMeeting(param.id);
           if (meetingresult.success) {
            dispatch(setMeetingDetails(meetingresult))
            setisLoading(false);
        } else {
            setisLoading(false);
            toast.error(meetingresult.message);
          
        }


        } catch (e) {
          
            toast.error(e.message);
        }

    }



    // fetching all meeting request for curretn user



    const handleAllMeetingRequest = async() => {
        try {
            setisLoading(true);

             const meetingresult = await getAllRequestMeeting(param.id)
             if (meetingresult.success) {
                dispatch(setMeetingDetails(meetingresult))

            setisLoading(false);

            } 
            
            else {
                setisLoading(false);

                toast.error(meetingresult.message);
            }

        } catch (e) {
           
            toast.error(e.message);
        }
    }


// fetchin all meeting request for another user

    const handleMeetingTrack = async ()=>{
        setisLoading(true)
        const meetingresult = await trackMeetings(param.id);
        if(meetingresult.success){
            dispatch(setMeetingDetails(meetingresult))

            
        }else{
            toast.error(meetingresult.message)
        }
        setisLoading(false);
    }


// function for accepting meeting request from another users

    const handleAceeptMeetingRequest = async (meetingId, host, participant) => {
        try {
            const response = await fetch(`${URL}/user/meetings/${meetingId}`, {
                method: "post",
                credentials: "include",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({})
            });
            const result = await response.json();



            if (result.success) {
                toast.success(result.message);
                dispatch(setCurrentUser(result.data));
               
                if (socketConnectionn) {
                    socketConnectionn.emit("accepted-meeting-request", {
                        id: meetingId,
                        host: host,
                        participant: participant

                    })
                }

                // fetchMeetingDetail();
                const meetinresult = await fetchMeetingDetail(param.id);
                if (meetinresult.success) {
                    dispatch(setMeetingDetails(meetinresult))
                } else {
                    toast.error(meetinresult.message || "unexpexted error")
                }

            }else{
                toast.error(result.message);
            }
        } catch (e) {
            toast.error(e.message);

        }

    }



    // handling cancel meeting requests

    
    const handleCancelMeetingRequest = async (meetingId, host, participant) => {

        const meetingresult = await handleCancelRequest(meetingId,host,participant);

        if(meetingresult.success){
            toast.success(meetingresult.message)
            const meetinresult = await fetchMeetingDetail(param.id);
            if (meetinresult.success) {
                dispatch(setMeetingDetails(meetinresult))
            } else {
                toast.error(meetinresult.message || "unexpexted error")
            }

        }else{
               toast.error(meetingresult.message)
        }



    }



    // handlinig deleting meeting request

    const hanleDeleteMeeting = async (meetingId, host) => {
       
        const meetingresult = await handleMeetingDelete(meetingId,host);
        if(meetingresult.success){
            toast.success(meetingresult.message);
            dispatch(setHandleDeleteMeeting(meetingresult.data))
        }else{
            toast.error(meetingresult.message)
        }

    }




    // handling startmeeting scheduling

    const startMeeting = useStartMeetingHandler();

    const  handleStartMeeting = (meetingid, roomid, startTime, endingTime) => {
           
        
        const meetingStartResult = startMeeting(meetingid,roomid,startTime,endingTime);

        if(meetingStartResult){
            setWarning((prev)=>{
                return {
                    status:meetingStartResult.status,
                    message:meetingStartResult.message
                }
            })
        }

    }

   
// handling all socketConnectionn alerts

    useEffect(() => {
        if (socketConnectionn) {
          const handleMeetingRequest = (data) => {
           
            if (data.success) {
              toast.success(data.message);
              dispatch(setUserMeetings(data.data));
            }
          };
    
          const handleAcceptAlert = (data) => {
            console.log("this is accepting alert for meetign confirmationn");
            if (data) {
          
              toast.success(data.message);
            }
          };
    
          const handleMeetingAlert = (data)=>{
                if(data){
                  toast.success(data.message)
                  
                }
          }
          socketConnectionn.on("meeting-request-receiving", handleMeetingRequest);
          socketConnectionn.on("accept-alert", handleAcceptAlert);
          socketConnectionn.on("meeting-alert",handleMeetingAlert)
    
          return () => {
            socketConnectionn.off("meeting-request-receiving", handleMeetingRequest);
            socketConnectionn.off("accept-alert", handleAcceptAlert);
            socketConnectionn.off("meeting-alert",)
          };
        }
      }, [socketConnectionn, dispatch]);

   
    const handleWarnign = () => {
        setWarning((prev) => {
            return {
                status: false,
                message: ""
            }
        })

    }


    const handleJoinMeeting = (participant, meetingId) => {

        navigate(`/user/meetings/join-room/${meetingId}/${participant}`);
    }



    return (
        <div className='main-meeting'>

            {warning.status && <div className={`warning ${warning.status && "show"}`}>
                <div>
                    <span className='m-2'><IoIosWarning size={30} /></span>
                    <p className='m-2'>{warning.message}</p>
                </div>
                <span className='m-2 cursor-pointer ' onClick={() => handleWarnign()}><AiOutlineDelete size={30} /></span>
            </div>}

            <div className='filter-container text-white  mt-2'>

                <div className='filtratioins text-black '>
                    <button className={`${meetingDetail?.AllMeetingDetails ? "btn-primary1 text-white" : "bg-light opacity-50"} cursor-pointer p-2 m-1 border-0 `} onClick={handleAllMeetingFilter}>All-Meetings</button>
                    <button className={`${meetingDetail?.RequestMeetigns ? "btn-primary1 text-white" : "bg-light opacity-50"} cursor-pointer p-2 m-1 border-0 `} onClick={handleAllMeetingRequest}>Meetings-Request</button>
                    <button className={`${meetingDetail?.ConfirmMeeting ? "btn-primary1 text-white" : "bg-light opacity-50"} cursor-pointer p-2 m-1 border-0`} onClick={handleAllMeetingConfirm}>UpComing-Meetings</button>
                    <button className={`${meetingDetail?.trackRequest ? "btn-primary1 text-white" : "bg-light opacity-50"} cursor-pointer p-2 m-1 border-0`} onClick={()=>handleMeetingTrack()}>Track-Request</button>
                </div>
            </div>
            <div className='MeetingCard-Container'>
                {isloading && <div className=''>
                    <Loader />
                </div>}
                {meetingDetail?.allMeetings?.length > 0 ? meetingDetail?.allMeetings?.map((meeting, idx) => (
                   <MeetingCard
                    meetingDetail={meetingDetail} 
                    meeting={meeting} key={idx} 
                    currUser={currUser}
                    handleAceeptMeetingRequest={handleAceeptMeetingRequest}
                    handleCancelMeetingRequest={handleCancelMeetingRequest}
                    handleStartMeeting={handleStartMeeting}
                    formatDate={formatDate}
                    handleJoinMeeting={handleJoinMeeting}
                    hanleDeleteMeeting={hanleDeleteMeeting}
                   />
                )) : <div className='Error-Handle'>
                      <Error message={'there is no  meeting request found'} />
                    </div>}
            </div>
        </div>
    )
}

export default Meetings
