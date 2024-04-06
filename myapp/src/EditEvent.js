// import hooks
import React, {useState, useEffect, useRef} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from './AuthContext'

import './AddPost_css.css'

const EditEvent = () => {

    const {eventId} = useParams()

    const titleRef = useRef()
    const descRef  = useRef()
    const locRef = useRef()

    const [userId, setuserId] = useState('')
    const [username, setuserName] = useState('')
    const [profilePicture, setprofilePicture] = useState('')

    const [title, setTitle] = useState('')
    const [desc, setDesc] = useState('')
    const [loc, setLoc] = useState('')

    const {currentUser} = useAuth()

    const [date, setDate] = useState('')
    const [time, setTime] = useState('')

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        async function fetchUserData(){
            // fetches current user data, and stores the data (id, name and profilePic) into useState, to be used throughout the page.
            try{
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
                    setuserName(data.userData.username)
                    setprofilePicture(data.userData.profilePicture)
    
                    console.log("Fetched User Details")
                    return data
                } else{
                    const errorData = await response.json()
                    throw new Error(errorData.message)
                }
            }catch (error){
                console.error("Error Fetching User Data:", error)
            }
        }
        fetchUserData();
    }, [currentUser.uid]);

    useEffect(() => {
        async function fetchEventData(){
            // fetches the event data, and stores the data (title, desc and loc) into useState, to be used throughout the page.
            try{
                const response = await fetch(`https://meetmycar.onrender.com/events?eventId=${encodeURIComponent(eventId)}`, {
                    method: 'GET',
                    headers: {
                        'accept': 'application/json',
                    },
                });
    
                if (response.ok){
                    const data = await response.json()

                    // updates post's data states
                    setTitle(data.postData.title)
                    setDesc(data.postData.description)
                    setLoc(data.postData.location)
    
                    console.log("Fetched Event Details")
                    return data
                } else{
                    const errorData = await response.json()
                    throw new Error(errorData.message)
                }
            }catch (error){
                console.error("Error Fetching Event Data:", error)
            }
        }
        fetchEventData();
    }, []);

    // shows the current time and date to the user
    useEffect(() => {
        const currentDateTime = () => {
            const currentDate = new Date()
            setDate(currentDate.toLocaleDateString())
            setTime(currentDate.toLocaleTimeString())
        }
        currentDateTime()

        const intervalId = setInterval(currentDateTime, 1000)
        return () => clearInterval(intervalId)
    }, [])

    // handles form submission
    async function handleUpdateEvent(e){
        e.preventDefault()

        // validates the form's field has the correct length and not empty
       if (titleRef.current.value.length < 2 ){
            return setError("Title Too Short")
       }

       if (titleRef.current.value.length > 30 ){
            return setError("Title Too Long")
       }

       if (descRef.current.value.length < 2 ){
            return setError("Description Too Short")
       }

       if (locRef.current.value.length < 2 ){
            return setError("Location Too Short")
        }

        if (locRef.current.value.length > 30 ){
            return setError("Location Too Long")
        }


       // check if the field is not the same as previous
       if ((titleRef.current.value !== title) || (descRef.current.value !== desc) || (locRef.current.value !== loc)) {
            
        // using useRef, it will capture the current value for each field and stores into FormData
            const formData = new FormData();
            formData.append('title', titleRef.current.value);     
            formData.append('description', descRef.current.value);
            formData.append('location', locRef.current.value);

            try{
                // updates the event with it's eventId using the formData
                setLoading(true)
                setError('')

                const response = await fetch(`https://meetmycar.onrender.com/events/edit?eventId=${encodeURIComponent(eventId)}`, {
                    method: 'PUT',
                    body: formData,
                });

                if (response.ok){
                    // successful form submission, and navigates back to event page to see event
                    console.log("Updated Event Data")
                    navigate('/event')
                } else{
                    const errorData = await response.json()
                    setError("Failed To Update Event Data")
                    console.error("Error Updating Event Data:", error)
                    throw new Error(errorData.message)
                }
            }catch (error){
                console.error("Error Updating Event Data:", error)
                setError("Failed To Update Event Data")
            }
            setLoading(false)
        }else{
            // if no changes in form, shows an error message
            setError('No Changes To Event Data')
            return
        }
    }

    return (
        <>
            <div className='addPost'>
                <h2 className="addPost_text">Edit <span>Event</span></h2>
                <form onSubmit={handleUpdateEvent}>
                    <div className='addHeading'>
                        {/* User Details */}
                        <div className='showUserDetails'>

                            {profilePicture && (
                                <img className='showUserImage'
                                    src={profilePicture}
                                    alt="Profile"
                                />
                            )}
                            
                            <p className='showUserName'>{username}</p>
                        </div>
                        <div className='showTimeStamp'>
                            <p>{date}</p>
                            <p>{time}</p>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className='add-post-content'>
                        <input type='text' ref={titleRef} defaultValue={title} className='add_postTitle' ></input>

                        <div className='add_postFooter'>
                            <input type='text' ref={descRef} defaultValue={desc} className='add_postDescription' ></input> 
                        </div>
                    </div>
                    <p className="w-100 text-center mt-3 mb-1" id="error_Msg">{error}</p>
                    <button disabled={loading} className="addpostbtn" type="submit">Update Event</button>

                </form>
            </div>
        </>
    )
}

export default EditEvent