import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";

const initialState = {
    id:"",
    username:"",
    email:"",
    education:"",
    charge:null,
    profilePic:"",
    profession:"",
    converSations:[],
    meetings:[],
    available:[],
    socketConnection:null
}

const currentUserSlice = createSlice({
    name:"currentUser",
    initialState,
    reducers:{
        setCurrentUser :(state,action)=>{
            console.log("usercofcceupdation");
              state.charge = action.payload.charge || 0;
              state.profession=action.payload.profession,
              state.profilePic = action.payload.profilePic,
              state.meetings = action.payload.meetings,
              state.converSations = action.payload.converSations,
              state.username=action.payload.username,
              state.email=action.payload.email,
              state.education= action.payload.education,
              state.available =action.payload.available,
              state.id=action.payload._id

        },
        setUserMeetings:(state,action)=>{
            return{
                ...state,
                meetings : action.payload
            }

        },
        setSocketConnection:(state,action)=>{
            state.socketConnection= action.payload
        },
        resetCurrentUSer :(state,action)=>{
           state.id=action.payload.id
           state.username = action.payload.username,
           state.email=action.payload.email,
           state.education=action.payload.education,
           state.charge=action.payload.charge,
           state.profilePic=action.payload.profilePic,
           state.profession=action.payload.profession,
           state.converSations=action.payload.converSations,
           state.meetings=action.payload.meetings,
           state.available=action.payload.available,
           state.socketConnection=action.payload.socketConnection
        }
    }
})


 export const {setCurrentUser,setSocketConnection,setUserMeetings,resetCurrentUSer} = currentUserSlice.actions;
 export default currentUserSlice.reducer;
