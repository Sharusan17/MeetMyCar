import React, {useState, useEffect, useRef} from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

import './AddPost_css.css'

const AddPost = () => {

    const titleRef = useRef()
    const imageRef = useRef()
    const descRef  = useRef()

    const[userId, setuserId] = useState('')
    const [username, setuserName] = useState('')
    const [profilePicture, setprofilePicture] = useState('')

    const[image, setImage] = useState('')

    const {currentUser} = useAuth()

    const [error, setError] = useState('')
    const [loading, setLoading] = useState('')

    const navigate = useNavigate()

    const [date, setDate] = useState('')
    const [time, setTime] = useState('')

    useEffect(() => {
        async function fetchUserData(){
            try{
                const firebaseUID = currentUser.uid;
    
                const response = await fetch(`http://localhost:3001/users/details?userfb=${encodeURIComponent(firebaseUID)}`, {
                    method: 'GET',
                    headers: {
                        'accept': 'application/json',
                    },
                });
    
                if (response.ok){
                    const data = await response.json()

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

    async function handleAddPost(e){
        e.preventDefault()

       if (titleRef.current.value.length < 2 ){
            return setError("Title Too Short")
       }

       if (titleRef.current.value.length > 20 ){
            return setError("Title Too Long")
       }

       if (descRef.current.value.length < 2 ){
            return setError("Description Too Short")
       }

       if (imageRef.current.files.length === 0) {
            return setError("Please select an image to upload.")
       }


       const formData = new FormData();
       formData.append('user', userId);
       formData.append('title', titleRef.current.value);
       formData.append('description', descRef.current.value);
       formData.append('image', imageRef.current.files[0]);

        try{
            setError('')
            setLoading(true) 


            const response = await fetch('http://localhost:3001/posts/add', {
                method: 'POST',
                body: formData,
            });

            if (response.ok){
                const data = await response.json()
                console.log("Add Post Successful")
                navigate("/seepost")
                return data
            } else{
                const errorData = await response.json()
                throw new Error(errorData.message)
            }
        }catch (error){
            console.error("Error Creating Post:", error)
            setError("Failed To Create Post")
            
        }
        setLoading(false) 
    }

    function handleImageInput(e){
        setImage(URL.createObjectURL(e.target.files[0]))
    }

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
                <h2 className="addPost_text">Add <span>Post</span></h2>
                <form onSubmit={handleAddPost}>
                    <div className='addHeading'>
                        <div className='showUserDetails'>

                            {profilePicture && (
                                <img className='showUserImage'
                                    src={`http://localhost:3001/${profilePicture}`} 
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

                    <div className='add-post-content'>
                        <input type='text' ref={titleRef} placeholder='Title...' className='add_postTitle' required></input>
                        <input type='file' ref={imageRef}  placeholder='Insert Image' className='add_postImageBtn' onChange={handleImageInput} required></input> 
                        <img src={image} className='add_postImage'></img>

                        <div className='add_postFooter'>
                            <select className='add_postVRN'>
                                <option>Car 1</option>
                            </select>
                            <input type='text' ref={descRef} placeholder="Description" className='add_postDescription' required></input> 
                        </div>
                    </div>
                    <p className="w-100 text-center mt-3 mb-1" id="error_Msg">{error}</p>
                    <button disabled={loading} className="addpostbtn" type="submit">Add Post</button>

                </form>
            </div>
        </>
    )
}

export default AddPost
