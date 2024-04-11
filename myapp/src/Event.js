import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import {Popup} from 'reactjs-popup'
import {Link} from 'react-router-dom'

import './Event_css.css'

const Event = () => {
    const [userId, setuserId] = useState('')
    const {currentUser} = useAuth()

    const [events, setEvents] = useState([])
    const [refreshData, setRefreshData] = useState(false)
    const [selectedEvent, setSelectEvent] = useState('')
    const [eventOptions, setEventOptions] = useState(false)

    const navigate = useNavigate()

    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [noEvent, setNoEvent] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        async function fetchUserData(){
            // fetches current user data, and stores the data (id) into useState, to be used throughout the page.
            try{
                setError('')
                // fetches the user data with firebase ID
                const firebaseUID = currentUser.uid;
    
                const response = await fetch(`https://meetmycar.onrender.com/users?userfb=${encodeURIComponent(firebaseUID)}`, {
                    method: 'GET',
                    headers: {
                        'accept': 'application/json',
                    },
                });
    
                if (response.ok){
                    const data = await response.json()
    
                    // updates user's data states
                    setuserId(data.userData._id)
    
                    console.log("Fetched User Details")
                    return data
                } else{
                    const errorData = await response.json()
                    setError("Failed To Fetch User Data")
                    throw new Error(errorData.message)
                }
            }catch (error){
                console.error("Error Fetching User Data:", error)
                setError("Failed To Fetch User Data")
            }
        }
        fetchUserData();
    }, [currentUser.uid]);

    useEffect(() => {
        async function fetchEventData(){
            // fetches all event data, and stores the data into useState
            try{
                setError('')
                setMessage('')
                const response = await fetch(`http://localhost:3001/events`, {
                    method: 'GET',
                    headers: {
                        'accept': 'application/json',
                    },
                });

                if (response.ok){
                    const data = await response.json()

                    setEvents(data.eventData)
                    console.log("Fetched Event Details", data.eventData)

                    // shows message, if no post found
                    if(!data.eventData || data.eventData.length === 0){
                        setNoEvent("No events? Seems like no one is partying. Be the first to make fun!")
                    } 

                } else{
                    const errorData = await response.json()
                    throw new Error(errorData.message)
                }

            } catch (error){
                console.error("Error Fetching Event Data:", error)
                setError("Error Fetching Event. Try Again Later")
            }
        }
        fetchEventData();
    }, [refreshData]);

    // handle like event
    async function handleLike(eventId) {
        try{
            setError('')
            setLoading(true)

            // add like to event database
            const response = await fetch(`http://localhost:3001/events/edit?eventId=${encodeURIComponent(eventId)}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({addUserIdLike: userId})
            });

            if (!response.ok){
                console.error("Error Updating Like Event:")
            }

            // renders the like
            setRefreshData(!refreshData)
            console.log("Updated Like Event")
        }catch (error){
            console.error("Error Updating Like Event:")
            setError("Error Updating Like For Event. Try Again Later")
        }
        setLoading(false)
    }

    // handle unlike event
    async function handleUnLike(eventId) {
        try{
            setError('')
            setLoading(true)

            // remove like from event database
            const response = await fetch(`http://localhost:3001/events/edit?eventId=${encodeURIComponent(eventId)}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({removeUserIdLike: userId})
            });

            if (!response.ok){
                console.error("Error Updating Like Event:")
            }

            //renders the unlike
            setRefreshData(!refreshData)
            console.log("Updated Like Event")
        }catch (error){
            console.error("Error Updating Like Event:")
            setError("Error Updating Like For Event. Try Again Later")
        }
        setLoading(false)
    }

     // handle attendee event
     async function handleAttend(eventId) {
        try{
            setError('')
            setLoading(true)

            // add attendee to event database
            const response = await fetch(`http://localhost:3001/events/edit?eventId=${encodeURIComponent(eventId)}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({addUserIdAttend: userId})
            });

            if (!response.ok){
                console.error("Error Updating Attendee Event:")
            }

            // renders the attendee
            setRefreshData(!refreshData)
            console.log("Updated Attendee Event")
        }catch (error){
            console.error("Error Updating Attendee Event:")
            setError("Error Updating Attendee For Event. Try Again Later")
        }
        setLoading(false)
    }

    // handle unattendee event
    async function handleUnAttend(eventId) {
        try{
            setError('')
            setLoading(true)

            // remove like from event database
            const response = await fetch(`http://localhost:3001/events/edit?eventId=${encodeURIComponent(eventId)}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({removeUserIdAttend: userId})
            });

            if (!response.ok){
                console.error("Error Updating Attendee Event:")
            }

            //renders the unlike
            setRefreshData(!refreshData)
            console.log("Updated Attendee Event")
        }catch (error){
            console.error("Error Updating Attendee Event:")
            setError("Error Updating Attendee For Event. Try Again Later")
        }
        setLoading(false)
    }

    // handles select event to show options
    const handleShowOptions = (eventId) =>{
        setSelectEvent(eventId)
        setEventOptions(!eventOptions)
    }

    // handles select event to show options
    const handleEventEdit = (eventId) =>{
        navigate(`/editevent/${eventId}`)
        setEventOptions(false)
    }

     // handle event delete
     async function handleEventDelete(eventId) {
        try{
            setError('')
            setMessage('')
            setLoading(true)

            // delete event in Event database
            const response = await fetch(`http://localhost:3001/events/delete?eventId=${encodeURIComponent(eventId)}`, {
                method: 'DELETE',
            });

            if (!response.ok){
                console.error("Error Deleting Event:")
            }
            const firebaseUID = currentUser.uid;

            // removes superfuel points for user
            const userSFResponse = await fetch(`http://localhost:3001/users/update?userfb=${encodeURIComponent(firebaseUID)}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({removeSuperFuel: -1})
            });

            if (!userSFResponse.ok){
                console.error("Error Updating User's SuperFuel:")
            }
            
            // refresh page, to show updated event collection
            console.log("Deleted Event")
            setTimeout(() => {
                window.location.reload(false);
            }, 2000)

        }catch (error){
            console.error("Error Deleting Event:")
            setError("Error Deleting Event. Try Again Later")
        }
        setLoading(false)
    }

    // format the date to get num
    const formatDNum = (date) => {
        const dateFormat = new Date(date)
        return dateFormat.getDate()
    }

    // format the date into day
    const formatDay = (date) => {
        const dateFormat = new Date(date)
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        return days[dateFormat.getDay()]
    }

    // format the time into hh:mm
    const formatTime = (date) => {
        const dateFormat = new Date(date)
        return dateFormat.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

  return (
      <>
        <div className='showEvent'>
    
            <header>
                <h1 id="login_text">
                    Event
                    <p id="slogan_text">Book And Explore</p>
                </h1>
                
                <div className='showUserData'>
                    <Link to={`/addevent`} className="btn btn-dark" id='checkbtn'> Create Event</Link>
                </div>
            </header>

            <p className="w-100 text-center mt-2 mb-0" id="error_Msg">{noEvent}</p>
            <p className="w-100 text-center mt-2 mb-0" id="success_Msg">{message}</p>
            <p className="w-100 text-center mt-2 mb-0" id="error_Msg">{error}</p>

            {events.map((event, index) => (
                <div key={index}  className='eventList'>
                    <div className='events'>
                        <div className='eventDate'>
                            <h3 className='eventDay'>{formatDay(event.date)} <span>{formatDNum(event.date)}</span></h3>
                            <h4 className='eventTime'>{formatTime(event.date)}</h4>
                        </div>

                        <div className='vline'/>

                        <div className='eventOrganise'>
                            {event.user?.profilePicture && (
                                <img className='eventUserImage'
                                    src={event.user.profilePicture} 
                                    alt="Profile"
                                />
                            )}
                            <Link to={`/profile/${event.user._id}`} className='eventUserName'>{event.user?.username}</Link>
                        </div>

                        <div className='eventInfo'>
                            <h3 className='eventLoc'>{event.location}</h3>
                            <h3 className='eventName'>{event.title}</h3>
                            <p className='eventDesc'>{event.description}</p>
                        </div>
                        
                        <div className='eventEngage'>
                            <div className='eventLike'>
                                {event.likes.some((likedUser) => likedUser.userId === userId) ? (
                                        <>
                                            <button className='unlikebtn' disabled={loading} onClick={() => handleUnLike(event._id)}><svg xmlns="http://www.w3.org/2000/svg" width="1.7em" height="1.7em" viewBox="0 0 26 26"><path d="M17.869 3.889c-2.096 0-3.887 1.494-4.871 2.524c-.984-1.03-2.771-2.524-4.866-2.524C4.521 3.889 2 6.406 2 10.009c0 3.97 3.131 6.536 6.16 9.018c1.43 1.173 2.91 2.385 4.045 3.729c.191.225.471.355.765.355h.058c.295 0 .574-.131.764-.355c1.137-1.344 2.616-2.557 4.047-3.729C20.867 16.546 24 13.98 24 10.009c0-3.603-2.521-6.12-6.131-6.12"/></svg></button>
                                        </>
                                    ) : (
                                        <>
                                            <button className='likebtn' disabled={loading} onClick={() => handleLike(event._id)}><svg xmlns="http://www.w3.org/2000/svg" width="1.7em" height="1.7em" viewBox="0 0 26 26"><path d="M17.869 3.889c-2.096 0-3.887 1.494-4.871 2.524c-.984-1.03-2.771-2.524-4.866-2.524C4.521 3.889 2 6.406 2 10.009c0 3.97 3.131 6.536 6.16 9.018c1.43 1.173 2.91 2.385 4.045 3.729c.191.225.471.355.765.355h.058c.295 0 .574-.131.764-.355c1.137-1.344 2.616-2.557 4.047-3.729C20.867 16.546 24 13.98 24 10.009c0-3.603-2.521-6.12-6.131-6.12"/></svg></button>
                                        </>
                                )}
                                <h3>{event.likes.length} LIKE</h3>
                            </div>

                            <div className='eventJoin'>
                                {event.attendees.some((attendUser) => attendUser.userId === userId) ? (
                                        <>
                                            <button className='unjoinbtn' disabled={loading} onClick={() => handleUnAttend(event._id)}><svg xmlns="http://www.w3.org/2000/svg" width="1.7em" height="1.7em" viewBox="0 0 21 21"><g fill="none" fill-rule="evenodd" stroke="red" stroke-linecap="round" stroke-linejoin="round" transform="translate(2 2)"><circle cx="8.5" cy="8.5" r="8"/><path d="m5.5 5.5l6 6m0-6l-6 6"/></g></svg></button>
                                        </>
                                    ) : (
                                        <>
                                            <button className='joinbtn' disabled={loading} onClick={() => handleAttend(event._id)}><svg xmlns="http://www.w3.org/2000/svg" width="1.7em" height="1.7em" viewBox="0 0 24 24"><path fill="green" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10s10-4.5 10-10S17.5 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4l8-8z"/></svg></button>
                                        </>
                                )}
                                <h3>{event.attendees.length} USER</h3>
                            </div>
                        </div>
                        
                        {event.user._id === userId ? (
                            <>
                                <div className='eventEdit'>
                                    <button className='postMenu' onClick={() => handleShowOptions(event._id)}>
                                        <div className='eventdot'></div>
                                        <div className='eventdot'></div>
                                        <div className='eventdot'></div>
                                    </button>
                                </div>
                            </>
                        ) : 
                            <>
                            </>
                        }
                        
                    </div>
                </div>
            ))}

            <Popup open={eventOptions} closeOnDocumentClick className='Popup'>
                <div className='UpdateModal'>
                    <>
                        <p className='deleteheading'>Choose Event Option</p>
                        <div className='deletelst'>
                            <div className='deletebtn'>
                                <button disabled={loading} className="btn btn-dark w-100" variant="edit" onClick={() => handleEventEdit(selectedEvent)}>Edit</button>
                                <button disabled={loading} className="btn btn-danger w-100" variant="danger" onClick={() => handleEventDelete(selectedEvent)}>Delete</button>
                            </div>
                            <p id='deletemsg'>Delete action is irreversible.</p>      
                        </div>
                    </>
                </div>
            </Popup>
        </div>
      </>
  )
}

export default Event