import React from 'react'
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import { IoCalendarClear } from "react-icons/io5";
import Avatar from "./Avatar"
import { Link } from 'react-router-dom';
const MeetingCard = (
    {meetingDetail,
    meeting,currUser,
    handleCancelMeetingRequest,
    handleAceeptMeetingRequest,
    handleStartMeeting,
    formatDate,
    handleJoinMeeting,
    hanleDeleteMeeting
}


)=>
    
    
    {
        function isTimeBetween(givenTimeStr, endHour) {
            // Current date and time
            const currentTime = new Date();
            
            // Extract the current hour and minutes
            const currentHour = currentTime.getHours();
            const currentMinute = currentTime.getMinutes();
          
            // Extract hours and minutes from the given time string (e.g., '21:57')
            const [givenHour, givenMinute] = givenTimeStr.split(':').map(num => parseInt(num, 10));
            const [endhours, endminutes] = endHour.split(':').map(num => parseInt(num, 10));
          
            // Convert current time and given time into minutes for easier comparison
            const currentTimeInMinutes = currentHour * 60 + currentMinute;
            const givenTimeInMinutes = givenHour * 60 + givenMinute;
            const endHourInMinutes = endHour * 60; // endHour (e.g., 22) converted to minutes
          
            // Check if given time is between current time and the end hour
            if (currentHour < givenHour || currentHour > endhours  ) {
              return false;
            }
          
            return true;
          }

        
  return (
    <div className='MeetingCard'>
                        <div className='meeting-box'>
                            <div className=' meeting-profile '>

                                <p className='meeting-time '><MdOutlineAccessTimeFilled size={20} className='m-1 text-success' /> {meeting.startTime} to {meeting.endingTime}</p>
                                <p className='meeting-date'><IoCalendarClear size={20} className='m-1 text-warning'/>{formatDate(meeting.day)}</p>

                                <Link className='meeting-user text-decoration-none'>
                                    <Avatar username={meetingDetail?.trackRequest == true || meetingDetail.ConfirmMeeting == true ? meeting.host.username : meeting.participant.username} height={65} width={65} profilePic={meetingDetail?.trackRequest == true || meetingDetail.ConfirmMeeting == true ? meeting.host.profilePic : meeting.participant.profilePic} />

                                    <span className=' text-white'>{meetingDetail?.trackRequest == true || meetingDetail?.ConfirmMeeting == true ? meeting.host.profession : meeting.participant.profession}</span>
                                    <p className=' text-white'>{meetingDetail?.trackRequest == true || meetingDetail?.ConfirmMeeting == true ? meeting.host.profession : meeting.participant.profession}</p>


                                </Link>


                            </div>
                        </div>
                        <div className="meeting-status">


                            {meeting.status !== "Cancel" && <h5 className={`${meeting.status == "Confirm" ? "text-success" : "text-warning"}`}>{meeting.status}</h5>}
                            {meeting.status === "Cancel" && <h5 className='text-danger'> {meeting.status}</h5>}

                        </div>
                        <div className='Meeting-btn   '>
                            <div className=''>
                                {meeting.status == "request"  && currUser._id == meeting.host._id? <div> <button className=" btn btn-success1 mx-2  " onClick={() => handleAceeptMeetingRequest(meeting._id, meeting.host._id, meeting.participant._id)}>Accept</button>
                                    <button className=" btn-danger1 " onClick={() => handleCancelMeetingRequest(meeting._id, meeting.host._id, meeting.participant._id)}>Cancel</button> </div> : null}


                                {(currUser._id == meeting.host._id && meeting.status == "Confirm") && (isTimeBetween(meeting.startTime,meeting.endingTime)) &&<div className=''>
                                    <button className=' btn-primary1' onClick={() => handleStartMeeting(meeting._id, meeting.host._id, meeting.startTime, meeting.endingTime)} >start-Meeting</button>
                                </div>}

                                {
                                    (currUser._id == meeting.participant._id && meeting.status == "Confirm" && (isTimeBetween(meeting.startTime,meeting.endingTime))) && <button className='btn btn-primary1 text-decoration-none' onClick={() => handleJoinMeeting(meeting.participant._id, meeting._id)}>
                                        Join-Meeting
                                    </button>

                                }

                            </div>

                            {meeting.status !== "Cancel" ? <Link to={`/user/conversation/${meeting.participant._id}`} className='text-decoration-none '>
                                <p title='message' className='primary   btn-primary1'>Message</p>
                            </Link> : <button className=' btn-danger1' onClick={() => hanleDeleteMeeting(meeting._id, meeting.host._id)}> Delete</button>}
                        </div>
                    </div>
  )
}

export default MeetingCard
