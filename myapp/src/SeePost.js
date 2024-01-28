import React, {useState, useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom'

import './SeePost_css.css'

const SeePost = () => {

    const navigate = useNavigate()
    const[posts, setPosts] = useState([])

    useEffect(() => {
        async function fetchPostData(){
            try{
                const response = await fetch(`http://localhost:3001/posts/view`, {
                    method: 'GET',
                    headers: {
                        'accept': 'application/json',
                    },
                });

                if (response.ok){
                    const data = await response.json()

                    setPosts(data.postData)

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

    const formatDate = (timestamps) => {
        const date = new Date(timestamps);
        return date.toLocaleDateString()
    }
    const formatTime = (timestamps) => {
        const time = new Date(timestamps);
        return time.toLocaleTimeString()
    }
 

    return (
        <>
            <div className="postList">
                {posts.map((post) => (
                    <div key={post._id}  className='post'>
                        <div className='postHead'>
                            <div className='postUserDetails'>
                                {post.user.profilePicture && (
                                    <img className='postUserImage'
                                        src={`http://localhost:3001/${post.user.profilePicture}`} 
                                        alt="Profile"
                                    />
                                )}                                
                                <p className='postUserName'>{post.user.username}</p>
                            </div>
                            <div className='postTimeStamp'>
                                <p>{formatDate(post.updatedAt)}</p>
                                <p>{formatTime(post.updatedAt)}</p>
                            </div>
                        </div>
                        
                        <div className='post-content'>
                            <h2 className='postTitle'>{post.title}</h2> 
                            <img src={`http://localhost:3001/${post.image}`} alt={post.title} className='postImage'/>

                            <div className='postSpecs'>
                                <div className='TopSpecs' style={{background: `conic-gradient(from 0.5turn,red 0% ${((1.5/post.speedtime)*100)}%,white ${0}% 100%)`}}>
                                    <h3>{post.speedtime} 
                                        <span>secs</span>
                                    </h3>
                                    <p className='TopSpecsName'> 0 - 60</p>
                                </div>

                                <div className='TopSpecs' style={{background: `conic-gradient(from 0.5turn,orange 0% ${((post.bhp/1000)*100)}%,white ${0}% 100%)`}}>
                                    <h3>{post.bhp}
                                        <span>bhp</span>
                                    </h3>
                                    <p className='TopSpecsName'>BHP</p>
                                </div>

                                <div className='TopSpecs' style={{background: `conic-gradient(from 0.5turn,green 0% ${post.torque}%,white ${100-post.torque}% 100%)`}}>
                                    <h3>{post.torque}
                                        <span>Nm</span>
                                    </h3>
                                    <p className='TopSpecsName'>Torque</p>
                                </div>
                            </div>

                            <div className='postFooter'>
                                <Link className='postVRN'>{post.vrn}</Link>
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
