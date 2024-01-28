import React, {useState, useRef} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

import './SeePost_css.css'

const SeePost = () => {

    const headingRef = useRef()
    const imageRef = useRef()
    const descriptionRef = useRef()
    const commentsRef = useRef()

    const [heading, setHeading] = useState('')
    const [image, setImage] = useState('')
    const [description, setDescription] = useState('')
    const [userId, setUserId] = useState('')
    const [vehicles, setVehicles] = useState([])
    const [comments, setComments] = useState('')

    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

    const {currentUser} = useAuth()
    const navigate= useNavigate()

    const[posts, setPosts] = useState([
        {id:1, title: 'Porsche 911 GB', user:'Sharusan', profilePicture:'http://localhost:3001/uploads/3f736944d3729d94506db63f9b3f6335', image:`http://localhost:3001/uploads/b9453f083d3aaf3f3826875e2742faad`, description: 'Check My Car Fastest Car In The World', date:'26/01/24', time:'18:00', vrn:'EA64 SYJ'},
        {id:2, title: 'Post 2', user:'Mate', image:'/uploads', description: 'Description 2'},
        {id:2, title: 'Post 2', user:'Mate', image:'/uploads', description: 'Description 2'},
        {id:2, title: 'Post 2', user:'Mate', image:'/uploads', description: 'Description 2'},
        {id:2, title: 'Post 2', user:'Mate', image:'/uploads', description: 'Description 2'},
    ])

    async function handleAddPost(){
        
    }

    return (
        <>
            <div className="postList">
                {posts.map((post) => (
                    <div key={post.id} className='post'>
                        <div className='postHead'>
                            <div className='postUserDetails'>
                                {post.profilePicture && (
                                    <img className='postUserImage'
                                        src={post.profilePicture} 
                                        alt="Profile"
                                    />
                                )}                                
                                <p className='postUserName'>{post.user}</p>
                            </div>
                            <div className='postTimeStamp'>
                                <p>{post.date}</p>
                                <p>{post.time}</p>
                            </div>
                        </div>
                        
                        <div className='post-content'>
                            <h2 className='postTitle'>{post.title}</h2> 
                            <img src={post.image} alt={post.title} className='postImage'/>
                            <div className='postSpecs'>
                                <div>
                                    {/* Top Speed, BHP, Torque */}
                                    {/* Red, Green, Yellow */}
                                    {/* add image with number */}
                                    <p className='postSpecsName'></p>
                                </div>
                                
                                
                            </div>
                            <div className='postFooter'>
                                <Link className='postVRN'>{post.vrn}</Link>
                                <p className='postDescription'>{post.description}</p> 
                            </div> 
                        </div> 
                    </div>
                ))}
                    <p>{error}</p>
            </div>    

        </>
    )
}

export default SeePost
