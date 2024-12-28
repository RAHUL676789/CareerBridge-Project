import React, { useEffect } from 'react'
import {ZegoUIKitPrebuilt} from '@zegocloud/zego-uikit-prebuilt'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const JoinRoom = () => {
   const param = useParams();
   const socketConnection = useSelector((state)=>state.currentUser.socketConnection);
   const navigate = useNavigate()
   console.log(param);
   const currUser = useSelector((state)=>state.currentUser);
   console.log(currUser);

  const myMeeting = async (element)=>{
    const appID = 410084672;
    const URL = import.meta.env.VITE_BACKEND_URL;
    const serverSecret = "c55312152dfe899a7fa85d6d42338883";
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID,serverSecret,param.roomid,param.user,currUser.username||"unknown");
    const zc = ZegoUIKitPrebuilt.create(kitToken);
    zc.joinRoom({
      container:element,
      sharedLinks:[{
        name:"Copy",
        url: `http://localhost:5173/user/meetings/join-room/${param.id}/${param.roomid}`,
      }
      
    ],
      scenario:{
        mode:ZegoUIKitPrebuilt.OneONoneCall
      },
      showScreenSharingButton:false
    })
  }



  return (
    <div>
      <div ref={myMeeting}/>
    </div>
  )
}

export default JoinRoom
