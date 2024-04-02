// import hooks
import React, {useState, useEffect, useRef} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ImageGallery from 'react-image-gallery'
import { useAuth } from './AuthContext'

import './AddPost_css.css'

const EditPost = () => {

    const {postId} = useParams()

    const titleRef = useRef()
    const imageRef = useRef()
    const descRef  = useRef()

    const[userId, setuserId] = useState('')
    const [username, setuserName] = useState('')
    const [profilePicture, setprofilePicture] = useState('')

    const [title, setTitle] = useState('')
    const [image, setImage] = useState([])
    const [desc, setDesc] = useState('')
    const [vehicle, setVehicle] = useState([])

    const [imageChange, setImageChange] = useState(false)
    const [selectVehicle, setSelectedVehicle] = useState([])
    const [oldSelectedVehicle, setOldSelectedVehicle] = useState([])


    const {currentUser} = useAuth()

    const [date, setDate] = useState('')
    const [time, setTime] = useState('')

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

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

    useEffect(() => {
        async function fetchPostData(){
            // fetches the post data, and stores the data (title, img, desc and vehicle) into useState, to be used throughout the page.
            try{
                const response = await fetch(`https://meetmycar.onrender.com/posts?postId=${encodeURIComponent(postId)}`, {
                    method: 'GET',
                    headers: {
                        'accept': 'application/json',
                    },
                });
    
                if (response.ok){
                    const data = await response.json()

                    // updates post's data states
                    setTitle(data.postData.title)
                    setImage(data.postData.image)
                    setDesc(data.postData.description)
                    setSelectedVehicle(data.postData.vehicles)
                    setOldSelectedVehicle(data.postData.vehicles)
    
                    console.log("Fetched Post Details")
                    return data
                } else{
                    const errorData = await response.json()
                    throw new Error(errorData.message)
                }
            }catch (error){
                console.error("Error Fetching Post Data:", error)
            }
        }
        fetchPostData();
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
    async function handleUpdatePost(e){
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


       // check if the field is not the same as previous
       if ((titleRef.current.value !== title) || (imageChange === true ) || (descRef.current.value !== desc) || (selectVehicle.vrn !== oldSelectedVehicle.vrn)) {
            
        // using useRef, it will capture the current value for each field and stores into FormData
            const formData = new FormData();
            formData.append('title', titleRef.current.value);
            // iterate through each image and adds them to FormData
            for (let i = 0; i < imageRef.current.files.length; i++){
                formData.append('image', imageRef.current.files[i]);
            }            
            formData.append('description', descRef.current.value);
            formData.append('vehicleId', selectVehicle.vehicleId)
            formData.append('vrn', selectVehicle.vrn)

            try{
                // updates the post with it's postId using the formData
                setLoading(true)
                setError('')

                const response = await fetch(`https://meetmycar.onrender.com/posts/edit?postId=${encodeURIComponent(postId)}`, {
                    method: 'PUT',
                    body: formData,
                });

                if (response.ok){
                    // successful form submission, and navigates back to home page to see post
                    console.log("Updated Post Data")
                    navigate('/')
                } else{
                    const errorData = await response.json()
                    setError("Failed To Update Post Data")
                    console.error("Error Updating Post Data:", error)
                    throw new Error(errorData.message)
                }
            }catch (error){
                console.error("Error Updating Post Data:", error)
                setError("Failed To Update Post Data")
            }
            setLoading(false)
        }else{
            // if no changes in form, shows an error message
            setError('No Changes To Post Data')
            return
        }
    }

    // using the vehicle options, user will select the vehicle the post is related to
    function handleSelectVehicle(e){
        const vehicle_Id= e.target.value;
        const selectVehicle = vehicle.find(v => v.vehicleId === vehicle_Id)
        setSelectedVehicle(selectVehicle);
    };

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
        setImageChange(true)
    }

    return (
        <>
            <div className='addPost'>
                <h2 className="addPost_text">Edit <span>Post</span></h2>
                <form onSubmit={handleUpdatePost}>
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
                        <input type='file' multiple ref={imageRef} defaultValue={image} placeholder='Insert Images' className='add_postImageBtn' onChange={handleImageInput} ></input> 
                        <div className='add_postImage'>
                            <ImageGallery
                                items={imageChange ? image : 
                                        image.map ( imageurl => ({
                                            original: imageurl
                                        }))
                                }
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
                            {/* Shows all user vehicles for selection */}
                            <select className='add_postVRN' onChange={handleSelectVehicle} value={selectVehicle?.vehicleId} required>
                                    <option value="" disabled>VRN</option>
                                    {vehicle.map(vehicle => ( 
                                        <option key={vehicle.vehicleId} value={vehicle.vehicleId}> {vehicle.vrn} </option>
                                    ))}
                            </select>
                            <input type='text' ref={descRef} defaultValue={desc} className='add_postDescription' ></input> 
                        </div>
                    </div>
                    <p className="w-100 text-center mt-3 mb-1" id="error_Msg">{error}</p>
                    <button disabled={loading} className="addpostbtn" type="submit">Update Post</button>

                </form>
            </div>
        </>
    )
}

export default EditPost