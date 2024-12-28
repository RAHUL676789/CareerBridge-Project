import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    allMeetings:[] ,
    trackRequest : false,
    AllMeetingDetails:false,
    RequestMeetigns:false,
    ConfirmMeeting:false
}


const meetingDetail = createSlice({
    name:"currentUser",
    initialState,
    reducers:{
        setMeetingDetails:(state,action)=>{
            state.allMeetings=action.payload.allMeetings,
            state.trackRequest=action.payload.trackRequest,
            state.AllMeetingDetails=action.payload.AllMeetingDetails,
            state.RequestMeetigns=action.payload.RequestMeetigns,
            state.ConfirmMeeting=action.payload.ConfirmMeeting


        },
        setHandleDeleteMeeting:(state,action)=>{
          return {
            ...state,
            allMeetings:action.payload
          }

        }
    }
})

 export const {setMeetingDetails,setHandleDeleteMeeting} = meetingDetail.actions;
 export default meetingDetail.reducer;