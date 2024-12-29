import { useState, useEffect } from 'react'
import './App.css'
import './profile.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Singup from './pages/Signup';
import Home from './pages/Home';
import UserProfile from './pages/UserProfile';
import Loader from './Component/Loader';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Navbar from './Component/Navbar';
import { store } from './app/store';
import { Provider } from "react-redux"
import Profile from './pages/Profile';
import Message from './pages/Message';
import Meetings from './pages/Meetings';
import JoinRoom from './pages/JoinRoom';

function App() {
  const userID = localStorage.getItem("userId");

  useEffect(() => {
    // Check if the page is being reloaded
    if (sessionStorage.getItem("reloading")) {
      // If page is reloading, clear the reload flag and redirect to root
      sessionStorage.removeItem("reloading");
      window.location.replace('/');  // Redirect to root
    } else {
      // Set the reload flag to true before the page is reloaded
      sessionStorage.setItem("reloading", "true");
    }
  }, []);

  return (
    <>
      <Provider store={store}>
        <Toaster />
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/signup' element={<Singup />} />
            <Route path='/login' element={<Login />} />
            <Route path='/user/:id' element={<UserProfile />} />
            <Route path='/user/profile/:id' element={<Profile />} />
            <Route path='/user/conversation' element={<Message />} />
            <Route path='/user/conversation/:id' element={<Message />} />
            <Route path='/user/meetings/:id' element={<Meetings />} />
            <Route path='/user/meetings/join-room/:roomid/:user' element={<JoinRoom />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
