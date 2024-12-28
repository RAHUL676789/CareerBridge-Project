import { configureStore } from '@reduxjs/toolkit'

import userReducer from '../feature/users/userSlice'
import currentUserReducer from '../feature/users/CurrentUser'
import  setErrorHandle  from '../feature/users/ErroHandle'
import meetingDetail from "../feature/users/Meetings"
export const store = configureStore({
  reducer: {
    user:userReducer,
    currentUser:currentUserReducer,
    univerSarError:setErrorHandle,
    meetingDetail:meetingDetail

  },
})
