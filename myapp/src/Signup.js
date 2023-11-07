import React, {useRef, useState} from 'react'
import {Form, Button} from 'react-bootstrap'
import { useAuth } from './AuthContext'
import {Link, useNavigate} from 'react-router-dom'

import './Signup_css.css'



const Signup = () => {

    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const {signup} = useAuth()
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()



    async function handleSubmit(e){
        e.preventDefault()

        if (passwordRef.current.value !== passwordConfirmRef.current.value){
            return setError("Password do not match")
        }
        if (passwordRef.current.value.length < 6 && passwordConfirmRef.current.value.length < 6 ){
            return setError("Password Too Short")
        }
        try{
            setError('')
            await signup(emailRef.current.value, passwordRef.current.value)
            navigate("/")
        }catch{
            setError("Failed To Create Account")
        }
        setLoading(false) 
    }


  return (
      <>
            <div className="Card">
                
                <header>
                    <h1 className="text-center mb-4" id="sign_text">Sign Up</h1>
                    <div id="red-corner"></div>
                </header>
                <form onSubmit={handleSubmit}>

                    <div className='name_row'>
                        <Form.Group id="firstName">
                            <Form.Control id="name_input" type="text" placeholder='First Name' ref={emailRef} required />
                        </Form.Group>

                        <Form.Group id="lastName" >
                            <Form.Control id="name_input" type="text" placeholder='Last Name' ref={emailRef} required />
                        </Form.Group>

                    </div>
                    
                        

                    <Form.Group id="email">
                        <Form.Control type="email" placeholder='Email'ref={emailRef} required />
                    </Form.Group>            
                    
                    <Form.Group id="password">
                        <Form.Control type="password" placeholder='Password'ref={passwordRef} required />
                    </Form.Group>

                    <Form.Group id="passwordConfirmation">
                        <Form.Control type="password" placeholder='Password Confirmation'ref={passwordConfirmRef} required />
                    </Form.Group>

                    <p>{error}</p>

                    <Button disabled={loading} id="button" className="w-100 mt-2" type="submit">Sign Up</Button>
                        

                    {message}
                </form>

                <img src="https://i.ibb.co/FsSc9k1/Screenshot-2023-11-07-at-18-34-47-fotor-bg-remover-20231107185715.png" alt="Image Of Porsche Car"/>
                
                <div id="loginpage" className="w-100 text-center mt-2">
                    Already have an account? <Link to="/login">  Login</Link>
                </div>

            </div>



            
        
      </>
    
  )
}

export default Signup

