import { ReducerType, Tuple } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
const URL = import.meta.env.VITE_BACKEND_URL;
import { useNavigate } from "react-router-dom";
export const fetchUserDetail = async () => {
    try {
        const userid = localStorage.getItem("userId")
        let userData = await fetch(`${URL}/CareerBridge/user/${userid}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const result = await userData.json();

        if(result.success){
            return {
                data: result.data,
                success: true
            };
        }else{
            return {
                error:true,
                message:result.message
            }
        }

       
    } catch (e) {


        return {
            data: {},
            error: true,
            message :e.message || "unexpected error occured"
        }
    }


}





export const fetchMeetingDetail = async (paramid) => {
    try {

        const response = await fetch(`${URL}/user/meetings/${paramid}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            }
        });
        let result = await response.json();


        if (result.success) {

            const { data } = result;
            console.log("this is meeting data", data);


            return {
                success: true,
                allMeetings: data,
                trackRequest: false,
                AllMeetingDetails: true,
                RequestMeetigns: false,
                ConfirmMeeting: false
            }
        }else{
            return {
                error:true,
                message:result.message
            }
        }


    } catch (e) {
        console.log(e, "this error ocuured in this page")
        return {
            error: true,
            message: e.message || "unexpected error occured"
        }
    }

}



export const getAllRequestMeeting = async (paramid) => {
    try {
        const response = await fetch(`${URL}/user/meetings/request/${paramid}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            }
        });
        let result = await response.json();


        if (result.success) {

            const { data } = result;
            console.log("this is meeting data", data);

            return {
                success: true,
                allMeetings: data,
                trackRequest: false,
                AllMeetingDetails: false,
                RequestMeetigns: true,
                ConfirmMeeting: false
            }

        }else{
            return {
                error:true,
                message:result.message
            }
        }


    } catch (e) {
        console.log(e, "this error ocuured in this page")
        return {
            error: true,
            message: e.message || "unexpected error occured"
        }
    }

}




export const getAllConfirmMeeting = async (paramid) => {
        try {

            const response = await fetch(`${URL}/user/meetings/confirm/${paramid}`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            let result = await response.json();
            console.log("this is the result of meetign details", result);

            if (result.success) {

                const { data } = result;

                return {
                    success: true,
                    allMeetings: data,
                    trackRequest: false,
                    AllMeetingDetails: false,
                    RequestMeetigns: false,
                    ConfirmMeeting: true
                }


            }else{
                return {
                    error:true,
                    message:result.message
                }
            }


        } catch (e) {
            console.log(e, "this error ocuured in this page")
           
            return {
                error: true,
                message: e.message || "unexpected error occured"
            }
        }

    }




    export const trackMeetings = async (paramid) => {
       
       try{
        const response = await fetch(`${URL}/user/meetings/track-Meetings/${paramid}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            }
        });

        const result = await response.json();
        
        if (result.success) {
          const {data} = result;
          console.log(data);

            return {
                success: true,
                allMeetings: data,
                trackRequest: true,
                AllMeetingDetails: false,
                RequestMeetigns: false,
                ConfirmMeeting: false
            }
          
        } else {
           return {
            error:true,
            message:result.message
           }
        }
       }catch(e){
        
        return {
            error: true,
            message: e.message || "unexpected error occured"
        }
       }


    }



    export const handleMeetingDelete = async (meetingid,host)=>{
        try{
            const response = await fetch(`${URL}/user/meetings/${meetingid}/${host}`, {
                method: "delete",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({})
            });
    
            const result = await response.json();
          
    
            if (result.success) {
        
                return {
                    success:result.success,
                    message:result.message,
                    data:result.data.meetings
                }
            } else {
                return{
                    message:result.message,
                    error:true
                }
               
    
            }
        }catch(e){
            return {
                message:e.message || "unexpected error ocuured",
                error:true
            }
        }
    }



    export const handleCancelRequest = async (meetingId,host,participant)=>{
       try{
        const response = await fetch(`${URL}/user/meetings/cancel/${meetingId}`, {
            method: "post",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                host: host,
                participant: participant
            })
        });

        const result = await response.json();
        console.log(result);

        if (result.success) {
           return {
            success:result.success,
            message:result.message,
           }

        }else{

         return{
            message:result.message,
            error:true
        }
    }
       }catch(e){
        return {
            message:e.message || "unexpected error occured"
        }
       }


    }


    export  function formatDate(dateString) {
        // Parse the date from the ISO string
        const date = new Date(dateString);

        // Extract year, month, and day
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // month is 0-indexed, so add 1
        const day = String(date.getUTCDate()).padStart(2, '0');

        // Return formatted date as "YYYY MM DD"
        return `${year}-${month}-${day}`;
    }



    export const useStartMeetingHandler = () => {
        const socketConnectionn = useSelector((state) => state.currentUser.socketConnection);
        const navigate = useNavigate();
    
        const handleStartMeeting = (meetingid, roomid, startTime, endingTime) => {
            const [startHour, startMinutes] = startTime.split(":").map(Number);
            const [endingHours, eninMinutes] = endingTime.split(":").map(Number);
            const now = new Date();
            const currentHours = now.getHours();
    
            if (currentHours < startHour || currentHours > endingHours) {
                return {
                    status: true,
                    message: `You can start meeting before ${startHour}:${startMinutes} and after ${endingHours}:${eninMinutes}`,
                };
            } else {
                if (!socketConnectionn) {
                    navigate("/");
                } else {
                    navigate(`/user/meetings/join-room/${meetingid}/${roomid}`);
                    socketConnectionn.emit("start-meeting-alert", meetingid);
                    return {
                        status: false,
                        message: `Meeting started successfully!`,
                    };
                }
            }
        };
    
        return handleStartMeeting;
    };




   