import React, { useEffect, useState } from 'react'
import logo from "../assets/logo.png"
import '../App.css'
import { Link, useNavigate } from 'react-router-dom'
import { IoEllipseSharp, IoSearch } from "react-icons/io5";
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentUser, resetCurrentUSer } from '../feature/users/CurrentUser';
import toast from 'react-hot-toast';
import Avatar from './Avatar';
import { BsChatTextFill } from 'react-icons/bs';
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { setUsers } from '../feature/users/userSlice';
import { debounce } from '../Helper/debounce';

const Navbar = () => {
  const dispatch = useDispatch();
  const [isloggedIn, setIsLoggedin] = useState(false);
  const currentUser = useSelector((state) => state.currentUser);
  const currUserId = localStorage.getItem("userId");
  console.log("curreid ", currUserId)
  const [inpVal, setInpVal] = useState("");
  const URL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const getUsersDetails = async (currUserId) => {
    console.log("this is navbar function calller");
    if (!currUserId) {
      toast.error("you are not login please login");
      return;
    }
    try {

      console.log("this is first time");
      const userData = await fetch(`${URL}/CareerBridge/user/${currUserId}`, {
        method: "GET",
        credentials: "include",

        headers: {
          "Content-Type": "application/json",
        },

      })
      const result = await userData.json();
      console.log(result);
      if (result.success) {
        dispatch(setCurrentUser(result.data));
        // setCurrentUserNav(result.data);
        setIsLoggedin(true);
      } else {
        toast.error(result.message);
        setIsLoggedin(false);
      }


    } catch (e) {
      console.log(e);
      toast.error(e);

    }

  }

  useEffect(() => {
    if (currUserId) {
      getUsersDetails(currUserId);

    } else {
      console.log("callin useEfect wihou id");
    }

  }, [currUserId]);


  const handleLogout = async () => {
    try {
      const response = await fetch(`${URL}/CareerBridge/user/logout`, {
        method: "get",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      })

      const result = await response.json();
      if (result.success) {
        console.log(result, "this is logout data");
        localStorage.removeItem("userId");
        toast.success("logout");
        dispatch(resetCurrentUSer(
          {
            id: "",
            username1: "",
            email: "",
            education: "",
            charge: null,
            profilePic: "",
            profession: "",
            converSations: [],
            meetings: [],
            available: [],
            socketConnection: null
          }
        ))
        setIsLoggedin(false);
        navigate("/login")

      } else {
        toast.error(result.message || "unexpected error");
        navigate("/")
      }
    } catch (e) {
      toast.error(e.message || "unexpected error");
      navigate("/")
    }
  }


  const handleInputChangeForSearch = debounce(async (inpVal) => {
    try {
      const response = await fetch(`${URL}/CareerBridge/user/searchUser`, {
        method: "post",
        credentials: "include",
        mode: "cors",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ inpVal: inpVal })
      });


      const result = await response.json();
      console.log(result);

      if (result.success) {
        dispatch(setUsers(result.data));
      }
    }
    catch (e) {
      toast.error(e.message || "unexpected error");
    }
  })

  useEffect(() => {
    if (inpVal.trim() !== "") {
      handleInputChangeForSearch(inpVal)
    }
  }, [inpVal])

  return (

    <nav className="navbar navbar-expand-sm  text-white border-bottom sticky-top   ">
      <div className="container-fluid ">
        <Link className="navbar-brand" to="/">
          <img src={logo} alt="brand" height={50} width={50} className="brandImg" />
        </Link>
        <button className="navbar-toggler bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse  " id="navbarNavAltMarkup">

          <div className="mx-2">

            <Link className="text-white text-decoration-none fw-bold " to="/about">About</Link>

          </div>

          <div className=" d-none d-md-block ">

            <Link className="text-white text-decoration-none fw-bold" to="/">Explore</Link>

          </div>

          <div className="search-form ms-auto ">
            <form className="form" >
              <input className="  search-inp "
                type="search" placeholder="Search By Name Or Profession"
                aria-label="Search" name="query"
                onChange={(e) => setInpVal(e.target.value)} />

            </form>
          </div>
          {isloggedIn ?
            <div className=" ms-auto link-container">
              <div className='  '>
                <p className=" text-decoration-none m-2 text-white fw-normal cursor-pointer " onClick={handleLogout}>Logout</p>
              </div >
              <Link to={`/user/converSation`} className='text-white fw-normal' ><BsChatTextFill size={24} title='chats' /></Link>



              <Link to={`/user/profile/${currUserId}`} className='d-flex justify-content-start avt text-decoration-none '>
                <Avatar username={currentUser?.username} height={30} width={30} profilePic={currentUser?.profilePic} />
              </Link>
            </div> :

            <div className=" primary ms-auto ">
              <Link className=" text-decoration-none m-2 text-white" to="/signUp"><b>Signup</b></Link>
              <Link className=" text-decoration-none m-2 text-white" to="/login"><b>Login</b></Link>

            </div>}
        </div>
      </div>

    </nav>


  )
}

export default Navbar
