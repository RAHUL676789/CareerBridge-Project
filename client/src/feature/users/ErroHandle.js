import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   error:false,
   errorMessage:""
}

const ErrorHandlerSlice = createSlice({
    name:"ErrorHandler",
    initialState,
    reducers:{
        setErrorHandle :(state,action)=>{
            console.log("usercofcceupdation");
              state.error = action.payload.error;
              state.errorMessage=action.payload.errorMessage
          },
          resetErrorHandle :(state,action)=>{
            state.error = action.payload.error;
            state.errorMessage=action.payload.errorMessage
          }
       
    }
})


 export const {setErrorHandle,resetErrorHandle} = ErrorHandlerSlice.actions;
 export default ErrorHandlerSlice.reducer;
