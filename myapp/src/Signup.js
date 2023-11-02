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
                <h1 className="text-center mb-4">Sign Up</h1>
                <form onSubmit={handleSubmit}>

                    <div className='name_row'>
                        <Form.Group id="firstName">
                            <Form.Label id="name_label">First Name</Form.Label>
                            <Form.Control id="name_input" type="text" ref={emailRef} required />
                        </Form.Group>

                        <Form.Group id="lastName" >
                            <Form.Label id="name_label">Last Name</Form.Label>
                            <Form.Control id="name_input" type="text" ref={emailRef} required />
                        </Form.Group>

                    </div>
                    
                        

                    <Form.Group id="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" ref={emailRef} required />
                    </Form.Group>            
                    
                    <Form.Group id="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" ref={passwordRef} required />
                    </Form.Group>

                    <Form.Group id="passwordConfirmation">
                        <Form.Label>Password Confirmation</Form.Label>
                        <Form.Control type="password" ref={passwordConfirmRef} required />
                    </Form.Group>

                    <p>{error}</p>

                    <Button disabled={loading} className="w-100 mt-2" type="submit">Sign Up</Button>

                    {message}
                </form>

            </div>

            
        <div className="w-100 text-center mt-2">
            Already have an account? <Link to="/login">  Login</Link>
        </div>
      </>
    
  )
}

export default Signup

