import React, {useState, useEffect, useRef} from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import ImageGallery from 'react-image-gallery'
import { useAuth } from './AuthContext'
import {Popup} from 'reactjs-popup'

import './Profile_css.css'

const Profile = () => {
    const {currentUser} = useAuth()
    const {userid, userName} = useParams()

    const [currentUserId, setCurrentUserId] = useState('')
    const [currentUserName, setCurrentUserName] = useState('')
    const [currentUserFollowing, setCurrentUserFollowing] = useState('')
    const [currentUserSF, setCurrentUserSF] = useState('')

    const [userId, setProfileUserId] = useState('')
    const [username, setProfileuserName] = useState('')
    const [profilePicture, setProfileprofilePicture] = useState('')

    const [profileSF, setProfileSF] = useState('')
    const [followers, setProfileFollowers] = useState([])
    const [following, setProfileFollowing] = useState([])
    const [openUserRecommend, setOpenUserRecommend] = useState(false)

    const [allUser, setAllUser] = useState([])
    const [posts, setPost] = useState([])
    const [refreshData, setRefreshData] = useState(false)
    const [showfollowbtn, setFollowbtn] = useState(true)
    const [selectedPost, setselectedPost] = useState('')
    const [selectedComment, setSelectedComment] = useState(null)
    const [openModal, setOpenModal] = useState(false)
    const [openFollowerModal, setOpenFollowerModal] = useState(false)
    const [openFollowingModal, setOpenFollowingModal] = useState(false)
    const [confirmDeletePost, setconfirmDeletePost] = useState(false)
    const [dropdown, setDropDown] = useState(true)
    const [followBtnCard, showFollowBtnCard] = useState(true)

    const commentRef = useRef()
    const replyRef = useRef()
    const [commentBox, showCommentBox] = useState(false)
    const [showReplyBox, setShowReplyBox] = useState(false)

    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [commentError, setCommentError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        async function fetchProfileData(){
            // fetches profile's user data, and stores the data into useState, to be used throughout the page.
            try{
                setError('')

                let query

                // fetches the user data with userid/username
                if (userid){
                    query = `userid=${encodeURIComponent(userid)}`
                } else{
                    query = `username=${encodeURIComponent(userName)}`
                }

                console.log(query)
    
                const response = await fetch(`https://meetmycar.onrender.com/users?${query}`, {
                    method: 'GET',
                    headers: {
                        'accept': 'application/json',
                    },
                });
    
                if (response.ok){
                    const data = await response.json()

                    // updates profile user's data states
                    setProfileUserId(data.userData._id)
                    setProfileuserName(data.userData.username)
                    setProfileprofilePicture(data.userData.profilePicture)
                    setProfileSF(data.userData.superfuel)
                    setProfileFollowers(data.userData.followers)
                    setProfileFollowing(data.userData.following)

                    // fetches post's data for the profile's user, and stores the data into post
                    const postData = await Promise.all(data.userData.posts.map(async (post) => {
                        if(post?.postId){
                            const PostReponse = await fetch(`https://meetmycar.onrender.com/posts?postId=${encodeURIComponent(post.postId)}`, {
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

                    const postWithData = postData.filter(post => post !== null).reverse()
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
    }, [currentUser.uid, userid, refreshData])

    useEffect(() => {
        async function fetchCurrentUserData(){
            // fetches current user data, and stores the data into useState, to be used throughout the page.
            try{
                setError('')
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
                    setCurrentUserId(data.userData._id)
                    setCurrentUserName(data.userData.username)
                    setCurrentUserFollowing(data.userData.following)
                    setCurrentUserSF(data.userData.superfuel)

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

    useEffect(() => {
        // fetches all user data, and stores the data into useState
        async function fetchAllUserData(){
            try{
                setError('')

                const response = await fetch(`https://meetmycar.onrender.com/users/all`, {
                    method: 'GET',
                    headers: {
                        'accept': 'application/json',
                    },
                });

                if (response.ok){
                    const data = await response.json()

                    // fetches mutual friends that current user is not following, to show as recommendation
                    if (currentUserFollowing){
                        // using all users, it will filter users that are being followed by the current user, and get their followerings
                        const findMutualFriends = data.allUserData.filter((user) => user.following.some(userFollowings => currentUserFollowing.some(myFollowings => userFollowings.followeringId === myFollowings.followeringId)))
                        // filter mutual friends and remove the friends that are being followed already by current user
                        const filteredMutualFriends = findMutualFriends.filter(user => !currentUserFollowing.some(myFollowings => user._id === myFollowings.followeringId));
                        // remove itself from the list of mutual friends
                        const mutualFriends = filteredMutualFriends.filter(user => user._id !== userId);
                        console.log('Check Mutual Friends', mutualFriends)   
    
                        // stores valid mutual friends into state
                        setAllUser(mutualFriends)
                        setOpenUserRecommend(true)
                    } else{
                        setOpenUserRecommend(false)
                    }

                    console.log("Fetched All User Details")
                    return data
                } else{
                    const errorData = await response.json()
                    setError("Failed To Fetch All User Data")
                    throw new Error(errorData.message)
                }
            }catch (error){
                console.error("Error Fetching All User Data:", error)
                setError("Failed To Fetch All User Data")
            }
        }
        fetchAllUserData();
    }, [currentUserFollowing]); 

    // shows the created's time and date of the post
    const formatDate = (timestamps) => {
        const date = new Date(timestamps);
        return date.toLocaleDateString()
    }
    const formatTime = (timestamps) => {
        const time = new Date(timestamps);
        return time.toLocaleTimeString()
    }

    // handles select card to show post
    const handleSelectCard = (post) => {
        console.log("Selected:", post)
        setselectedPost(post)
        setOpenModal(true)
        setconfirmDeletePost(false)
        showCommentBox(false)
    }

    // handles select post's card to show comments 
    const handleSelectCardComment = (selectedPost) => {
        console.log("Selected CommentPost:", selectedPost)
        showCommentBox(!commentBox)
    }

    // handles select post to show comment
    const handleSelectComment = (selectedcomment) => {
        console.log("Selected Comment:", selectedcomment)
        setSelectedComment(selectedcomment)
        setShowReplyBox(!showReplyBox)
    }

    // handle edit for post
    const handleEdit = (postId) => {
        navigate(`/editpost/${postId}`)
    }

    // handle delete  post
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

            // delete posts in user's account
            const response = await fetch(`https://meetmycar.onrender.com/users/update?userfb=${encodeURIComponent(firebaseUID)}`, {
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

            // delete posts in Post database
            const deletePost_response = await fetch(`https://meetmycar.onrender.com/posts/delete?postId=${encodeURIComponent(postId)}`, {
                method: 'DELETE',
            });

            if(!deletePost_response.ok){
                const errorData = await response.json()
                setError("Failed To Delete Post")
                console.error("Error Deleting Post: On Post Server", error)
                throw new Error(errorData.message)
            }

            // removes superfuel points for user
            const userSFResponse = await fetch(`https://meetmycar.onrender.com/users/update?userfb=${encodeURIComponent(firebaseUID)}`, {
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

    // fetches current user's followings
    useEffect(() => {
        function fetchCurrentUserFollowing(){
            try{
                setError('')
                const isFollowing = currentUserFollowing.some((followingUser) => followingUser.followeringId === userId)
                console.log("Is Following:", isFollowing)
                // check if following, and shows follow/unfollow button
                if(isFollowing){
                    setFollowbtn(false)
                }
            }catch (error){
                console.error("Error Checking if Following:", error)
                setError("Failed to check if user is following")
            }
        }
        fetchCurrentUserFollowing()
    }, [currentUserFollowing, userId, refreshData])

    // handles follow
    async function handleFollow(userIDFollow, userNameFollow){

        setLoading(true)
        setError('')
        setMessage('')

        try{
            const firebaseUID = currentUser.uid;

            // adds profile's user as followering to current user
            const response = await fetch(`https://meetmycar.onrender.com/users/update?userfb=${encodeURIComponent(firebaseUID)}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({followeringId: userIDFollow, followeringName: userNameFollow})
            });

            if (!response.ok){
                const errorData = await response.json()
                setError("Failed To Follow Account")
                console.error("Error Following Account:", error)
                throw new Error(errorData.message)  
            }

            // adds current's user as follower to profile user
            const Followersresponse = await fetch(`https://meetmycar.onrender.com/users/update?userid=${encodeURIComponent(userIDFollow)}`, {
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

            // renders follow list and shows unfollow button
            setRefreshData(!refreshData)
            setFollowbtn(false)

        }catch (error){
            console.error("Error Following Account:", error)
            setError("Failed To Follow Account")
        }finally{
            setLoading(false)
        }
    }

    // handles unfollow
    async function handleUnfollow(userIDFollow){

        setLoading(true)
        setError('')
        setMessage('')

        try{
            const firebaseUID = currentUser.uid;

            // remove profile's user as followering to current user
            const response = await fetch(`https://meetmycar.onrender.com/users/update?userfb=${encodeURIComponent(firebaseUID)}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({followingtoRemove: userIDFollow})
            });

            if (!response.ok){
                const errorData = await response.json()
                setError("Failed To Unfollow Account")
                console.error("Error Unfollowing Account:", error)
                throw new Error(errorData.message)  
            }

            // remove current's user as follower to profile user
            const Followersresponse = await fetch(`https://meetmycar.onrender.com/users/update?userid=${encodeURIComponent(userIDFollow)}`, {
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

            // renders follow list and shows follow button
            setRefreshData(!refreshData)
            setFollowbtn(true)

        }catch (error){
            console.error("Error Unfollowing Account:", error)
            setError("Failed To Unfollow Account")
        }finally{
            setLoading(false)
        }
    }

    // handle like post
    async function handleLike(postId) {
        try{
            setError('')
            setLoading(true)

            // add like to post database
            const response = await fetch(`https://meetmycar.onrender.com/posts/edit?postId=${encodeURIComponent(postId)}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({addUserIdLike: userId})
            });

            if (!response.ok){
                console.error("Error Updating Like Post:")
            }

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
            const response = await fetch(`https://meetmycar.onrender.com/posts/edit?postId=${encodeURIComponent(postId)}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({removeUserIdLike: userId})
            });

            if (!response.ok){
                console.error("Error Updating Like Post:")
            }
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
                const response = await fetch(`https://meetmycar.onrender.com/posts/edit?postId=${encodeURIComponent(postId)}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({commentUser: userId, commentText: commentRef.current.value})
                });

                if (response.ok){
                    console.log("Added Comment Data")
                } else{
                    const errorData = await response.json()
                    console.error("Error Updating Comment Data:", error)
                    throw new Error(errorData.message)
                }
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
            const response = await fetch(`https://meetmycar.onrender.com/posts/edit?postId=${encodeURIComponent(postId)}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({deleteCommentId: commentId})
            });

            if (response.ok){
                console.log("Deleted Comment Data")
            } else{
                const errorData = await response.json()
                console.error("Error Deleting Comment Data:", error)
                throw new Error(errorData.message)
            }
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
                const response = await fetch(`https://meetmycar.onrender.com/posts/edit?postId=${encodeURIComponent(postId)}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({commentId: commentId, replyUser: userId, replyText: replyRef.current.value})
                });

                if (response.ok){
                    console.log("Added Reply Data")
                } else{
                    const errorData = await response.json()
                    console.error("Error Updating Reply Data:", error)
                    throw new Error(errorData.message)
                }
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
            const response = await fetch(`https://meetmycar.onrender.com/posts/edit?postId=${encodeURIComponent(postId)}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({commentId: commentId, deleteReplyId: replyId})
            });

            if (response.ok){
                console.log("Deleted Reply Data")
            } else{
                const errorData = await response.json()
                console.error("Error Deleting Reply Data:", error)
                throw new Error(errorData.message)
            }
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
            if(currentUserSF > 0){
                // add superfuel to post database
                const response = await fetch(`https://meetmycar.onrender.com/posts/edit?postId=${encodeURIComponent(postId)}`, {
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
                const userResponse = await fetch(`https://meetmycar.onrender.com/users/update?userfb=${encodeURIComponent(firebaseUID)}`, {
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
                const profileResponse = await fetch(`https://meetmycar.onrender.com/users/update?userid=${encodeURIComponent(postUserId)}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({addSuperFuel: +1})
                });

                if (!profileResponse.ok){
                    console.error("Error Updating Profile's SuperFuel:")
                }
                
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
            const response = await fetch(`https://meetmycar.onrender.com/posts/edit?postId=${encodeURIComponent(postId)}`, {
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
            const userResponse = await fetch(`https://meetmycar.onrender.com/users/update?userfb=${encodeURIComponent(firebaseUID)}`, {
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
            const profileResponse = await fetch(`https://meetmycar.onrender.com/users/update?userid=${encodeURIComponent(postUserId)}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({removeSuperFuel: -1})
            });

            if (!profileResponse.ok){
                console.error("Error Updating Profile's SuperFuel:")
            }
            console.log("Updated SuperFuel Post")
        }catch (error){
            console.error("Error Updating SuperFuel Post:")
            setError("Error Updating SuperFuel For Post. Try Again Later")
        }
        setLoading(false)
    }

    return (
        <>
            <div className='showProfile'>        
                <header className='profileHeader'>
                    <div className='showUserDetails'>
                        <div className='userRow'>
                            {profilePicture && (
                                <img className='showUserImage'
                                    src={profilePicture} 
                                    alt="Profile"
                                />
                            )}
                            <p className='showUserName'>{username}</p>
                        </div>

                        {/* check if profile account is current user's account */}
                        {currentUserId === userId ? (
                            <>
                            </>
                        ) : (
                            <>
                                {/* check if account is being followed by current user, and shows follow/unfollow button */}
                                {showfollowbtn ? (
                                    <>
                                        <button className='btn btn-dark' id='followbtn' onClick={() => handleFollow(userId, username)}> Follow</button>
                                    </>
                                ) : (
                                    <>
                                        <button className='btn btn-dark' id='followbtn' onClick={() => handleUnfollow(userId, username)}> Unfollow</button>
                                    </>
                                )}
                            </>
                        )}
                    </div>

                    {/* display num of superfuels, followers and followerings */}
                    <div className='showUserData'>
                        <p className='superFuelData'><span>{profileSF} Super Fuel</span> <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24"><path fill="currentColor" d="M18 10a1 1 0 0 1-1-1a1 1 0 0 1 1-1a1 1 0 0 1 1 1a1 1 0 0 1-1 1m-6 0H6V5h6m7.77 2.23l.01-.01l-3.72-3.72L15 4.56l2.11 2.11C16.17 7 15.5 7.93 15.5 9a2.5 2.5 0 0 0 2.5 2.5c.36 0 .69-.08 1-.21v7.21a1 1 0 0 1-1 1a1 1 0 0 1-1-1V14a2 2 0 0 0-2-2h-1V5a2 2 0 0 0-2-2H6c-1.11 0-2 .89-2 2v16h10v-7.5h1.5v5A2.5 2.5 0 0 0 18 21a2.5 2.5 0 0 0 2.5-2.5V9c0-.69-.28-1.32-.73-1.77"/></svg></p>
                        <div className='showUserDataNum'>
                            <p> <span>{posts.length}</span> Posts</p>
                            {/* shows name of followers and followerings in modal */}
                            <p onClick={() => setOpenFollowerModal(true)}> <span>{followers.length}</span> Followers</p>
                            <p onClick={() => setOpenFollowingModal(true)}> <span>{following.length}</span> Following</p>
                        </div>

                        {/* check if followed and shows check garage button */}
                        {currentUserId === userId ? (
                            <>
                                <Link to={`/garage/${userId}`} className="btn btn-dark" id='checkbtn'> Check Garage</Link>
                            </>
                        ) : (
                            <>
                                {showfollowbtn ? (
                                    <></>
                                ) : (
                                    <>
                                        <Link to={`/garage/${userId}`} className="btn btn-dark" id='checkbtn'> Check Garage</Link>
                                    </>
                            )}
                            </>
                        )}
                        
                    </div>

                </header>

                {/* if own account and there are user being recommended, it will show the users */}
                {openUserRecommend && currentUserId === userId  && allUser.length > 0? (
                    <>
                    <div className='userRecommendation'>
                        {dropdown ? (
                            <>
                                <div className='userHeader'>
                                    <h5>Drivers You May Know</h5>
                                    <button className='drop-down-btn' onClick={() => setDropDown(!dropdown)}><svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24"><path fill="black" fill-rule="evenodd" d="M11.512 8.43a.75.75 0 0 1 .976 0l7 6a.75.75 0 1 1-.976 1.14L12 9.987l-6.512 5.581a.75.75 0 1 1-.976-1.138z" clip-rule="evenodd"/></svg></button>
                                </div>

                                {/* shows all recommended user in cards */}
                                {allUser.map((users, index) => (
                                    <div key={index}  className='userRow'>
                                        <div className='userCard'>
                                            <Link to={`/profile/${users._id}`} className='userLink'>
                                                <p className='userCardHeading'>{users.username}</p>
                                                {profilePicture && (
                                                    <img className='userCardImage'
                                                        src={users.profilePicture} 
                                                        alt="Profile"
                                                    />
                                                )}
                                            </Link>
                                            {followBtnCard ? (
                                                <>
                                                    <button className='btn btn-outline-dark' id='userCardFollow' onClick={() => handleFollow(users._id, users.username) && showFollowBtnCard(false)}>Follow</button>
                                                </>
                                            ) : (
                                                <>
                                                    <button className='btn btn-outline-dark' id='userCardUnFollow' onClick={() => handleUnfollow(users._id, users.username) && showFollowBtnCard(true)}>Unfollow</button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </>
                        ) : (
                            <>
                                <div className='userHeader'>
                                    <h5>Drivers You May Know</h5>
                                    <button className='drop-down-btn' onClick={() => setDropDown(!dropdown)}><svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24"><path fill="none" stroke="black" stroke-linecap="round" stroke-linejoin="round" d="m7 10l5 5l5-5"/></svg></button>
                                </div>
                            </>
                        )}
                    </div> 
                    {/* add a line */}
                    <div className='line'></div>
                    </>
                ) : (
                    <>
                    </>
                )}  


                <p className="w-100 text-center mt-3 mb-1" id="success_Msg">{message}</p>
                <p className="w-100 text-center mt-3 mb-1" id="error_Msg">{error}</p>
                
                {/* checks if user is valid */}
                {userId ?(
                    <>
                        {/* displays no post message, depending on ownership of account */}
                        {posts.length === 0 ? (
                        <>
                            {currentUserId === userId ? (
                                <>
                                    <p className="w-100 text-center mt-3 mb-1" id="success_Msg">No Posts! Share Your Experiences To The World.</p>
                                    <Link to={`/addpost`} className="btn btn-dark" id='addPostbtn'> Add Post</Link>
                                </>
                            ): (
                                <>
                                    <p className="w-100 text-center mt-3 mb-1" id="success_Msg">No Posts! Tell Your Friend To Share Their Experiences.</p>
                                </>
                            )}
                        </>
                        ):(
                            <>
                            </>
                        )}
                    </>
                ):(
                    <>
                        <p className="w-100 text-center mt-3 mb-1" id="error_Msg">User Not Found</p>
                    </>
                )}

                {/* displays all post as cards */}
                <div className='Card_Post'>
                    {posts.map((post, index) => (
                        <div key={index}  className='postCard' onClick={() => handleSelectCard(post)}>
                                <div className='cardPostImage'>
                                    {/* display first image */}
                                    <img src={post?.postData?.image[0]} alt={post?.postData?.title}/> 
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

                {/* open post in modal */}
                <Popup open={openModal} 
                        verlayStyle={{
                            background: 'rgba(0, 0, 0, 0.05)', 
                            transition: 'background 0.5s ease-in-out',
                        }}
                        closeOnDocumentClick={false}
                        onClose={() => setOpenModal(false)} className='Popup'
                >
                    <div className='Modal'>
                        <button className='closeButton' onClick={() => setOpenModal(false)}>
                            <span>&times;</span>
                        </button>

                        {selectedPost ? (
                            <>
                                <div className='modalHeader'>
                                    <div>
                                        <h3>{selectedPost.postData?.title}</h3>
                                        {/* displays the vrn and button to race/compare */}
                                        <Link className='postVRN' to={`/race/${userId}`}>{selectedPost?.postData?.vehicles?.vrn}</Link>
                                    </div>
                                </div> 

                                {/* displays the post's image */}
                                <div className='modalPostImage'>
                                    <ImageGallery
                                        items={selectedPost?.postData?.image.map (imageurl => ({
                                            original: imageurl
                                        }))}
                                        showPlayButton={false}
                                        showFullscreenButton={false}
                                        showNav={false}
                                        showBullets={true}
                                        autoPlay={true}
                                        infinite={true}
                                        slideInterval={5000}
                                    />
                                </div>

                                {/* displays the post's description */}
                                <div className='modalDesc'>
                                    <p>{selectedPost?.postData?.description}</p>
                                </div>

                                {/* displays the post's engagement buttons */}
                                <div className='selectedpostEngagement'>
                                    <div className='engagementColumn'>
                                        {/* check if post has been liked by current user, and shows like/unlike button */}
                                        {selectedPost?.postData.likes.some((likedUser) => likedUser.userId === userId) ? (
                                                <>
                                                    <button className='unlikebtn' disabled={loading} onClick={() => handleUnLike(selectedPost?.postData._id)}><svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 26 26"><path d="M17.869 3.889c-2.096 0-3.887 1.494-4.871 2.524c-.984-1.03-2.771-2.524-4.866-2.524C4.521 3.889 2 6.406 2 10.009c0 3.97 3.131 6.536 6.16 9.018c1.43 1.173 2.91 2.385 4.045 3.729c.191.225.471.355.765.355h.058c.295 0 .574-.131.764-.355c1.137-1.344 2.616-2.557 4.047-3.729C20.867 16.546 24 13.98 24 10.009c0-3.603-2.521-6.12-6.131-6.12"/></svg></button>
                                                </>
                                            ) : (
                                                <>
                                                    <button className='likebtn' disabled={loading} onClick={() => handleLike(selectedPost?.postData._id)}><svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 26 26"><path d="M17.869 3.889c-2.096 0-3.887 1.494-4.871 2.524c-.984-1.03-2.771-2.524-4.866-2.524C4.521 3.889 2 6.406 2 10.009c0 3.97 3.131 6.536 6.16 9.018c1.43 1.173 2.91 2.385 4.045 3.729c.191.225.471.355.765.355h.058c.295 0 .574-.131.764-.355c1.137-1.344 2.616-2.557 4.047-3.729C20.867 16.546 24 13.98 24 10.009c0-3.603-2.521-6.12-6.131-6.12"/></svg></button>
                                                </>
                                        )}
                                        <h3>{selectedPost?.postData.likes.length} LIKE</h3>

                                    </div>

                                    {/* shows comment button */}
                                    <div className='engagementColumn'>
                                        <button className='commentbtn' onClick={() => handleSelectCardComment(selectedPost)}><svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M3 10.4c0-2.24 0-3.36.436-4.216a4 4 0 0 1 1.748-1.748C6.04 4 7.16 4 9.4 4h5.2c2.24 0 3.36 0 4.216.436a4 4 0 0 1 1.748 1.748C21 7.04 21 8.16 21 10.4v1.2c0 2.24 0 3.36-.436 4.216a4 4 0 0 1-1.748 1.748C17.96 18 16.84 18 14.6 18H7.414a1 1 0 0 0-.707.293l-2 2c-.63.63-1.707.184-1.707-.707V13zM9 8a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2zm0 4a1 1 0 1 0 0 2h3a1 1 0 1 0 0-2z" clip-rule="evenodd"/></svg></button>
                                        <h3>{selectedPost?.postData.comments.length} Comment</h3>
                                    </div>

                                    {/* check if post has been superfuelled by current user, and shows superfuel/unsuperfuel button */}
                                    <div className='engagementColumn'>
                                        {selectedPost?.postData.superfuel.some((superFuelUser) => superFuelUser.userId === userId) ? (
                                                <>
                                                    <button className='unsuperfuel' disabled={loading} onClick={() => handleUnSuperFuel(selectedPost?.postData._id, selectedPost?.postData.user._id)}><svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 16 16"><path d="M1 2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v8a2 2 0 0 1 2 2v.5a.5.5 0 0 0 1 0V8h-.5a.5.5 0 0 1-.5-.5V4.375a.5.5 0 0 1 .5-.5h1.495c-.011-.476-.053-.894-.201-1.222a.97.97 0 0 0-.394-.458c-.184-.11-.464-.195-.9-.195a.5.5 0 0 1 0-1q.846-.002 1.412.336c.383.228.634.551.794.907c.295.655.294 1.465.294 2.081V7.5a.5.5 0 0 1-.5.5H15v4.5a1.5 1.5 0 0 1-3 0V12a1 1 0 0 0-1-1v4h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1zm2.5 0a.5.5 0 0 0-.5.5v5a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 .5-.5v-5a.5.5 0 0 0-.5-.5z"/></svg></button>
                                                </>
                                            ) : (
                                                <>
                                                    <button className='superfuel' disabled={loading} onClick={() => handleSuperFuel(selectedPost?.postData._id, selectedPost?.postData.user._id)}><svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 16 16"><path d="M1 2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v8a2 2 0 0 1 2 2v.5a.5.5 0 0 0 1 0V8h-.5a.5.5 0 0 1-.5-.5V4.375a.5.5 0 0 1 .5-.5h1.495c-.011-.476-.053-.894-.201-1.222a.97.97 0 0 0-.394-.458c-.184-.11-.464-.195-.9-.195a.5.5 0 0 1 0-1q.846-.002 1.412.336c.383.228.634.551.794.907c.295.655.294 1.465.294 2.081V7.5a.5.5 0 0 1-.5.5H15v4.5a1.5 1.5 0 0 1-3 0V12a1 1 0 0 0-1-1v4h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1zm2.5 0a.5.5 0 0 0-.5.5v5a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 .5-.5v-5a.5.5 0 0 0-.5-.5z"/></svg></button>
                                                </>
                                        )}
                                        <h3>{selectedPost?.postData.superfuel.length} Superfuel</h3>
                                    </div>
                                </div>
                                
                                {/* display comment's box */}
                                {commentBox ? (
                                    <>
                                        <div className='commentBox' id='commentProfileModal'>
                                            <button className='closeButton' onClick={() => showCommentBox(false)}>
                                                <span>&times;</span>
                                            </button>
                                        
                                            {selectedPost ? (
                                                <>
                                                    <div className='modalCommentHeader'>
                                                        <h3>Comments</h3>
                                                    </div> 

                                                    <p className="w-100 text-center mt-2 mb-0" id="error_Msg">{commentError}</p>

                                                    {/* shows comments for each post */}
                                                    <div className='modalCommentBody'>
                                                        {selectedPost.postData.comments?.map((postComment) => (
                                                            <div key={postComment._id} className='comments'>
                                                                <div className='commentTop'>
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

                                                                {/* shows replies for each comment */}
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
                                                                                {/* check if reply belongs to user, and shows delete button */}
                                                                                {postReply.userID._id === userId? (
                                                                                    <>
                                                                                        <button className='deletereplybtn' disabled={loading} onClick={() => handleDeleteReply(selectedPost.postData._id, postComment._id, postReply._id)}> Delete Reply</button>
                                                                                    </>
                                                                                ) : (
                                                                                    <>
                                                                                    </>
                                                                                )}
                                                                            </div>

                                                                            
                                                                        </div>
                                                                    </div>
                                                                ))}

                                                                <div className='commentBottom'>
                                                                    <button className='replybtn' disabled={loading} onClick={() => handleSelectComment(postComment._id)}>Reply</button>
                                                                    {postComment.userID._id === userId? (
                                                                        <>
                                                                            <button className='deletereplybtn' disabled={loading} onClick={() => handleDeleteComment(selectedPost.postData._id, postComment._id)}>Delete</button>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                        </>
                                                                    )}
                                                                </div>

                                                                {/* check selected comment and shows reply button */}
                                                                {showReplyBox && selectedComment === postComment._id ?(
                                                                    <>
                                                                        <div className='modalCommentButton'>
                                                                            <input type='text' ref={replyRef} placeholder="Reply..." className='commentText' id='commentProfileText' required></input>
                                                                            <button className='btn btn-dark' id='commentProfileBtn' disabled={loading} onClick={() => handleaddReply(selectedPost.postData._id, postComment._id)}>Add Reply</button>
                                                                        </div>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                    </>
                                                                )}

                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div className='modalCommentButton'>
                                                        <input type='text' ref={commentRef} placeholder="Comment..." className='commentText' id='commentProfileText' required></input>
                                                        <button className='btn btn-dark' id='commentProfileBtn' disabled={loading} onClick={() => handleaddComment(selectedPost.postData._id)}>Add Comment</button>
                                                    </div>
                                                </>
                                            ) : <p>Loading....</p>}
                                        </div>

                                    </>
                                ):(
                                    <>
                                    </>
                                )}

                                {/* checks if post belongs to current user and displays edit/delete button */}
                                {currentUserId === userId ? (
                                    <>
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
                                ) : (
                                    <>
                                    </>
                                )}

                            </>
                        ) : <p>Loading....</p>}
                    </div>
                </Popup>

                {/* modal for followers list */}
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
                                {/* displays all followers name */}
                                {followers.map((followers, index) => (
                                    <div key={index} >
                                        <p>{followers.followerName}</p>
                                    </div>
                                ))}
                            </div>
                        </>
                    </div>
                </Popup>

                {/* modal for followering list */}
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
                                {/* displays all following name */}
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