import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { useAuth } from './AuthContext'

import './Profile_css.css'

const Profile = () => {
    const {currentUser} = useAuth()
    const {userid} = useParams()

    const [userId, setuserId] = useState('')
    const [username, setuserName] = useState('')
    const [profilePicture, setprofilePicture] = useState('')

    const [posts, setPost] = useState([])
    const [confirmDeletePost, setconfirmDeletePost] = useState(false)

    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        async function fetchUserData(){
            try{
                setError('')

                const firebaseUID = currentUser.uid;

                let userQuery

                if(userid){
                    userQuery = `userid=${encodeURIComponent(userid)}`
                } else{
                    userQuery = `userfb=${encodeURIComponent(firebaseUID)}`
                }

                console.log(userQuery)
    
                const response = await fetch(`http://localhost:3001/users/details?${userQuery}`, {
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

                    const postData = await Promise.all(data.userData.posts.map(async (post) => {
                        if(post?.postId){
                            const PostReponse = await fetch(`http://localhost:3001/posts/view?postId=${encodeURIComponent(post.postId)}`, {
                                method: 'GET',
                                headers: {
                                    'accept': 'application/json',
                                },
                            });

                            if(PostReponse.ok){
                                const post_Data = await PostReponse.json()
                                return post_Data
                            } else{
                                console.error("Error Fetching Posts:", error)
                                setError("Error Fetching Your Posts. Try Again Later")
                                return null
                            }
                        }
                    }))

                    const postWithData = postData.filter(post => post !== null)
                    setPost(postWithData)
    
                    console.log("Fetched User Details")
                    return data
                } else{
                    const errorData = await response.json()
                    throw new Error(errorData.message)
                }
            }catch (error){
                console.error("Error Fetching User Data:", error)
                setError("Error Fetching User. Try Again Later")
            }
        }
        fetchUserData();
    }, [currentUser.uid, userid]);

    const handleSelectCard = (post) => {
        console.log("Selected:", post)
        setconfirmDeletePost(false)
    }

    async function handleDelete(postId){

        if (!confirmDeletePost){
            setconfirmDeletePost(true)
            return
        }

        setLoading(true)
        setError('')
        setMessage('')

        try{
            const firebaseUID = currentUser.uid;

            const response = await fetch(`http://localhost:3001/users/update?userfb=${encodeURIComponent(firebaseUID)}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({postIDRemove: postId})
            });

            if (response.ok){
                console.log("Deleted Vehicle")
                setMessage("Post Deleted")
                setTimeout(() => {
                    window.location.reload(false);
                }, 1000)
            } else{
                const errorData = await response.json()
                setError("Failed To Delete Post")
                console.error("Error Deleting Post:", error)
                throw new Error(errorData.message)
            }
        }catch (error){
            console.error("Error Deleting Post:", error)
            setError("Failed To Delete Post")
        }finally{
            setLoading(false)
        }
    }

    return (
        <>
            <div className='showProfile'>        
                <header className='profileHeader'>
                    <div className='showUserDetails'>
                        <div className='userRow'>
                            {profilePicture && (
                                <img className='showUserImage'
                                    src={`http://localhost:3001/${profilePicture}`} 
                                    alt="Profile"
                                />
                            )}
                            <p className='showUserName'>{username}</p>
                        </div>
                        

                        <button className='btn btn-dark' id='followbtn'> Follow</button>

                    </div>

                    <div className='showUserData'>
                        <div className='showUserDataNum'>
                            <p> <span>{posts.length}</span> Posts</p>
                            <p> <span>10</span> Followers</p>
                            <p> <span>55</span> Following</p>
                        </div>
                        
                        <Link to="/garage" className="btn btn-dark" id='checkbtn'> Check Vehicle</Link>
                    </div>
                    
                </header>   
                

                <p className="w-100 text-center mt-3 mb-1" id="success_Msg">{message}</p>
                <p className="w-100 text-center mt-3 mb-1" id="error_Msg">{error}</p>


                <div className='Card_Post'>
                    {posts.map((post, index) => (
                        <div key={index}  className='postCard' onClick={() => handleSelectCard(post)}>

                                <div className='cardPostImage'>
                                    <img src={`http://localhost:3001/${post?.postData?.image}`} alt={post?.postData?.title}/> 
                                </div>

                                <div className='cardContent'>
                                    <div className='cardHeader'>
                                        <h2>{post?.postData?.title}</h2> 
                                        <p>{post?.postData?.vehicles?.vrn}</p>
                                    </div>

                                    <div className='cardFooter'>
                                        <p>{post?.postData?.description}</p>
                                    </div>
                                </div>
                                
                        </div>
                    ))}
                </div>   
            </div>
        </>
    )
}

export default Profile
