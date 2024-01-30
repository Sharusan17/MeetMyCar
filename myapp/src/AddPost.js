import React, {useState, useEffect, useRef} from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

import './AddPost_css.css'

const AddPost = () => {

    const titleRef = useRef()
    const imageRef = useRef()
    const descRef  = useRef()

    const [username, setuserName] = useState('')
    const [profilePicture, setprofilePicture] = useState('')

    const currentUser = useAuth()

    const [error, setError] = useState()
    const [loading, setLoading] = useState()

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
        // eslint-disable-next-line
      }, [currentUser.uid]);

    async function handleAddPost(e){
        e.preventDefault()
        
        const formData = new FormData();
        formData.append('users')
        formData.append('title', titleRef.current.value)
        formData.append('description', descRef.current.value)
        formData.append('image', imageRef.current.files[0])

        try{
            setError('')

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
                            <p>26-10-2024</p>
                            <p>18:00</p>
                        </div>
                    </div>

                    <div className='add-post-content'>
                        <input type='text'ref={titleRef} placeholder='Title...' className='add_postTitle'></input>
                        <input type='file'ref={imageRef} placeholder='Insert Image' className='add_postImage'></input> 

                        <div className='add_postFooter'>
                            <select className='add_postVRN'>
                                <option>Car 1</option>
                            </select>
                            <input type='text' ref={descRef} placeholder="Description" className='add_postDescription'></input> 
                        </div>
                    </div>
                    <p>{error}</p>
                    <button disabled={loading} className="addpostbtn" type="submit">Add Post</button>

                </form>
            </div>
        </>
    )
}

export default AddPost
