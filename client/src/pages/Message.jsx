import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import Avatar from '../Component/Avatar';
import '../message.css'
import logo from "../assets/logo.png"
import wallpaper from "../assets/wallapaper.jpeg"
import { BsThreeDotsVertical } from "react-icons/bs";
import Sidebar from '../Component/Sidebar';
import { RxCross1 } from "react-icons/rx";
import { debounce } from '../Helper/debounce';
import { useSocketConnect } from '../Helper/socketConncetion';
import toast from 'react-hot-toast';
import { IoSend } from "react-icons/io5";
import { MdAttachFile } from "react-icons/md";
import { IoMdPhotos } from "react-icons/io";
import { FaVideo } from "react-icons/fa";
import uploadFile from '../Helper/uploadfile';
import Loader from '../Component/Loader';
import Navbar from '../Component/Navbar';
import { setUserMeetings } from '../feature/users/CurrentUser';


const Message = () => {
  const socketConnectionn = useSelector((state) => state.currentUser.socketConnection);
  const currentUser = useSelector((state) => state.currentUser);
  const { socketConnect } = useSocketConnect();
  const [allUser, setAllUser] = useState([]);
  const navigate = useNavigate();
  const URL = import.meta.env.VITE_BACKEND_URL;

  const [messageUser, setMessageUser] = useState({});
  const [allMessages, setAllMessages] = useState([]);
  const [search, setSearch] = useState(false);
  const [inpVal, setInpVal] = useState("");
  const [filevalue, setShowUploadFiles] = useState(false);
  const [showUploadPopUp, setShowUploadPopUp] = useState(false);
  const [loading,setLoading] = useState(false);
  const dispatch = useDispatch();

  const param = useParams();
  const location = useLocation();
 
  const [newMessage, setNewMessage] = useState({
    sender: currentUser.id,
    receiver: param.id,
    text: "",
    imageUrl: "",
    videoUrl: ""
  })


  const currentMessage = useRef();


  // all messages for a particular convesationn

  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollTop = currentMessage.current.scrollHeight;
    }
  }, [allMessages])

  const basePath = location.pathname === "/user/converSation";
  const Url = `${URL}/CareerBridge/user`;



  // handling some effect related to message page rendering

  useEffect(() => {
    try {
      if (socketConnectionn) {
        setLoading(true);
        socketConnectionn.emit("message-page", param.id)
        socketConnectionn.on("messageUser-data", (data) => {
          console.log("this is mesage user data", data);
          setMessageUser((prev) => {
            return { ...data }
          })
        });

        socketConnectionn.on("all-message", (data) => {

          setAllMessages((prev) => {
            return [...data]
          })
        })


      setLoading(false)
    } else {
        socketConnect();
      }
    } catch (e) {

      toast.error(e.message || "unexpected error occured");
    }


  }, [param.id, socketConnectionn]);




  // hanlding media file uploading by users

  const handleFileTouch = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setShowUploadPopUp(true)
  }

  const handleInputChange = debounce(async (inpVal) => {
    const response = await fetch(`${Url}/searchUser`, {
      method: "Post",
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inpVal: inpVal })
    });

    const result = await response.json();

    if (result.success) {
      console.log(result.data, "this is searching data form backend");
      setAllUser((prev) => {
        return [...result.data];
      });
    }
    else {
      toast.error("user not found");
    }
  }, 500);




  // fetching conversation user detail for conversation
  const fetchUserDetail = async () => {
    try {

      const response = await fetch(Url, {
        method: "GET",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();

      setAllUser((prev) => {
        return [...result.data];
      });



    } catch (e) {

      toast.error(e.message || "unexpected error")
    }
  }



  // hadling message sending

  useEffect(() => {
    if (inpVal == "") {
      fetchUserDetail();
    }
  }, []);

  useEffect(() => {
    if (inpVal.trim() !== "") {
      handleInputChange(inpVal)
    }
  }, [inpVal])

  const handleSearchChange = () => {
    setSearch((prev) => !prev);
  }

 

  const uploadFiles = async (e) => {
    try {
      console.log("uploadfile rund ")
      setLoading(true)
      setShowUploadFiles(true);
      let file = e.target.files[0];
      let response = await uploadFile(file);
      console.log(response);
      if (response) {
        console.log("this is upload popu bnd");
        setLoading(false)
       
       
        setNewMessage((prev) => {
          return {
            ...prev,[e.target.name]:response
          }
        })
        // setShowUploadFiles(false)
      }
   



    } catch (e) {
      setLoading(false)
      toast.error("there is something error while uploading file",e);
  
      
    }
  }

  const handleMessageInputChange = (e) => {
    setNewMessage((prev) => {
      return {
        ...prev, [e.target.name]: e.target.value
      }
    })

  }




  // handling sending a new message to user

  const sendNewMessage = () => {
    try {


      if (newMessage.text == "" && newMessage.imageUrl == "" && newMessage.videoUrl == "") {
       
        console.log("inside video avialable if or image avialble if");
        return;

      }
      if (socketConnectionn) {
        console.log("this is print the searhc user", currentUser.id, param.id)
        socketConnectionn.emit("new-message", {
          sender: currentUser.id,
          receiver: param.id,
          text: newMessage.text,
          imageUrl: newMessage.imageUrl,
          videoUrl: newMessage.videoUrl
        });

        socketConnectionn.on("all-message", (data) => {
          
          setAllMessages((prev) => {
            return [...data]
          })


        })

        setNewMessage((prev) => {
          return {
            sender: currentUser.id,
            receiver: param.id,
            text: "",
            imageUrl: "",
            videoUrl: ""

          }
        })

        setShowUploadFiles(false);
      }
    } catch (e) {
      toast.error(e.message || "unexpected error occuured");
    }
  }


  const handleCloseUpload = ()=>{
     setShowUploadFiles(false)
     setNewMessage((prev)=>{
      return {
        ...prev,
        imageUrl:"",
        videoUrl:"",
      }
     })
  }


  useEffect(() => {
    if (socketConnectionn) {
      const handleMeetingRequest = (data) => {
        console.log(data);
        if (data.success) {
          toast.success(data.message);
          dispatch(setUserMeetings(data.data));
        }
      };

      const handleAcceptAlert = (data) => {
        console.log("this is accepting alert for meetign confirmationn");
        if (data) {
         
          toast.success(data.message);
        }
      };

      const handleMeetingAlert = (data)=>{
            if(data){
              toast.success(data.message)
              
            }
      }
      socketConnectionn.on("meeting-request-receiving", handleMeetingRequest);
      socketConnectionn.on("accept-alert", handleAcceptAlert);
      socketConnectionn.on("meeting-alert",handleMeetingAlert)

      return () => {
        socketConnectionn.off("meeting-request-receiving", handleMeetingRequest);
        socketConnectionn.off("accept-alert", handleAcceptAlert);
        socketConnectionn.off("meeting-alert",)
      };
    }
  }, [socketConnectionn, dispatch]);


  return (

    <div className='message-page '>
     
     {loading && <Loader/>}
      {search && <div className='addSearchUser'>
        <div className='cross' onClick={handleSearchChange}>
          <RxCross1 size={30} />
        </div>
        <div className='addConvUser'>
          <div className='inputSearchbox'>
            <input type="text" placeholder='search by name or profession'
              className='w-100 h-100 rounded px-2'
              value={inpVal}
              onChange={(e) => setInpVal(e.target.value)}
            />

          </div>
          <div className='searchUser-container'>
            {allUser?.map((user, i) => (
              <Link to={`/user/converSation/${user._id}`} className='searchUser-Detail m-2 bg-white p-2 rounded text-decoration-none text-black' onClick={handleSearchChange}>
                <div className='search-Avatar '> <Avatar username={user.username} height={50} width={50} /> </div>
                <div className='searchUser-Info '>
                  <h5 className='font-weight-bold'>{user.username}</h5>
                  <p className='small '>{user.profession}</p>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </div>}

      <div className='row message-container p-0 m-0  '>
        {/* sidebar for displaying all the conversations User */}
        <div className={`col-md-4 ${!basePath && "d-none d-md-block"}`}>
          {/* sidebar */}
          <Sidebar changeSearch={handleSearchChange} parmaId={param.id} />
        </div>

        {
          !basePath ?
            <div className='col-md-8 mt-0  p-0 h-100 '>
              {/* alll the message page */}
              <header>
                <div className=' msg-user-detail  bg-white '>
                  <Link to={`/user/profile/${messageUser.id}`} className='d-flex msg-avatar text-decoration-none '>
                    <Avatar username={messageUser?.username} height={55} width={55} profilePic={messageUser?.profilePic} />
                  </Link>
                  <div className=' message-user '>
                    <span className='larger'>
                      {messageUser?.username}
                    </span>
                    <span className='small'>
                      {messageUser.online ? <span className='text-success'> online</span> : <span className='text-dark fw-normal'> offline</span>}
                    </span>
                  </div>

                  <div className='three-dot'>
                    <BsThreeDotsVertical />
                  </div>

                </div>

              </header>
              <div className='main-container'>


                {filevalue && <div className='show-uploaded-files '>
                  <div className='crossmarker' onClick={handleCloseUpload}>
                    <RxCross1 size={25} />
                  </div>

                  <div className="media-container">
                    <div className=''>
                      {loading && <Loader />}
                    </div>

                    {newMessage.imageUrl && <img src={newMessage.imageUrl}
                      alt="uploaded picture" />}

                    {newMessage.videoUrl && <video src={newMessage.videoUrl}
                      controls
                      muted
                    >

                    </video>}
                  </div>

                </div>}
                <div className='all-messages' style={{ backgroundImage: `url(${wallpaper})` }} ref={currentMessage}>
                  {allMessages.map((msg, idx) => (
                    <div className={`${currentUser.id !== msg.sender ? "currentUser-message" : "receiver-message"} px-2 mt-2 py-2 rounded`} key={idx}>
                      {msg.text}

                      {msg.imageUrl && <div>
                        <img src={msg.imageUrl} alt="" className='msgBox mt-1' />
                      </div>}
                      {msg.videoUrl && <div>
                        <video src={msg.videoUrl}
                          controls
                          muted
                          className='videoBox mt-1'
                        ></video>
                      </div>}

                    </div>
                  ))}



                </div>



                <div className=' input-container  d-flex mt-2 '>

                  {showUploadPopUp && <div className="file-container d-flex justify-content-center align-items-center flex-column mx-2 mb-2">
                    <div className='cross-file ms-auto mt-2 mb-0 cursor-pointer' onClick={() => setShowUploadPopUp(false)}>
                      <RxCross1 size={25} />
                    </div>
                    <div className="photo mt-2 cursor-pointer">

                      <input type="file"
                        id='photo'
                        className='d-none'
                        name='imageUrl'
                        onChange={(e) => uploadFiles(e)}

                      />
                      <label htmlFor="photo" className='cursor-pointer'>
                        <IoMdPhotos
                          className='primary m-0'
                          size={25}
                        />
                        <span className='font-weight-bold mx-2'>Image</span>
                      </label>
                    </div>
                    <div className="video mt-2 ">
                      <input type="file"
                        className='d-none' id='video'
                        name='videoUrl'
                        onChange={(e) => uploadFiles(e)}
                      />
                      <label htmlFor='video' className='cursor-pointer'>
                        <FaVideo
                          className='primary m-0'
                          size={25}
                        />
                        <span className='font-weight-bold mx-2 '>video</span>

                      </label>
                    </div>

                  </div>}

                  <div className="file cursor-pointer d-flex justify-content-center align-items-center mt-1 " onClick={() => setShowUploadFiles(true)}>
                    <MdAttachFile size={20} title='file' onClick={(e) => handleFileTouch(e)} />
                  </div>
                  <div className="inp d-flex ">
                    <input type="text "
                      placeholder='message'
                      className='p-3 '
                      name='text'
                      value={newMessage.text}
                      onChange={(e) => handleMessageInputChange(e)} />
                    <IoSend size={30} className='primary cursor-pointer' title='send'
                      onClick={sendNewMessage}

                    />
                  </div>
                </div>
              </div>
            </div> : <div className='col-md-8 d-none d-md-block'>

              <div className='logoContainer' >
                <img
                  src={logo}
                  height={150}
                  width={150}
                  className='rounded-circle  mb-2'
                />
                <p className='font-weight-bold  larger'>Select A User To Start Conversation</p>
              </div>

            </div>

        }



      </div >



    </div>
  )
}

export default Message
