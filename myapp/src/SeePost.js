import React, {useState, useEffect, useRef} from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from './AuthContext'

import './SeePost_css.css'

const SeePost = () => {
    const {currentUser} = useAuth()
    const [userId, setUserId] = useState('')
    const [usersf, setUserSF] = useState('')

    const [posts, setPosts] = useState([])
    const [refreshData, setRefreshData] = useState(false)

    const [selectedPost, setSelectedPost] = useState('')
    const [selectedComment, setSelectedComment] = useState(null)
    const [menuoptions, setMenuOptions] = useState(false)
    const [confirmDeletePost, setconfirmDeletePost] = useState(false)
    const [deletePostMsg, setDeletePostMsg] = useState(false)

    const commentRef = useRef()
    const replyRef = useRef()
    const [commentBox, showCommentBox] = useState(false)
    const [replyBox, showReplyBox] = useState(false)

    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [nopost, setNoPost] = useState('')
    const [commentError, setCommentError] = useState('')
    const [loading, setLoading] = useState('')

    useEffect(() => {
        async function fetchPostData(){
            // fetches all post data, and stores the data into useState
            try{
                setError('')
                setMessage('')
                const response = await fetch(`http://localhost:3001/posts`, {
                    method: 'GET',
                    headers: {
                        'accept': 'application/json',
                    },
                });

                if (response.ok){
                    const data = await response.json()

                    // fetches vehicle's data for each post, and stores the data into post
                    const vehiclePost = await Promise.all(data.postData.map(async (post) => {
                        if(post.vehicles?.vehicleId){
                            const VehicleReponse = await fetch(`http://localhost:3001/vehicles?vehicleId=${encodeURIComponent(post.vehicles.vehicleId)}`, {
                                method: 'GET',
                                headers: {
                                    'accept': 'application/json',
                                },
                            });

                            if(VehicleReponse.ok){
                                const vehicle_Data = await VehicleReponse.json()
                                return {
                                    ...post,
                                     vehicle_Data
                                }
                            } else{
                                console.error("Error Fetching Vehicle Data:", error)
                                setError("Error Fetching Vehicle. Try Again Later")
                                return post                       
                            }
                        }
                        return post
                    }))

                    setPosts(vehiclePost)
                    console.log("Fetched Post Details", vehiclePost)

                    // shows message, if no post found
                    if(!vehiclePost || vehiclePost.length === 0){
                        setNoPost("No car posts? Looks like the traffic jam is over. Be the first on the road!")
                    } 

                } else{
                    const errorData = await response.json()
                    throw new Error(errorData.message)
                }

            } catch (error){
                console.error("Error Fetching Post Data:", error)
                setError("Error Fetching Post. Try Again Later")
            }
        }
        fetchPostData();
    }, [refreshData]);

    useEffect(() => {
        async function fetchUserData(){
            // fetches current user data, and stores the data (id and superfuel) into useState, to be used throughout the page.
            try{
                setError('')
                // fetches the user data with firebase ID
                const firebaseUID = currentUser.uid;
                const response = await fetch(`http://localhost:3001/users?userfb=${encodeURIComponent(firebaseUID)}`, {
                    method: 'GET',
                    headers: {
                        'accept': 'application/json',
                    },
                });

                if (response.ok){
                    const data = await response.json()
                    // updates user's data states
                    setUserId(data.userData._id)
                    setUserSF(data.userData.superfuel)

                    console.log("Fetched User Details")
                    return data
                } else{
                    const errorData = await response.json()
                    setError("Failed To Fetch User Data")
                    throw new Error(errorData.message)
                }
            }catch (error){
                console.error("Error Fetching User Data:", error)
                setError("Failed To Fetch User Data")
            }
        }
        fetchUserData();
    }, [currentUser.uid]);

    // shows the created's time and date of the post
    const formatDate = (timestamps) => {
        const date = new Date(timestamps);
        return date.toLocaleDateString()
    }
    const formatTime = (timestamps) => {
        const time = new Date(timestamps);
        return time.toLocaleTimeString()
    }

    // handles select post to show comment box
    const handleSelectPost = (post) => {
        console.log("Selected Post:", post)
        setSelectedPost(post)
        showCommentBox(!commentBox)
    }

    // handles select comment to show reply box
    const handleSelectComment = (selectedcomment) => {
        console.log("Selected Comment:", selectedcomment)
        setSelectedComment(selectedcomment)
        showReplyBox(!replyBox)
    }

    // handles select post to show options
    const handleShowOptions = (postId) =>{
        setSelectedPost(postId)
        setMenuOptions(!menuoptions)
        setconfirmDeletePost(false)
    }

    // handles select post to show delete button
    const handleShowDelete = (postId) => {
        setSelectedPost(postId)
        setconfirmDeletePost(!confirmDeletePost)
    }

    // handle post delete
    async function handleDelete(postId) {
        try{
            setError('')
            setMessage('')
            setLoading(true)

            // delete posts in Post database
            const response = await fetch(`http://localhost:3001/posts/delete?postId=${encodeURIComponent(postId)}`, {
                method: 'DELETE',
            });

            if (!response.ok){
                console.error("Error Deleting Post:")
            }
            const firebaseUID = currentUser.uid;

            // delete posts in User's account
            const userDelete_response = await fetch(`http://localhost:3001/users/update?userfb=${encodeURIComponent(firebaseUID)}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({postIdRemove: postId})
            });

            if(!userDelete_response.ok){
                console.error("Error Deleting Post:")
            }

            // removes superfuel points for user
            const userSFResponse = await fetch(`http://localhost:3001/users/update?userfb=${encodeURIComponent(firebaseUID)}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({removeSuperFuel: -1})
            });

            if (!userSFResponse.ok){
                console.error("Error Updating User's SuperFuel:")
            }
            
            // refresh page, to show updated post collection
            console.log("Deleted Post")
            setDeletePostMsg(true)
            setTimeout(() => {
                window.location.reload(false);
            }, 2000)

        }catch (error){
            console.error("Error Deleting Post:")
            setError("Error Deleting Post. Try Again Later")
        }
        setLoading(false)
    }

    // handle like post
    async function handleLike(postId) {
        try{
            setError('')
            setLoading(true)

            // add like to post database
            const response = await fetch(`http://localhost:3001/posts/edit?postId=${encodeURIComponent(postId)}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({addUserIdLike: userId})
            });

            if (!response.ok){
                console.error("Error Updating Like Post:")
            }

            // renders the like
            setRefreshData(!refreshData)
            console.log("Updated Like Post")
        }catch (error){
            console.error("Error Updating Like Post:")
            setError("Error Updating Like For Post. Try Again Later")
        }
        setLoading(false)
    }

    // handle unlike post
    async function handleUnLike(postId) {
        try{
            setError('')
            setLoading(true)

            // remove like from post database
            const response = await fetch(`http://localhost:3001/posts/edit?postId=${encodeURIComponent(postId)}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({removeUserIdLike: userId})
            });

            if (!response.ok){
                console.error("Error Updating Like Post:")
            }

            //renders the unlike
            setRefreshData(!refreshData)
            console.log("Updated Like Post")
        }catch (error){
            console.error("Error Updating Like Post:")
            setError("Error Updating Like For Post. Try Again Later")
        }
        setLoading(false)
    }

    // handle add comment post
    async function handleaddComment(postId){

        // validate the length of the comment
       if (commentRef.current.value.length >= 2){
            try{
                setLoading(true)
                setCommentError('')

                // adds comment to post database
                const response = await fetch(`http://localhost:3001/posts/edit?postId=${encodeURIComponent(postId)}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({commentUser: userId, commentText: commentRef.current.value})
                });

                if (!response.ok){
                    const errorData = await response.json()
                    console.error("Error Updating Comment Data:", error)
                    throw new Error(errorData.message)
                }

                // renders the new comment
                setRefreshData(!refreshData)
                console.log("Added Comment Data")
            }catch (error){
                console.error("Error Adding Comment Data:", error)
                setCommentError("Failed To Add Comment Data")
            }
            setLoading(false)
        }else{
            setCommentError('Comment Too Short')
            return
        }
    }

    // handle delete comment post
    async function handleDeleteComment(postId, commentId){
        try{
            setLoading(true)
            setCommentError('')

            // remove the comment from post database
            const response = await fetch(`http://localhost:3001/posts/edit?postId=${encodeURIComponent(postId)}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({deleteCommentId: commentId})
            });

            if (!response.ok){
                const errorData = await response.json()
                console.error("Error Deleting Comment Data:", error)
                throw new Error(errorData.message)
            }

            // renders the removed comment
            setRefreshData(!refreshData)
            console.log("Deleted Comment Data")
        }catch (error){
            console.error("Error Deleting Comment Data:", error)
            setCommentError("Failed To Delete Comment")
        }
        setLoading(false)
    }

    // handle add reply post
    async function handleaddReply(postId, commentId){

        // validate the length of the reply
        if (replyRef.current.value.length >= 2){
             try{
                 setLoading(true)
                 setCommentError('')
 
                 // adds reply to post database
                 const response = await fetch(`http://localhost:3001/posts/edit?postId=${encodeURIComponent(postId)}`, {
                     method: 'PUT',
                     headers: {
                         'Content-Type': 'application/json'
                     },
                     body: JSON.stringify({commentId: commentId, replyUser: userId, replyText: replyRef.current.value})
                 });
 
                 if (!response.ok){
                    const errorData = await response.json()
                    console.error("Error Updating Reply Data:", error)
                    throw new Error(errorData.message)
                 }

                // renders the new reply
                 setRefreshData(!refreshData)
                 console.log("Added Reply Data")
             }catch (error){
                 console.error("Error Adding Reply Data:", error)
                 setCommentError("Failed To Add Reply Data")
             }
             setLoading(false)
         }else{
             setCommentError('Reply Too Short')
             return
         }
     }

     // handle delete reply post
     async function handleDeleteReply(postId, commentId, replyId){
        try{
            setLoading(true)
            setCommentError('')

            // remove the reply from post database
            const response = await fetch(`http://localhost:3001/posts/edit?postId=${encodeURIComponent(postId)}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({commentId: commentId, deleteReplyId: replyId})
            });

            if (!response.ok){
                const errorData = await response.json()
                console.error("Error Deleting Reply Data:", error)
                throw new Error(errorData.message)
            }

            // renders the removed reply
            setRefreshData(!refreshData)
            console.log("Deleted Reply Data")
        }catch (error){
            console.error("Error Deleting Reply Data:", error)
            setCommentError("Failed To Delete Reply")
        }
        setLoading(false)
    }

    // handle add superfuel
    async function handleSuperFuel(postId, postUserId) {
        try{
            setError('')
            setLoading(true)

            // check if current user has valid number of superfuel
            if(usersf > 0){
                // add superfuel to post database
                const response = await fetch(`http://localhost:3001/posts/edit?postId=${encodeURIComponent(postId)}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({addUserIdSuperFuel: userId})
                });

                if (!response.ok){
                    console.error("Error Updating SuperFuel Post:")
                }

                const firebaseUID = currentUser.uid;

                // remove superfuel from current user
                const userResponse = await fetch(`http://localhost:3001/users/update?userfb=${encodeURIComponent(firebaseUID)}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({removeSuperFuel: -1})
                });

                if (!userResponse.ok){
                    console.error("Error Updating User's SuperFuel:")
                }

                // add superfuel to post's user
                const profileResponse = await fetch(`http://localhost:3001/users/update?userid=${encodeURIComponent(postUserId)}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({addSuperFuel: +1})
                });

                if (!profileResponse.ok){
                    console.error("Error Updating Profile's SuperFuel:")
                }
                
                // renders the superfuel
                setRefreshData(!refreshData)
                console.log("Updated SuperFuel Post")

            } else{
                console.error("Not Enough SuperFuel Points")
                setError("Not Enough SuperFuel Points.")
            }

            
        }catch (error){
            console.error("Error Updating SuperFuel Post:")
            setError("Error Updating SuperFuel For Post. Try Again Later")
        }
        setLoading(false)
    }

    // handle remove superfuel
    async function handleUnSuperFuel(postId, postUserId) {
        try{
            setError('')
            setLoading(true)

            // remove superfuel from post database
            const response = await fetch(`http://localhost:3001/posts/edit?postId=${encodeURIComponent(postId)}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({removeUserIdSuperFuel: userId})
            });

            if (!response.ok){
                console.error("Error Updating SuperFuel Post:")
            }

            const firebaseUID = currentUser.uid;

            // add superfuel to current user
            const userResponse = await fetch(`http://localhost:3001/users/update?userfb=${encodeURIComponent(firebaseUID)}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({addSuperFuel: +1})
            });

            if (!userResponse.ok){
                console.error("Error Updating User's SuperFuel:")
            }

            // remove superfuel from post's user
            const profileResponse = await fetch(`http://localhost:3001/users/update?userid=${encodeURIComponent(postUserId)}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({removeSuperFuel: -1})
            });

            if (!profileResponse.ok){
                console.error("Error Updating Profile's SuperFuel:")
            }

            // renders the superfuel
            setRefreshData(!refreshData)
            console.log("Updated SuperFuel Post")
        }catch (error){
            console.error("Error Updating SuperFuel Post:")
            setError("Error Updating SuperFuel For Post. Try Again Later")
        }
        setLoading(false)
    }

    return (
        <>
            <p className="w-100 text-center mt-2 mb-0" id="error_Msg">{nopost}</p>
            
            {/* displays all post in the [post] */}
            <div className="postList">
                {posts.map((post) => (
                    <div key={post._id}  className='post'>
                        <p className="w-100 text-center mt-2 mb-0" id="error_Msg">{error}</p>
                        <p className="w-100 text-center mt-2 mb-0" id="success_Msg">{message}</p>

                        {/* check if post belongs to current user and selected */}
                        {deletePostMsg && post._id === selectedPost ? (
                            <>
                                <p className="w-100 text-center mt-2 mb-0" id="success_Msg">Post Deleted!</p>
                            </>
                        ) : (
                            <>
                            </>
                        )}

                        <div className='postHead'>
                            <div className='postUserDetails'>
                                {post.user?.profilePicture && (
                                    <img className='postUserImage'
                                        src={post.user.profilePicture}
                                        alt="Profile"
                                    />
                                )}                                
                                <Link to={`/profile/${post.user._id}`} className='postUserName'>{post.user?.username}</Link>
                            </div>

                            
                            <div className='postTimeStamp'>
                                <p>{formatDate(post.createdAt)}</p>
                                <p>{formatTime(post.createdAt)}</p>

                                {/* check if post belongs to current user */}
                                {(post.user._id === userId)? (
                                    <>
                                        <div className='postMenuContainer'>
                                            <button className='postMenu' onClick={() => handleShowOptions(post._id)}>
                                                <div className='postdot'></div>
                                                <div className='postdot'></div>
                                                <div className='postdot'></div>
                                            </button>

                                            {menuoptions && post._id === selectedPost &&(
                                                <div className='postOption'>
                                                    <ul>
                                                        <li className='menu-item'>
                                                            <Link to={`/editpost/${post._id}`} className='menu-link'>
                                                                Edit Post
                                                            </Link>
                                                        </li>
                                                        <li className='menu-item'>
                                                            <Link onClick={() => handleShowDelete(post._id)} className='menu-link ' id='delete-menu-link'>
                                                                Delete Post
                                                            </Link>
                                                        </li>
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                    
                                ) :(
                                    <></>
                                )}
                            </div>
                        </div>

                        {/* check if post belongs to current user and selected */}
                        {confirmDeletePost && post._id === selectedPost && (
                            <div>
                                <button className="btn btn-dark" id='deletepostbtn' disabled={loading} onClick={() => handleDelete(post._id)}>Confirm Delete</button>
                            </div>
                        )}
                        
                        <div className='post-content'>
                            <h2 className='postTitle'>{post.title}</h2> 
                            <img src={post.image} alt={post.title} className='postImage'/>

                            {/* showcases the vehicle spec */}
                            <div className='postSpecs'>
                                {/* display spec as a speedometer, works a percentage to fill out of 350 */}
                                <div className='TopSpecs' style={{background: `conic-gradient(from 0.5turn,red 0% ${((post.vehicle_Data?.vehicleData.vehicleInfo.Performance.MaxSpeed.Mph/350)*100)}%,white ${0}% 100%)`}}>
                                    <h3>{post.vehicle_Data?.vehicleData.vehicleInfo.Performance.MaxSpeed.Mph} 
                                        <span>mph</span>
                                    </h3>
                                    <p className='TopSpecsName'>Top Speed</p>
                                </div>

                                {/* display spec as a speedometer, works a percentage to fill out of 800 */}
                                <div className='TopSpecs' style={{background: `conic-gradient(from 0.5turn,orange 0% ${((post.vehicle_Data?.vehicleData.vehicleInfo.Performance.Power.Bhp/800)*100)}%,white ${0}% 100%)`}}>
                                    <h3>{post.vehicle_Data?.vehicleData.vehicleInfo.Performance.Power.Bhp}
                                        <span>bhp</span>
                                    </h3>
                                    <p className='TopSpecsName'>BHP</p>
                                </div>

                                {/* display spec as a speedometer, works a percentage to fill out of 1000 */}
                                <div className='TopSpecs' style={{background: `conic-gradient(from 0.5turn,green 0% ${((post.vehicle_Data?.vehicleData.vehicleInfo.Performance.Torque.Nm)/1000)*100}%,white ${0}% 100%)`}}>
                                    <h3>{post.vehicle_Data?.vehicleData.vehicleInfo.Performance.Torque.Nm}
                                        <span>Nm</span>
                                    </h3>
                                    <p className='TopSpecsName'>Torque</p>
                                </div>
                            </div>

                            {/* shows the vrn as a button, to be raced when clicked */}
                            <div className='postFooter'>
                                <p className='raceText'>Race Me</p>
                                <Link className='postVRN' to={`/race/${post.user._id}`}>{post.vehicles?.vrn}</Link>
                                <p className='postDescription'>{post.description}</p> 
                            </div> 
                        </div> 

                        {commentBox && post._id === selectedPost._id? (
                            <>
                                <div className='CommentBox'>
                                    <button className='closeButton' onClick={() => showCommentBox(false)}>
                                        <span>&times;</span>
                                    </button>
                                
                                    {selectedPost ? (
                                        <>
                                            <div className='modalCommentHeader'>
                                                <h3>Comments</h3>
                                            </div> 

                                            <p className="w-100 text-center mt-2 mb-0" id="error_Msg">{commentError}</p>

                                            <div className='modalCommentBody'>
                                                {/* displays all comments for each post */}
                                                {selectedPost.comments?.map((postComment) => (
                                                    <div key={postComment._id} className='comments'>
                                                        <div className='commentTop'>
                                                            {/* displays user details for each comment and reply */}
                                                            <div className='commentUser'>
                                                                {postComment.userID?.profilePicture && (
                                                                    <img className='commentUserImage'
                                                                        src={postComment.userID.profilePicture}
                                                                        alt="Profile"
                                                                    />
                                                                )}                                
                                                                <Link to={`/profile/${postComment.userID?._id}`} className='commentUserName'>{postComment.userID?.username}</Link>
                                                            </div>
                                                            <div className='commentText'>
                                                                <p>{postComment.commentText}</p>
                                                            </div>
                                                            <div className='commentDate'>
                                                                <div>{formatDate(postComment.createdAt)}</div>
                                                                <div>{formatTime(postComment.createdAt)}</div>
                                                            </div>
                                                        </div>

                                                        {/* display replies for each comment */}
                                                        {postComment.replies?.map((postReply) => (
                                                            <div key={postReply._id} className='replies'>
                                                                <div className='commentTop'>
                                                                    <div className='commentUser'>
                                                                        {postReply.userID?.profilePicture && (
                                                                            <img className='replyUserImage'
                                                                                src={postReply.userID.profilePicture}
                                                                                alt="Profile"
                                                                            />
                                                                        )}                                
                                                                        <Link to={`/profile/${postReply.userID?._id}`} className='replyUserName'>{postReply.userID?.username}</Link>
                                                                    </div>
                                                                    <div className='replyText'>
                                                                        <p>{postReply.replyText}</p>
                                                                    </div>
                                                                    <div className='replyDate'>
                                                                        <div>{formatDate(postReply.createdAt)}</div>
                                                                        <div>{formatTime(postReply.createdAt)}</div>
                                                                        {postReply.userID._id === userId? (
                                                                            <>
                                                                                <button className='deletereplybtn' disabled={loading} onClick={() => handleDeleteReply(selectedPost._id, postComment._id, postReply._id)}> Delete Reply</button>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                            </>
                                                                        )}
                                                                    </div>

                                                                    
                                                                </div>
                                                            </div>
                                                        ))}

                                                        {/* check if comment belongs to user, and shows delete button */}
                                                        <div className='commentBottom'>
                                                            <button className='replybtn' disabled={loading} onClick={() => handleSelectComment(postComment._id)}>Reply</button>
                                                            {postComment.userID._id === userId? (
                                                                <>
                                                                    <button className='deletereplybtn' disabled={loading} onClick={() => handleDeleteComment(selectedPost._id, postComment._id)}>Delete</button>
                                                                </>
                                                            ) : (
                                                                <>
                                                                </>
                                                            )}
                                                        </div>
                                                        
                                                        {/* check selected comment and shows reply button */}
                                                        {replyBox && selectedComment === postComment._id ?(
                                                            <>
                                                                <div className='modalCommentButton'>
                                                                    <input type='text' ref={replyRef} placeholder="Reply..." className='commentText' required></input>
                                                                    <button className='btn btn-dark' id='commentBtn' disabled={loading} onClick={() => handleaddReply(selectedPost._id, postComment._id)}>Add Reply</button>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <>
                                                            </>
                                                        )}

                                                    </div>
                                                ))}
                                            </div>

                                            {/* check selected post and shows add comment button */}
                                            <div className='modalCommentButton'>
                                                <input type='text' ref={commentRef} placeholder="Comment..." className='commentText' required></input>
                                                <button className='btn btn-dark' id='commentBtn' disabled={loading} onClick={() => handleaddComment(selectedPost._id)}>Add Comment</button>
                                            </div>
                                        </>
                                    ) : <p>Loading....</p>}
                                </div>
                            </>
                        ) : (
                            <>
                            </>
                        )}

                        {/* display engagment button (like, comment, superfuel) */}
                        <div className='postEngagement'>
                            {/* check if post has been liked by current user, and shows like/unlike button */}
                            <div className='engagementColumn'>
                                {post.likes.some((likedUser) => likedUser.userId === userId) ? (
                                        <>
                                            <button className='unlikebtn' disabled={loading} onClick={() => handleUnLike(post._id)}><svg xmlns="http://www.w3.org/2000/svg" width="1.7em" height="1.7em" viewBox="0 0 26 26"><path d="M17.869 3.889c-2.096 0-3.887 1.494-4.871 2.524c-.984-1.03-2.771-2.524-4.866-2.524C4.521 3.889 2 6.406 2 10.009c0 3.97 3.131 6.536 6.16 9.018c1.43 1.173 2.91 2.385 4.045 3.729c.191.225.471.355.765.355h.058c.295 0 .574-.131.764-.355c1.137-1.344 2.616-2.557 4.047-3.729C20.867 16.546 24 13.98 24 10.009c0-3.603-2.521-6.12-6.131-6.12"/></svg></button>
                                        </>
                                    ) : (
                                        <>
                                            <button className='likebtn' disabled={loading} onClick={() => handleLike(post._id)}><svg xmlns="http://www.w3.org/2000/svg" width="1.7em" height="1.7em" viewBox="0 0 26 26"><path d="M17.869 3.889c-2.096 0-3.887 1.494-4.871 2.524c-.984-1.03-2.771-2.524-4.866-2.524C4.521 3.889 2 6.406 2 10.009c0 3.97 3.131 6.536 6.16 9.018c1.43 1.173 2.91 2.385 4.045 3.729c.191.225.471.355.765.355h.058c.295 0 .574-.131.764-.355c1.137-1.344 2.616-2.557 4.047-3.729C20.867 16.546 24 13.98 24 10.009c0-3.603-2.521-6.12-6.131-6.12"/></svg></button>
                                        </>
                                )}
                                <h3>{post.likes.length} LIKE</h3>

                            </div>

                            {/* shows comment button */}
                            <div className='engagementColumn'>
                                <button className='commentbtn' onClick={() => handleSelectPost(post)}><svg xmlns="http://www.w3.org/2000/svg" width="1.7em" height="1.7em" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M3 10.4c0-2.24 0-3.36.436-4.216a4 4 0 0 1 1.748-1.748C6.04 4 7.16 4 9.4 4h5.2c2.24 0 3.36 0 4.216.436a4 4 0 0 1 1.748 1.748C21 7.04 21 8.16 21 10.4v1.2c0 2.24 0 3.36-.436 4.216a4 4 0 0 1-1.748 1.748C17.96 18 16.84 18 14.6 18H7.414a1 1 0 0 0-.707.293l-2 2c-.63.63-1.707.184-1.707-.707V13zM9 8a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2zm0 4a1 1 0 1 0 0 2h3a1 1 0 1 0 0-2z" clip-rule="evenodd"/></svg></button>
                                <h3>{post.comments.length} Comment</h3>
                            </div>

                            {/* check if post has been superfuelled by current user, and shows superfuel/unsuperfuel button */}
                            <div className='engagementColumn'>
                                {post.superfuel.some((superFuelUser) => superFuelUser.userId === userId) ? (
                                        <>
                                            <button className='unsuperfuel' disabled={loading} onClick={() => handleUnSuperFuel(post._id, post.user._id)}><svg xmlns="http://www.w3.org/2000/svg" width="1.7em" height="1.7em" viewBox="0 0 16 16"><path d="M1 2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v8a2 2 0 0 1 2 2v.5a.5.5 0 0 0 1 0V8h-.5a.5.5 0 0 1-.5-.5V4.375a.5.5 0 0 1 .5-.5h1.495c-.011-.476-.053-.894-.201-1.222a.97.97 0 0 0-.394-.458c-.184-.11-.464-.195-.9-.195a.5.5 0 0 1 0-1q.846-.002 1.412.336c.383.228.634.551.794.907c.295.655.294 1.465.294 2.081V7.5a.5.5 0 0 1-.5.5H15v4.5a1.5 1.5 0 0 1-3 0V12a1 1 0 0 0-1-1v4h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1zm2.5 0a.5.5 0 0 0-.5.5v5a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 .5-.5v-5a.5.5 0 0 0-.5-.5z"/></svg></button>
                                        </>
                                    ) : (
                                        <>
                                            <button className='superfuel' disabled={loading} onClick={() => handleSuperFuel(post._id, post.user._id)}><svg xmlns="http://www.w3.org/2000/svg" width="1.7em" height="1.7em" viewBox="0 0 16 16"><path d="M1 2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v8a2 2 0 0 1 2 2v.5a.5.5 0 0 0 1 0V8h-.5a.5.5 0 0 1-.5-.5V4.375a.5.5 0 0 1 .5-.5h1.495c-.011-.476-.053-.894-.201-1.222a.97.97 0 0 0-.394-.458c-.184-.11-.464-.195-.9-.195a.5.5 0 0 1 0-1q.846-.002 1.412.336c.383.228.634.551.794.907c.295.655.294 1.465.294 2.081V7.5a.5.5 0 0 1-.5.5H15v4.5a1.5 1.5 0 0 1-3 0V12a1 1 0 0 0-1-1v4h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1zm2.5 0a.5.5 0 0 0-.5.5v5a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 .5-.5v-5a.5.5 0 0 0-.5-.5z"/></svg></button>
                                        </>
                                )}
                                <h3>{post.superfuel.length} Superfuel</h3>
                            </div>
                        </div>
                    </div>
                ))}
            </div> 

            {/* display message, when user reaches end of post's collection */}
            {posts.length > 0 ? (
                <>
                    <p className="w-100 text-center mt-2 mb-2" id="error_Msg">⛔️ You Reached End Of The Road ⛔️</p>
                </>
            ):(
                <>
                </>
            )}   

        </>
    )
}

export default SeePost
