import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { setUsers } from "../feature/users/userSlice";
import io from "socket.io-client";
import { setSocketConnection, setUserMeetings } from "../feature/users/CurrentUser";
import Error from "../Component/Error";


import UserCard from "../Component/UserCard";
import { useNavigate } from "react-router-dom";
import Loader from "../Component/Loader";


const Home = () => {

  const dispatch = useDispatch();
  const users = useSelector((state) => state.user);
  const userID = localStorage.getItem("userId");
  const socketConnection = useSelector((state) => state.currentUser.socketConnection);
  const [loading,setLoading] = useState(false);


  const URL = import.meta.env.VITE_BACKEND_URL;


  // fetching user detail and making socket connection

  useEffect(() => {
    if (!socketConnection && userID) {
      try {
        const socket = io(URL, {
          auth: { id: userID },
        });

        socket.on("connection-success", (data) => {
          console.log("Connected successfully:", data.message);
          console.log("Socket ID:", data.socketId);
        });

        dispatch(setSocketConnection(socket));
      } catch (e) {
       
        toast.error("there is somethign error while making connection")


      }
    }
  }, [socketConnection, userID]);

  useEffect(() => {
    if (socketConnection) {
      const handleMeetingRequest = (data) => {
       
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
      socketConnection.on("meeting-request-receiving", handleMeetingRequest);
      socketConnection.on("accept-alert", handleAcceptAlert);
      socketConnection.on("meeting-alert",handleMeetingAlert)

      return () => {
        socketConnection.off("meeting-request-receiving", handleMeetingRequest);
        socketConnection.off("accept-alert", handleAcceptAlert);
        socketConnection.off("meeting-alert",)
      };
    }
  }, [socketConnection, dispatch]);


  // fetching user detial function 

  const getUsersDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${URL}/CareerBridge/user`, {
        method: "GET",
        credentials: "include",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      });


      const result = await response.json();

      console.log(result);
      if (result.success) {
        toast.success(result.message);
        setLoading(false);
        dispatch(setUsers(result.data));
      } else {

        console.log(result);
        toast.error(result.message);
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
      toast.error("Unable to fetch user details");

    }
  };

  useEffect(() => {
    getUsersDetails();
  }, []);

 

 

  const navigate = useNavigate();


  const handleMessageClick = (id)=>{
    if(!userID){
      toast.error("you are not login please login");
    }else{
      navigate(`/user/conversation/${id}`)

    }
  }


 
  return (
    <div>
     
      <main>
        {loading && <Loader/>}
        <div className="allUsers">
          {users?.length > 0 && !loading?
            users?.map((user, idx) => (
             <UserCard user = {user} key={idx} handleMessageClick={handleMessageClick}/>

            )) : <div>
              <Error message={"No User found "} />
            </div>}
        </div>
      </main>
    </div>
  );
};

export default Home;
