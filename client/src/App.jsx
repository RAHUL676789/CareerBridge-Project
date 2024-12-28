import { useState } from 'react'
import './App.css'
import './profile.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Singup from './pages/Signup';
import Home from './pages/Home';
import UserProfile from './pages/UserProfile';
import Loader from './Component/Loader';
import { BrowserRouter,Routes,Route, useLocation } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import MyNavbar from './Component/Navbar';
import { store } from './app/store';
import {Provider, useSelector} from "react-redux"
import Profile from './pages/Profile';
import Message from './pages/Message';
import Meetings from './pages/Meetings';
import JoinRoom from './pages/JoinRoom';
import Navbar from './Component/Navbar';
// import {setErrorHandle,resetErrorHandle} from "./feature/users/ErroHandle" 




function App() {
  

const userID = localStorage.getItem("userId")

  return (
    <>
    <Provider store = {store}>
    <Toaster/>
    
    
        
  
    <BrowserRouter>
  
<Navbar/>
   <Routes>
     <Route path='/' element={<Home/>}></Route>
     <Route path='/signup' element={<Singup/>}> </Route>
     <Route path='/login'  element={<Login/>}></Route>
     <Route path='/user/:id' element={<UserProfile/>}></Route>
     <Route path='/user/profile/:id' element={<Profile/>}></Route>
     <Route path='/user/conversation' element={<Message/>}></Route>
     <Route path='/user/conversation/:id' element={<Message/>}></Route>
     <Route path='/user/meetings/:id' element={<Meetings/>}></Route>
     <Route path='/user/meetings/join-room/:roomid/:user' element={<JoinRoom/>}></Route>


     
    </Routes>


   </BrowserRouter>
    </Provider>
     
    </>
  )
}

export default App

