import React, {useState, useEffect, useRef} from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

import './AddPost_css.css'

const EditPost = () => {

    const titleRef = useRef()
    const imageRef = useRef()
    const descRef  = useRef()

    const[userId, setuserId] = useState('')
    const [username, setuserName] = useState('')
    const [profilePicture, setprofilePicture] = useState('')

    const [title, setTitle] = useState('')
    const [image, setImage] = useState('')
    const [desc, setDesc] = useState('')

    const {currentUser} = useAuth()

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
        async function fetchPostData(){
            try{
                const postId = '65b6a31ab98413b36e4d8429';
    
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


    async function handleUpdatePost(e){
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

    //    if (imageRef.current.files.length === 0) {
    //         return setError("Please select an image to upload.")
    //    }

       if ((titleRef.current.value !== title) || (imageRef.current.files[0] !== image) || (descRef.current.value !== desc)) {
        const formData = new FormData();
        formData.append('title', titleRef.current.value);
        formData.append('description', descRef.current.value);
        formData.append('image', imageRef.current.files[0]);

        try{
            setLoading(true)
            setError('')

            const postId = '65b6a31ab98413b36e4d8429';

            const response = await fetch(`http://localhost:3001/posts/edit?postId=${encodeURIComponent(postId)}`, {
                method: 'PUT',
                body: formData,
            });

            if (response.ok){
                console.log("Updated Post Data")
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
                            <p>26-10-2024</p>
                            <p>18:00</p>
                        </div>
                    </div>

                    <div className='add-post-content'>
                        <input type='text' ref={titleRef} defaultValue={title} className='add_postTitle' ></input>
                        <input type='file' ref={imageRef} src={`http://localhost:3001/${image}`}   className='add_postImage' accept="image/*" ></input> 

                        <div className='add_postFooter'>
                            <select className='add_postVRN'>
                                <option>Car 1</option>
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
