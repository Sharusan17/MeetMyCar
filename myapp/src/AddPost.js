// import hooks
import React, {useState, useEffect, useRef} from 'react'
import { useNavigate } from 'react-router-dom'
import ImageGallery from 'react-image-gallery'
import { useAuth } from './AuthContext'

// import react-image-gallery styles
import "react-image-gallery/styles/css/image-gallery.css"

import './AddPost_css.css'

const AddPost = () => {

    const titleRef = useRef()
    const imageRef = useRef()
    const descRef  = useRef()

    const [userId, setuserId] = useState('')
    const [username, setuserName] = useState('')
    const [profilePicture, setprofilePicture] = useState('')
    const [vehicle, setVehicle] = useState([])

    const [image, setImage] = useState([])
    const [selectVehicle, setselectedVehicle] = useState([])

    const {currentUser} = useAuth()

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const [date, setDate] = useState('')
    const [time, setTime] = useState('')

    useEffect(() => {
        async function fetchUserData(){
            // fetches current user data, and stores the data (id, name, profilePic and vehicle) into useState, to be used throughout the page.
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
                    setVehicle(data.userData.vehicles)
    
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
    async function handleAddPost(e){
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

       if (imageRef.current.files.length === 0) {
            return setError("Please select an image to upload.")
       }

       if (imageRef.current.files.length > 5) {
            return setError("Maximum Image Exceeded (5)")
        }


       // using useRef, it will capture the current value for each field and stores into FormData
       const formData = new FormData();
       formData.append('user', userId);
       formData.append('title', titleRef.current.value);
       formData.append('description', descRef.current.value);
       // iterate through each image and adds them to FormData
       for (let i = 0; i < imageRef.current.files.length; i++){
            formData.append('image', imageRef.current.files[i]);
       }
       formData.append('vehicleId', selectVehicle.vehicleId)
       formData.append('vrn', selectVehicle.vrn)

       console.log(imageRef.current.files)
       console.log(selectVehicle)

        try{
            // adds the formData into the Posts database
            setError('')
            setLoading(true) 


            const response = await fetch('https://meetmycar.onrender.com/posts/add', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok){
                const errorData = await response.json()
                throw new Error(errorData.message)
            }

            const data = await response.json()

            console.log(data.newPost._id)

            // fetches the user data with firebase ID
            const firebaseUID = currentUser.uid;

            const Post_formData = new FormData();
            // fetch the postId, after added to post database
            Post_formData.append('postId', data.newPost._id);

            // adds the post to the user's account and database
            const userResponse = await fetch(`https://meetmycar.onrender.com/users/update?userfb=${encodeURIComponent(firebaseUID)}`, {
                method: 'PUT',
                body: Post_formData,
            });

            if (!userResponse.ok){
                const errorData = await response.json()
                throw new Error(errorData.message)
            } 

            // adds a superfuel point for every post added to the user's account
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

            // successful form submission, and navigates back to home page to see post
            console.log("Add Post Successful")
            navigate("/")

        }catch (error){
            console.error("Error Creating Post:", error)
            setError("Failed To Create Post")
            
        }
        setLoading(false) 
    }

    // fetches the image array, and sets to the setImage state which can be shown on the form for the user
    function handleImageInput(e){
        const imageUrls = []
        // Go through each image
        for (let i = 0; i < e.target.files.length; i++){
            // create an object URL for each image
            const imageUrl = {
                original: URL.createObjectURL(e.target.files[i]),
            }
            imageUrls.push(imageUrl)
        }
        // set the array to setImage state
        console.log("Post images:", imageUrls)
        setImage(imageUrls)
    }

    // using the vehicle options, user will select the vehicle the post is related to
    function handleSelectVehicle(e){
        const vehicle_Id= e.target.value;
        const selectVehicle = vehicle.find(v => v.vehicleId === vehicle_Id)
        setselectedVehicle(selectVehicle);
    };

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
                <h2 className="addPost_text">Add <span>Post</span></h2>
                <form onSubmit={handleAddPost}>
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
                        <input type='file' multiple ref={imageRef} placeholder='Insert Images' accept="image/*" className='add_postImageBtn' onChange={handleImageInput} required></input> 
                        <div className='add_postImage'>
                            <ImageGallery
                                items={image}
                                showPlayButton={false}
                                showFullscreenButton={false}
                                showNav={false}
                                showBullets={true}
                                autoPlay={true}
                                infinite={true}
                                slideInterval={5000}
                            />
                        </div>

                        <div className='add_postFooter'>
                            <input type='text' ref={descRef} placeholder="Description" className='add_postDescription' required></input> 
                            {/* Shows all user vehicles for selection */}
                            <select className='add_postVRN' onChange={handleSelectVehicle} value={selectVehicle.vehicleId} required>
                                <option value="" disabled>VRN</option>
                                {vehicle.map(vehicle => ( 
                                    <option key={vehicle.vehicleId} value={vehicle.vehicleId}> {vehicle.vrn} </option>
                                ))}
                            </select>
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
