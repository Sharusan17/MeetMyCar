import React, {useState, useEffect} from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import {Popup} from 'reactjs-popup'

import './Profile_css.css'

const Profile = () => {
    const {currentUser} = useAuth()
    const {userid} = useParams()

    const [currentUserId, setCurrentUserId] = useState('')
    const [currentUserName, setCurrentUserName] = useState('')
    const [currentUserFollowing, setCurrentUserFollowing] = useState('')

    const [userId, setProfileUserId] = useState('')
    const [username, setProfileuserName] = useState('')
    const [profilePicture, setProfileprofilePicture] = useState('')

    const [profileSF, setProfileSF] = useState('')
    const [followers, setProfileFollowers] = useState([])
    const [following, setProfileFollowing] = useState([])

    const [posts, setPost] = useState([])
    const [showfollowbtn, setFollowbtn] = useState(true)
    const [selectedPost, setselectedPost] = useState('')
    const [openModal, setOpenModal] = useState(false)
    const [openFollowerModal, setOpenFollowerModal] = useState(false)
    const [openFollowingModal, setOpenFollowingModal] = useState(false)
    const [confirmDeletePost, setconfirmDeletePost] = useState(false)

    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        async function fetchProfileData(){
            try{
                setError('')
    
                const response = await fetch(`http://localhost:3001/users/details?userid=${encodeURIComponent(userid)}`, {
                    method: 'GET',
                    headers: {
                        'accept': 'application/json',
                    },
                });
    
                if (response.ok){
                    const data = await response.json()

                    setProfileUserId(data.userData._id)
                    setProfileuserName(data.userData.username)
                    setProfileprofilePicture(data.userData.profilePicture)
                    setProfileSF(data.userData.superfuel)
                    setProfileFollowers(data.userData.followers)
                    setProfileFollowing(data.userData.following)

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
        fetchProfileData()
    }, [currentUser.uid, userid])

    useEffect(() => {
        async function fetchCurrentUserData(){
            try{
                setError('')
                const firebaseUID = currentUser.uid;

                const response = await fetch(`http://localhost:3001/users/details?userfb=${encodeURIComponent(firebaseUID)}`, {
                    method: 'GET',
                    headers: {
                        'accept': 'application/json',
                    },
                });

                if (response.ok){
                    const data = await response.json()

                    setCurrentUserId(data.userData._id)
                    setCurrentUserName(data.userData.username)
                    setCurrentUserFollowing(data.userData.following)

                    console.log("Fetched Current User Details")
                    return data
                } else{
                    const errorData = await response.json()
                    setError("Failed To Fetch Current User Data")
                    throw new Error(errorData.message)
                }
            }catch (error){
                console.error("Error Fetching Current User Data:", error)
                setError("Failed To Fetch Current User Data")
            }
        }
        fetchCurrentUserData();
    }, [currentUser.uid]); 

    const handleSelectCard = (post) => {
        console.log("Selected:", post)
        setselectedPost(post)
        setOpenModal(true)
        setconfirmDeletePost(false)
    }

    const handleEdit = (postId) => {
        navigate(`/editpost/${postId}`)
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
                body: JSON.stringify({postIdRemove: postId})
            });

            if (!response.ok){
                const errorData = await response.json()
                setError("Failed To Delete Post")
                console.error("Error Deleting Post On User:", error)
                throw new Error(errorData.message)
            }
            const deletePost_response = await fetch(`http://localhost:3001/posts/delete?postId=${encodeURIComponent(postId)}`, {
                method: 'DELETE',
            });

            if(!deletePost_response.ok){
                const errorData = await response.json()
                setError("Failed To Delete Post")
                console.error("Error Deleting Post: On Post Server", error)
                throw new Error(errorData.message)
            }

            console.log("Deleted Post")
            setMessage("Post Deleted")
            setOpenModal(false)
            setTimeout(() => {
                window.location.reload(false);
            }, 1000)

        }catch (error){
            console.error("Error Deleting Post:", error)
            setError("Failed To Delete Post")
        }finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        function fetchCurrentUserFollowing(){
            try{
                setError('')
                const isFollowing = currentUserFollowing.some((followingUser) => followingUser.followeringId === userId)
                console.log("Is Following:", isFollowing)
                if(isFollowing){
                    setFollowbtn(false)
                }
            }catch (error){
                console.error("Error Checking if Following:", error)
                setError("Failed to check if user is following")
            }
        }
        fetchCurrentUserFollowing()
    }, [currentUserFollowing, userId])

    async function handleFollow(){

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
                body: JSON.stringify({followeringId: userId, followeringName: username})
            });

            if (!response.ok){
                const errorData = await response.json()
                setError("Failed To Follow Account")
                console.error("Error Following Account:", error)
                throw new Error(errorData.message)  
            }

            const Followersresponse = await fetch(`http://localhost:3001/users/update?userid=${encodeURIComponent(userid)}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({followersId: currentUserId, followersname: currentUserName})
            });

            if (!Followersresponse.ok){
                const errorData = await response.json()
                setError("Failed To Update User Followers")
                console.error("Error Updating User Followers:", error)
                throw new Error(errorData.message)  
            }
            setFollowbtn(false)

        }catch (error){
            console.error("Error Following Account:", error)
            setError("Failed To Follow Account")
        }finally{
            setLoading(false)
        }
    }

    async function handleUnfollow(){

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
                body: JSON.stringify({followingtoRemove: userId})
            });

            if (!response.ok){
                const errorData = await response.json()
                setError("Failed To Unfollow Account")
                console.error("Error Unfollowing Account:", error)
                throw new Error(errorData.message)  
            }

            const Followersresponse = await fetch(`http://localhost:3001/users/update?userid=${encodeURIComponent(userid)}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({followersToRemove: currentUserId})
            });

            if (!Followersresponse.ok){
                const errorData = await response.json()
                setError("Failed To Update User Followers")
                console.error("Error Updating User Followers:", error)
                throw new Error(errorData.message)  
            }
            setFollowbtn(true)

        }catch (error){
            console.error("Error Unfollowing Account:", error)
            setError("Failed To Unfollow Account")
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

                        {showfollowbtn ? (
                                <>
                                    <button className='btn btn-dark' id='followbtn' onClick={() => handleFollow()}> Follow</button>
                                </>
                            ) : (
                                <>
                                    <button className='btn btn-dark' id='followbtn' onClick={() => handleUnfollow()}> Unfollow</button>
                                </>
                        )}
                    </div>

                    <div className='showUserData'>
                        <p className='superFuelData'><span>{profileSF} Super Fuel</span> <svg xmlns="http://www.w3.org/2000/svg" width="1.6em" height="1.6em" viewBox="0 0 24 24"><path fill="currentColor" d="M18 10a1 1 0 0 1-1-1a1 1 0 0 1 1-1a1 1 0 0 1 1 1a1 1 0 0 1-1 1m-6 0H6V5h6m7.77 2.23l.01-.01l-3.72-3.72L15 4.56l2.11 2.11C16.17 7 15.5 7.93 15.5 9a2.5 2.5 0 0 0 2.5 2.5c.36 0 .69-.08 1-.21v7.21a1 1 0 0 1-1 1a1 1 0 0 1-1-1V14a2 2 0 0 0-2-2h-1V5a2 2 0 0 0-2-2H6c-1.11 0-2 .89-2 2v16h10v-7.5h1.5v5A2.5 2.5 0 0 0 18 21a2.5 2.5 0 0 0 2.5-2.5V9c0-.69-.28-1.32-.73-1.77"/></svg></p>
                        <div className='showUserDataNum'>
                            <p> <span>{posts.length}</span> Posts</p>
                            <p onClick={() => setOpenFollowerModal(true)}> <span>{followers.length}</span> Followers</p>
                            <p onClick={() => setOpenFollowingModal(true)}> <span>{following.length}</span> Following</p>
                        </div>

                        {showfollowbtn ? (
                                <></>
                            ) : (
                                <>
                                    <Link to={`/garage/${userid}`} className="btn btn-dark" id='checkbtn'> Check Vehicle</Link>
                                </>
                        )}
                        
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
                                        <Link className='postVRN' to={`/race/${userId}`}>{post?.postData?.vehicles?.vrn}</Link>
                                    </div>

                                    <div className='cardFooter'>
                                        <p>{post?.postData?.description}</p>
                                    </div>
                                </div>
                                
                        </div>
                    ))}
                </div>

                <Popup open={openModal} closeOnDocumentClick onClose={() => setOpenModal(false)} className='Popup'>
                    <div className='Modal'>
                        {selectedPost ? (
                            <>
                                <div className='modalHeader'>
                                    <div>
                                        <h3>{selectedPost.postData?.title}</h3>
                                        <Link className='postVRN' to={`/race/${userId}`}>{selectedPost?.postData?.vehicles?.vrn}</Link>
                                    </div>
                                </div> 

                                <div className='modalImage'>
                                    <img src={`http://localhost:3001/${selectedPost?.postData?.image}`} alt={selectedPost?.postData?.title}/> 
                                </div>

                                <div className='modalDesc'>
                                    <p>{selectedPost?.postData?.description}</p>
                                </div>

                                {confirmDeletePost ? (
                                        <>
                                            <div className='buttonContainer'>
                                                <button disabled={loading}  className="btn btn-outline-dark" type="submit"  onClick={() => handleEdit(selectedPost.postData._id)}>Edit Post</button>
                                                <button disabled={loading}  className="btn btn-outline-danger" variant="danger" onClick={() => handleDelete(selectedPost.postData?._id)}>Confirm Delete</button>
                                            </div>
                                        </>
                                    ) :(
                                        <>
                                            <div className='buttonContainer'>
                                                <button disabled={loading}  className="btn btn-outline-dark" type="submit"  onClick={() => handleEdit(selectedPost.postData._id)}>Edit Post</button>
                                                <button disabled={loading}  className="btn btn-outline-dark" type="submit"  onClick={() => handleDelete(selectedPost.postData?._id)}>Delete Post</button>
                                            </div>
                                        </>
                                )}
                            </>
                        ) : <p>Loading....</p>}
                    </div>
                </Popup>

                <Popup open={openFollowerModal} closeOnDocumentClick onClose={() => setOpenFollowerModal(false)} className='Popup'>
                    <div className='FollowModal'>
                        <>
                            <div className='modalFollowHeader'>
                                <div>
                                    <h3>Followers</h3>
                                </div>
                            </div> 

                            <div className='line'></div>

                            <div className='modalFollowData'>
                                {followers.map((followers, index) => (
                                    <div key={index} >
                                        <p>{followers.followerName}</p>
                                    </div>
                                ))}
                            </div>
                        </>
                    </div>
                </Popup>

                <Popup open={openFollowingModal} closeOnDocumentClick onClose={() => setOpenFollowingModal(false)} className='Popup'>
                    <div className='FollowModal'>
                        <>
                            <div className='modalFollowHeader'>
                                <div>
                                    <h3>Followering</h3>
                                </div>
                            </div> 

                            <div className='line'></div>

                            <div className='modalFollowData'>
                                {following.map((following, index) => (
                                    <div key={index} >
                                        <p>{following.followeringName}</p>
                                    </div>
                                ))}
                            </div>
                        </>
                    </div>
                </Popup>  
            </div>
        </>
    )
}

export default Profile
