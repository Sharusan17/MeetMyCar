import React, {useState, useEffect, useRef} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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
    const [image, setImage] = useState('')
    const [desc, setDesc] = useState('')
    const [vehicle, setVehicle] = useState([])

    const [imageChange, setImageChange] = useState(false)
    const [selectVehicle, setSelectedVehicle] = useState([])

    const {currentUser} = useAuth()

    const [date, setDate] = useState('')
    const [time, setTime] = useState('')

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

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
            try{
                const response = await fetch(`http://localhost:3001/posts/view?postId=${encodeURIComponent(postId)}`, {
                    method: 'GET',
                    headers: {
                        'accept': 'application/json',
                    },
                });
    
                if (response.ok){
                    const data = await response.json()

                    setTitle(data.postData.title)
                    setImage(data.postData.image)
                    setDesc(data.postData.description)
                    setSelectedVehicle(data.postData.vehicles)
    
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


    async function handleUpdatePost(e){
        e.preventDefault()

       if (titleRef.current.value.length < 2 ){
            return setError("Title Too Short")
       }

       if (titleRef.current.value.length > 30 ){
            return setError("Title Too Long")
       }

       if (descRef.current.value.length < 2 ){
            return setError("Description Too Short")
       }


       if ((titleRef.current.value !== title) || (imageChange === true ) || (descRef.current.value !== desc) || (selectVehicle.vrn !== vehicle[0].vrn)) {
            const formData = new FormData();
            formData.append('title', titleRef.current.value);
            formData.append('image', imageRef.current.files[0])
            formData.append('description', descRef.current.value);
            formData.append('vehicleId', selectVehicle.vehicleId)
            formData.append('vrn', selectVehicle.vrn)

            try{
                setLoading(true)
                setError('')

                const response = await fetch(`http://localhost:3001/posts/edit?postId=${encodeURIComponent(postId)}`, {
                    method: 'PUT',
                    body: formData,
                });

                if (response.ok){
                    console.log("Updated Post Data")
                    navigate('/seepost')
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
            setError('No Changes To Post Data')
            return
        }
    }

    function handleSelectVehicle(e){
        const vehicle_Id= e.target.value;
        const selectVehicle = vehicle.find(v => v.vehicleId === vehicle_Id)
        setSelectedVehicle(selectVehicle);
    };

    function handleImageInput(e){
        setImage(URL.createObjectURL(e.target.files[0]))
        setImageChange(true)
    }

    return (
        <>
            <div className='addPost'>
                <h2 className="addPost_text">Edit <span>Post</span></h2>
                <form onSubmit={handleUpdatePost}>
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
                        <input type='text' ref={titleRef} defaultValue={title} className='add_postTitle' ></input>
                        <input type='file' ref={imageRef} defaultValue={image} placeholder='Insert Image' className='add_postImageBtn' onChange={handleImageInput} ></input> 
                        <img src={imageChange ? image :`http://localhost:3001/${image}`} className='add_postImage'></img>

                        <div className='add_postFooter'>
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
