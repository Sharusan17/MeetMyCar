import React, {useState, useRef} from 'react'
import {Form} from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';

import './SeePost_css.css'

const AutoPlaySwipeableViews = autoPlay(SwipeableViews)

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

    const [index, setIndex] = useState(0)

    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

    const {currentUser} = useAuth()
    const navigate= useNavigate()

    const[posts, setPosts] = useState([
        {id:1, heading: 'Post 1', user:'Sharusan', image:`http://localhost:3001/uploads/3f736944d3729d94506db63f9b3f6335`, description: 'Description 1'},
        {id:2, heading: 'Post 2', user:'Mate', image:'/uploads', description: 'Description 2'}

    ])

    
    const handleNextPost = (index) => {
        setIndex(index)
    }

    async function handleAddPost(){
        
    }

    return (
        <>
            <div className="Card">
                <header>
                    <div id="red-corner"></div>
                </header>

                <AutoPlaySwipeableViews index={index} onChangeIndex={handleNextPost} interval={20000} enableMouseEvents className='postParent'>
                    {posts.map((post, index) => (
                        <div key={post.id} className='post' style={{backgroundImage: `url(${post.image})` }}>
                            <div className='post-content'>
                                <h3 id='postUser'>{post.user}</h3>
                                <h2 id='postHeading'>{post.heading}</h2> 
                                <p id='postDescription'>{post.description}</p> 
                            </div> 
                        </div>
                    ))}
                </AutoPlaySwipeableViews>
            
            </div>
        </>
    )
}

export default SeePost
