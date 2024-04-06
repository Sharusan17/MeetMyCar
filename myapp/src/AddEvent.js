// import hooks
import React, {useState, useEffect, useRef} from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

import './AddPost_css.css'

const AddEvent = () => {

    const titleRef = useRef()
    const descRef  = useRef()
    const locRef = useRef()

    const [userId, setuserId] = useState('')
    const [username, setuserName] = useState('')
    const [profilePicture, setprofilePicture] = useState('')

    const {currentUser} = useAuth()

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const [date, setDate] = useState('')
    const [time, setTime] = useState('')

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

    // handles form submission
    async function handleAddEvent(e){
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

       // using useRef, it will capture the current value for each field and stores into FormData
       const formData = new FormData();
       formData.append('user', userId);
       formData.append('title', titleRef.current.value);
       formData.append('description', descRef.current.value);
       formData.append('location', locRef.current.value);

        try{
            // adds the formData into the Events database
            setError('')
            setLoading(true) 


            const response = await fetch('https://meetmycar.onrender.com/events/create', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok){
                const errorData = await response.json()
                throw new Error(errorData.message)
            }

            const data = await response.json()

            // fetches the user data with firebase ID
            const firebaseUID = currentUser.uid;

            // adds a superfuel point for every event added to the user's account
            const userSFResponse = await fetch(`https://meetmycar.onrender.com/users/update?userfb=${encodeURIComponent(firebaseUID)}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({addSuperFuel: +1})
            });

            if (!userSFResponse.ok){
                console.error("Error Updating User's SuperFuel:")
            }

            // successful form submission, and navigates back to event page to see event
            console.log("Add Event Successful")
            navigate("/event")

        }catch (error){
            console.error("Error Creating Event:", error)
            setError("Failed To Create Event")
            
        }
        setLoading(false) 
    }

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

    return (
        <>
            <div className='addPost'>
                <h2 className="addPost_text">Create <span>Event</span></h2>
                <form onSubmit={handleAddEvent}>
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
                        <input type='text' ref={titleRef} placeholder='Title...' className='add_postTitle' required></input>
                        <div className='eventAdd'>
                            <input type='text' ref={locRef} placeholder="Location" className='add_postTitle' id='event_loc' required></input> 
                            <input type='date' ref={descRef} placeholder="Date" className='add_postDescription' id='event_date' required></input> 
                        </div>

                        <div className='add_postFooter'>
                            <input type='text' ref={descRef} placeholder="Description" className='add_postDescription' required></input> 
                        </div>
                    </div>
                    <p className="w-100 text-center mt-3 mb-1" id="error_Msg">{error}</p>
                    <button disabled={loading} className="addpostbtn" type="submit">Create Event</button>

                </form>
            </div>
        </>
    )
}

export default AddEvent
