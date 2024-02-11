import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'

import './SeePost_css.css'

const SeePost = () => {

    const[posts, setPosts] = useState([])

    const[menuoptions, setMenuOptions] = useState(false)
    const[confirmDeletePost, setconfirmDeletePost] = useState(false)

    const[message, setMessage] = useState('')
    const[error, setError] = useState('')
    const[nopost, setNoPost] = useState('')
    const[loading, setLoading] = useState('')


    useEffect(() => {
        async function fetchPostData(){
            try{
                setError('')
                setMessage('')
                const response = await fetch(`http://localhost:3001/posts/view`, {
                    method: 'GET',
                    headers: {
                        'accept': 'application/json',
                    },
                });

                if (response.ok){
                    const data = await response.json()

                    const vehiclePost = await Promise.all(data.postData.map(async (post) => {
                        if(post.vehicles?.vehicleId){
                            const VehicleReponse = await fetch(`http://localhost:3001/vehicles/view?vehicleId=${encodeURIComponent(post.vehicles.vehicleId)}`, {
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
                    console.log("Fetched Post Details")

                    if(!vehiclePost || vehiclePost === 0){
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
    }, []);

    const formatDate = (timestamps) => {
        const date = new Date(timestamps);
        return date.toLocaleDateString()
    }
    const formatTime = (timestamps) => {
        const time = new Date(timestamps);
        return time.toLocaleTimeString()
    }

    const handleShowOptions = () =>{
        setMenuOptions(!menuoptions)
        setconfirmDeletePost(false)
    }

    const handleShowDelete = () => {
        setconfirmDeletePost(!confirmDeletePost)
    }

    async function handleDelete(postId) {
        try{
            setError('')
            setMessage('')
            setLoading(true)

            const response = await fetch(`http://localhost:3001/posts/delete?postId=${encodeURIComponent(postId)}`, {
                method: 'DELETE',
            });

            if (response.ok){
                console.log("Deleted Post")
                setMessage("Post Deleted")
                setTimeout(() => {
                    window.location.reload(false);
                }, 2000)
            } else{
                console.error("Error Deleting Post:")
            }
        }catch (error){
            console.error("Error Deleting Post:")
            setError("Error Deleting Post. Try Again Later")
        }
        setLoading(false)
    }

    return (
        <>
            <p className="w-100 text-center mt-2 mb-0" id="error_Msg">{nopost}</p>

            <div className="postList">
                {posts.map((post) => (
                    <div key={post._id}  className='post'>
                    <p className="w-100 text-center mt-2 mb-0" id="error_Msg">{error}</p>
                    <p className="w-100 text-center mt-2 mb-0" id="success_Msg">{message}</p>

                        <div className='postHead'>
                            <div className='postUserDetails'>
                                {post.user?.profilePicture && (
                                    <img className='postUserImage'
                                        src={`http://localhost:3001/${post.user.profilePicture}`} 
                                        alt="Profile"
                                    />
                                )}                                
                                <p className='postUserName'>{post.user?.username}</p>
                            </div>

                            
                            <div className='postTimeStamp'>
                                <p>{formatDate(post.updatedAt)}</p>
                                <p>{formatTime(post.updatedAt)}</p>

                                <div className='postMenuContainer'>
                                    <button className='postMenu' onClick={handleShowOptions}>
                                        <div className='postdot'></div>
                                        <div className='postdot'></div>
                                        <div className='postdot'></div>
                                    </button>

                                    {menuoptions && (
                                        <div className='postOption'>
                                            <ul>
                                                <li className='menu-item'>
                                                    <Link to={`/editpost/${post._id}`} className='menu-link'>
                                                        Edit Post
                                                    </Link>
                                                </li>
                                                <li className='menu-item'>
                                                    <Link onClick={handleShowDelete} className='menu-link' id='delete-menu-link'>
                                                        Delete Post
                                                    </Link>
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {confirmDeletePost && (
                            <div>
                                <button className="deletepostbtn" disabled={loading} onClick={() => handleDelete(post._id)}>Confirm Delete</button>
                            </div>
                        )}
                        
                        <div className='post-content'>
                            <h2 className='postTitle'>{post.title}</h2> 
                            <img src={`http://localhost:3001/${post.image}`} alt={post.title} className='postImage'/>

                            <div className='postSpecs'>
                                <div className='TopSpecs' style={{background: `conic-gradient(from 0.5turn,red 0% ${((1.5/post.vehicle_Data?.vehicleData.vehicleInfo.Performance.Acceleration.ZeroTo60Mph)*100)}%,white ${0}% 100%)`}}>
                                    <h3>{post.vehicle_Data?.vehicleData.vehicleInfo.Performance.Acceleration.ZeroTo60Mph} 
                                        <span>secs</span>
                                    </h3>
                                    <p className='TopSpecsName'> 0 - 60</p>
                                </div>

                                <div className='TopSpecs' style={{background: `conic-gradient(from 0.5turn,orange 0% ${((post.vehicle_Data?.vehicleData.vehicleInfo.Performance.Power.Bhp/800)*100)}%,white ${0}% 100%)`}}>
                                    <h3>{post.vehicle_Data?.vehicleData.vehicleInfo.Performance.Power.Bhp}
                                        <span>bhp</span>
                                    </h3>
                                    <p className='TopSpecsName'>BHP</p>
                                </div>

                                <div className='TopSpecs' style={{background: `conic-gradient(from 0.5turn,green 0% ${((post.vehicle_Data?.vehicleData.vehicleInfo.Performance.Torque.Nm)/1000)*100}%,white ${0}% 100%)`}}>
                                    <h3>{post.vehicle_Data?.vehicleData.vehicleInfo.Performance.Torque.Nm}
                                        <span>Nm</span>
                                    </h3>
                                    <p className='TopSpecsName'>Torque</p>
                                </div>
                            </div>

                            <div className='postFooter'>
                                <Link className='postVRN'>{post.vehicles?.vrn}</Link>
                                <p className='postDescription'>{post.description}</p> 
                            </div> 
                        </div> 
                        
                    </div>
                ))}
            </div>    
        </>
    )
}

export default SeePost
