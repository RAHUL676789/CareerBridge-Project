import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Avatar from "../Component/Avatar"
import { MdOutlineWatchLater } from "react-icons/md";
import { SiGooglemeet } from "react-icons/si";
import { FcEngineering } from "react-icons/fc";
import toast from 'react-hot-toast';
import { IoSchool } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from 'react-redux';
import uploadFile from '../Helper/uploadfile';
import Loader from "../Component/Loader"
import { FaRupeeSign } from "react-icons/fa";
import Available from '../Component/Available';
import { setUserMeetings } from '../feature/users/CurrentUser';





const Profile = () => {
    const URL = import.meta.env.VITE_BACKEND_URL;
    const socketConnectionn = useSelector((state) => state.currentUser.socketConnection);
    const id = localStorage.getItem("userId");
    const param = useParams();
    const dispatch = useDispatch();
    console.log(param);
    const [profileUser, setProfileUSer] = useState([]);
    const [isloading, setIsloading] = useState(false);
    const [fileName, setFileName] = useState("");
    const [editUserDetail, setEditUserDetail] = useState(false);
    const currUser = useSelector((state)=>state.currentUser);
    const [available,setAvailable] = useState([])
    const socketconnection = useSelector((state)=>state.currentUser.socketconnection);
    const navigate = useNavigate();

    useEffect(() => {
        if (socketconnection) {
          const handleMeetingRequest = (data) => {
            console.log(data);
            if (data.success) {
              toast.success(data.message);
              dispatch(setUserMeetings(data.data));
            }
          };
    
          const handleAcceptAlert = (data) => {
           
            if (data) {
              
              toast.success(data.message);
            }
          };
    
          const handleMeetingAlert = (data)=>{
                if(data){
                  toast.success(data.message)
                  
                }
          }
          socketconnection.on("meeting-request-receiving", handleMeetingRequest);
          socketconnection.on("accept-alert", handleAcceptAlert);
          socketconnection.on("meeting-alert",handleMeetingAlert)
    
          return () => {
            socketconnection.off("meeting-request-receiving", handleMeetingRequest);
            socketconnection.off("accept-alert", handleAcceptAlert);
            socketconnection.off("meeting-alert",)
          };
        }
      }, [socketconnection, dispatch]);

    const [formData, setFormData] = useState({
        username: profileUser?.username,
        profilePic: profileUser?.profilePic
    })

    const handlinputChange = (e) => {
        setFormData((prev) => {
            return {
                ...prev,
                [e.target.name]: e.target.value
            }
        })
    }

    const handleProfileUpdate = async (e) => {

        setIsloading(true);
        const file = e.target.files[0]
        console.log(file);
        setFileName(file.name);
        const profileData = await uploadFile(file);
        setFormData((prev) => {
            return {
                ...prev,
                profilePic: profileData
            }
        })
        if (profileData) {
            setIsloading(false);
        }else{
            setIsloading(false);
        }
    }


    const handleSubmit = async (e) => {
        setIsloading(true);
        e.preventDefault();
        e.stopPropagation();
        try {

            const userData = await fetch(`${URL}/CareerBridge/user/${id}`, {
                method: "patch",
                 credentials: "include",
                 mode: "cors",
                 headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData)
            });
            const result = await userData.json();
            console.log("updation of profile", result);
            if (result.success) {
                toast.success(result.message)
                setProfileUSer(result.data);
                setIsloading(false);
                setEditUserDetail(false);
                setIsEdit(false);
            }else{
                toast.error(result.message);
                setIsloading(false);
            }
        } catch (e) {
                 toast.error(e.message || "unexpected error");
                 setIsloading(false);
        }

    }

    const handleCancleEvent = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setFormData((prev) => {
            return {
                username: profileUser?.username,
                profilePic: profileUser?.profilePic,
                charge: profileUser.charge,
                education: profileUser.education

            }
        })
        setIsEdit(false);
    }

    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthOfYear = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"];

    const CurrentDate = new Date();

    const [currentMonth, setCurrentMonth] = useState(CurrentDate.getMonth());
    const [currentYear, setCurrentYear] = useState(CurrentDate.getFullYear());

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const [isEdit, setIsEdit] = useState(false);
    const [openPopUp, setOpenPopUp] = useState(false);

    const getUsersDetails = async (id) => {
        try {
            const userData = await fetch(`${URL}/CareerBridge/user/${id}`,{
                method:"GET",
                mode: "cors",
                 credentials: "include",
                 headers: {
                    "Content-Type": "application/json",
                },
            });
            const result = await userData.json();
          
            setProfileUSer(result.data);
           
            setAvailable((prev)=>{
                return [...result.data.available]
            })
           

        } catch (e) {
            console.log(e);
        }

    }
    console.log("pofileuser", profileUser)
    useEffect(() => {
        getUsersDetails(id);
    }, [currUser]);

    const handleEditOpent = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setEditUserDetail(true);
    }
    const handleEditClose = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setEditUserDetail(false);
    }

    const currUserUpdation = (updateCurrentUser)=>{
        console.log("updation is called");
        setAvailable((prev)=>{
            return [...updateCurrentUser]
        });
    }

    const [selectedDate,setSelectedDate] = useState(CurrentDate);
    const handleClicked = (day) => {
        const clickDate = new Date(currentYear, currentMonth, day);
      

        let utcDate = new Date(Date.UTC(
            clickDate.getFullYear(),
            clickDate.getMonth(),
            clickDate.getDate(),
            clickDate.getHours(),
            clickDate.getMinutes(),
            clickDate.getSeconds()
        ));
        const today = new Date();

        if (clickDate >= today || isSameDay(clickDate, today)) {
            setSelectedDate(utcDate);
            setOpenPopUp(true);
            
        }
    }

    const isSameDay = (date1, date2) => {
        return date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
    }

    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
  

    const handleAvailSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();
         
        const startArray= startTime.split(":");
        const curredate = new Date();
        const currenttimeinhours = curredate.getHours();

    

        if( currenttimeinhours > startArray[0]  ){
            toast.error("time should be valid for availablity")
            return;
        }

        console.log("stat", startTime, "end", endTime);
        const start = new Date(`1970-01-01T${startTime}:00`);
        const end = new Date(`1970-01-01T${endTime}:00`);
    

        const differenceInMs = end - start;

        // Convert the difference to minutes
        const differenceInMinutes = differenceInMs / (1000 * 60);

        if (differenceInMinutes < 30 || !startTime || !endTime) {
             toast.error("availablity must be greather than 30 minutes")
             return;
        } else {
            const response = await fetch(`${URL}/CareerBridge/user/available/${id}`, {
                method: "post",
                 credentials: "include",
                 mode: "cors",
                 headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    day:selectedDate,
                    start: startTime,
                    end: endTime
                })
            })

            const result = await response.json();
            console.log(result);

             
            
          
            if(result.success){
                setAvailable((prev)=>{
                    return [...result.data.available]
                })
                setOpenPopUp(false);
                toast.success("availablity set successfully")
            }else{
                toast.error(result.message);
            }
            
            return 
        }
    }



    const handleIsloading = ()=>{
        setIsloading(false);
    }

  

    return (
        <div className="container-fluid mx-0 px-0 py-2">
      
     


            <div className='row gap-2 px-2 mt-2 profileData  '>
                <div className='col-md-4 border rounded bg-light '>
                    <div className='profileDetails  '>
                        <div className='profilePicture px-1'>
                            <Avatar
                                height={60}
                                width={60}
                                username={profileUser.username}
                                profilePic={profileUser.profilePic}
                                email={profileUser.email}
                            />
                        </div>
                        <div className="userEmails text-center">
                            <span className='mt-2 '>{profileUser.username && profileUser.username}</span>
                            <span className='mb-2 '>{profileUser.email && profileUser.email}</span>
                        </div>
                        <div className='editoption' onClick={(e) => setIsEdit(true)}>
                            <p><FaEdit size={20} /></p>
                        </div>
                        {isEdit &&
                            <div className='UserEditDetail rounded'>
                                <form className='useEditForm bg-dark p-2 rounded' onSubmit={handleSubmit}>
                                    <div className='cross px-2' onClick={() => setIsEdit(false)}>
                                        <RxCross2 />
                                    </div>
                                    <div className='inptext '>
                                        <label htmlFor="username" className='primary mx-0'>Edit-Username</label>
                                        <input type="text" id='username'
                                            value={formData.username}
                                            placeholder='Enter New UserName'
                                            className='p-2'
                                            name='username'
                                            onChange={handlinputChange}

                                        />
                                    </div>
                                    <div className='inp-file border text-white d-flex justify-content-center align-items-center rounded '>
                                        <label htmlFor="picture" className='rounded' >{fileName ? fileName : "Upload A Profile Picture"}</label>
                                        {isloading && <Loader handleIsloading={handleIsloading} />}
                                        <input type="file" id='picture' onChange={handleProfileUpdate} />
                                    </div>

                                    <div className='d-flex justify-content-center align-items-center'>
                                        <button className='btn btn-danger m-2' type='button' onClick={handleCancleEvent}>Cancel</button>
                                        <button className='btn btn-success' type='submit'>Save</button>
                                    </div>
                                </form>

                            </div>

                        }

                    </div>

                    <div className='d-flex align-items-center justify-center mt-2'>
                        <p ><FcEngineering size={25} /></p>
                        <p className='primary fs-4'>{profileUser?.profession}</p>
                    </div>
                    <div className='d-flex justify-content-end primary '>
                        <p onClick={handleEditOpent}> Edit-Details</p>
                    </div>

                    {
                        editUserDetail &&
                        <div className='detailEditForm rounded bg-dark'>
                            <form onSubmit={handleSubmit}>
                                <div className='detail p-1'>
                                    <label htmlFor="Charges" className='primary mx-0'>Charge</label>
                                    <input type="number"
                                        id='Charges'
                                        placeholder='Edit Your Charges'
                                        className='p-1 '
                                        name='charge'
                                        onChange={handlinputChange}
                                        value={formData.charge}
                                    />
                                </div>
                                <div className='detail p-1'>
                                    <label htmlFor="Education" className='primary mx-0'>Education</label>
                                    <input type="text"
                                        id='Education'
                                        placeholder='Edit Your Education'
                                        className='p-1 '
                                        name='education'
                                        onChange={handlinputChange}
                                        value={formData.education}
                                    />
                                </div>
                                <div className='d-flex justify-content-center mb-3'>
                                    <button className=' btn btn-danger primary mx-2' type='button' onClick={handleEditClose}>Cancel</button>
                                    <button className='btn btn-success' type='submit'> Save</button>
                                </div>

                                {isloading && <Loader handleIsloading={handleIsloading}/>}

                            </form>
                        </div>
                    }

                    <div className='mt-2 mb-2'>
                        <h5 className='font-weight-bold'>Charges</h5>
                        <FaRupeeSign className='primary mx-0' size={22} /> <span>{profileUser.charge}/min</span>
                    </div>
                    <div className='profile-education '>
                        <h5>Education</h5>
                        <p ><IoSchool size={25} className=' mx-0 primary' /> &nbsp; {profileUser.education}</p>
                    </div>
                    <div className='profile-info  '>
                        <Link to={`/user/meetings/${id}`} className='cursor-pointer text-decoration-none text-black '>
                        <SiGooglemeet size={22} className=' mx-0 mb-2 primary ' /> &nbsp; Zoom Meetings</Link>
                        <p className='cursor-pointer'>  <MdOutlineWatchLater size={25} className=' mx-0 primary' /> &nbsp; 30 minutes</p>

                    </div>
                </div>

                <div className=' row col-md-8 gap-2 '>

                    <div className='availability-check col-md-6 '>
                        <div className='text-center'>
                            <h2 className='bg-light col-md-12 m-2 p-2 font-weight-bold'>Set Your Availability</h2>
                        </div>
                        <div className='weekdays'>
                            {daysOfWeek.map((day, idx) => (
                                <span >{day}</span>
                            ))}
                        </div>
                        <div className="days">
                            {[...Array(firstDayOfMonth).keys()].map((_, index) => <span key={`empty${index}`} />)}

                            {[...Array(daysInMonth).keys()].map((day) => <span key={day + 1}
                                className={day + 1 === CurrentDate.getDate() && currentMonth === CurrentDate.getMonth()
                                    && currentYear === CurrentDate.getFullYear() ? "current-date" : null

                                } onClick={() => handleClicked(day + 1)} >
                                {day + 1}</span>)}

                            {openPopUp && <div className='detailEditForm rounded bg-dark  available'>
                                <form className='' onSubmit={handleAvailSubmit}>
                                    <div className='detail p-1'>
                                        <label htmlFor="startTime" className='primary mx-0'>Starting-Time</label>
                                        <input type="time"
                                            name='start'
                                            onChange={(e) => setStartTime(e.target.value)}
                                            value={startTime}

                                        />
                                    </div>
                                    <div className='detail p-1'>
                                        <label htmlFor="Ending-Time" className='primary mx-0'>Ending-Time</label>
                                        <input type="time"
                                            name='end'

                                            onChange={(e) => setEndTime(e.target.value)}
                                            value={endTime}

                                        />
                                    </div>

                                    <div className='d-flex justify-content-center mb-3'>
                                        <button className=' btn btn-danger primary mx-2' type='button' onClick={() => setOpenPopUp(false)}>Cancel</button>
                                        <button className='btn btn-success' type='submit'> Save</button>
                                    </div>
                                </form>
                            </div>}


                        </div>


                    </div>
                        
                        <div className='col-md-5 '>
                               {/* show herea availablity */}
                              <div className='text-center'>
                                <h2 className='bg-light col-md-12 m-2 p-2 font-weight-bold'>Your Availablity</h2>
                               
                                   
                                       <div>
                                         <Available availableArray={available} user={true} currUserUpdation={getUsersDetails}/>
                                        
                                       </div>
                                
                                </div>
                        </div>
                
                </div>
                

            </div>
        </div>

    )
}

export default Profile
