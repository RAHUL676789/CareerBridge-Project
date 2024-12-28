import React, { useEffect, useState } from "react";
import "../public/sidebar.css";
import { FaUsers } from "react-icons/fa";
import { BsChatTextFill } from "react-icons/bs";
import Divider from "./Divider";
import Avatar from "./Avatar";
import { useSelector } from "react-redux";
import SearchUser from "./SearchUser";
import { Link, useNavigate } from "react-router-dom";
import { MdPhoto } from "react-icons/md";
import { FaVideo } from "react-icons/fa6";
import Error from "./Error";
import { FaArrowUpLong } from "react-icons/fa6";
import { CiCirclePlus } from "react-icons/ci";

const Sidebar = ({ changeSearch, parmaId }) => {
 
  const socketConnectionn = useSelector((state) => state.currentUser.socketConnection);
  const currUser = useSelector((state) => state.currentUser);
  const [converSationsUser, setConverSationsUser] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      if (socketConnectionn) {
        console.log("hello");
        socketConnectionn.emit("getConversationUser", currUser.id);
        socketConnectionn.on("allConveSationUsers", (data) => {
          console.log("allConveSationUsers", data);

          const currentConverSationUsers = data.map((conv) => {
            if (conv.sender._id === conv.receiver._id) {
              return {
                ...conv,
                convUserDetail: conv.sender,
              };
            } else if (conv.receiver._id !== currUser.id) {
              return {
                ...conv,
                convUserDetail: conv.receiver,
              };
            } else {
              return {
                ...conv,
                convUserDetail: conv.sender,
              };
            }
          });

          setConverSationsUser(currentConverSationUsers);
        });
      } else {
        console.log("else condition run");
       navigate("/") 
      
      }
    } catch (e) {
      console.log("there is something wrong", e);
    }
  }, [socketConnectionn, currUser]); // Add socketConnect to the dependency array

  return (
    <div className="row bg-white h-100">
      <div className="col-md-2  chat-container h-100 p-0 d-none d-md-block ">
        <div className="chat-options h-25 d-flex flex-column justify-content-center align-items-center">
          <BsChatTextFill size={24} className="primary m-0 my-1 text-white" title="chats" />
          <FaUsers size={24} className="primary m-0 my-1 text-white" onClick={changeSearch} title="add-member" />
        </div>
      </div>
      <div className="col-md-10 p-1 h-100">
        <div className="searchbox mt-1">
          <p className="m-2 d-block d-sm-none"><CiCirclePlus size={24} onClick={changeSearch} title="add-member"/></p>
         <h3 className="fs-5 fw-bold m-2 mx-auto">Messages</h3>
        </div>
        <Divider />
        <div className="conv-container">
          {converSationsUser?.length > 0
            ? converSationsUser.map((conv, idx) => (
                <Link
                  to={`/user/converSation/${conv?.convUserDetail?._id}`}
                  className="conversations-users mt-1 p-1 py-2 text-decoration-none text-black"
                  key={idx}
                >
                  <div className="w-15">
                    <Avatar
                      username={conv?.convUserDetail?.username}
                      height={35}
                      width={35}
                    />
                  </div>

                  <div className="mb-1 mx-1 w-75 px-1 msg-container">
                    <h6 className="fw-bold">{conv?.convUserDetail?.username}</h6>
                    <p className="text-truncate small">
                      {conv?.lastmsg?.text && conv?.lastmsg?.text}
                    </p>
                    <p>{conv?.lastmsg?.imageUrl && <MdPhoto />}</p>
                    <p>{conv?.lastmsg?.videoUrl && <FaVideo />}</p>
                  </div>
                  {conv.unseenmsg > 0 && (
                    <span className="unseenmsg">{conv?.unseenmsg}</span>
                  )}
                </Link>
              ))
            : <div className="NoUser-ConverSation"> 
                  
                  <div className="NoUser-Arrow"> 
                  <FaArrowUpLong size={50}/>

                  </div>
                  <div> 
                    <p>Search User For Start ConverSation</p>
                  </div>
               
              </div>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
