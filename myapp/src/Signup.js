import React, {useRef, useState} from 'react'
import {Form} from 'react-bootstrap'
import { useAuth } from './AuthContext'
import {Link, useNavigate} from 'react-router-dom'

import './Signup_css.css'

const Signup = () => {

    const firstNameRef = useRef()
    const lastNameRef = useRef()
    const userNameRef = useRef()
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const profilePictureRef = useRef()

    const {signup} = useAuth()

    const [error, setError] = useState('')
    const [message] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()


    async function handleSubmit(e){
        e.preventDefault()
        
        if (firstNameRef.current.value.length < 2){
             return setError("Firstname Minimum Length (2)")
        }

        if (lastNameRef.current.value.length < 2){
            return setError("Lastname Minimum Length (2)")
        }

        if (userNameRef.current.value.length < 2){
            return setError("Username Minimum Length (2)")
        }

        if (userNameRef.current.value.length > 20){
            return setError("Username Maximum Length (20)")
        }

        if (passwordRef.current.value !== passwordConfirmRef.current.value){
            return setError("Password Not The Same")
        }

        if (passwordRef.current.value.length < 6 && passwordConfirmRef.current.value.length < 6 ){
            return setError("Password Really Short")
        }

        const formData = new FormData();
        formData.append('firstname', firstNameRef.current.value)
        formData.append('lastname', lastNameRef.current.value)
        formData.append('username', userNameRef.current.value)
        formData.append('email', emailRef.current.value)
        formData.append('profilePicture', profilePictureRef.current.files[0])

        try{
            setError('')
            const {user} = await signup(emailRef.current.value, passwordRef.current.value)
            await user.sendEmailVerification();

            const firebaseUID = user.uid;
            formData.append('user_fbId', firebaseUID)

            const response = await fetch('http://localhost:3001/users/register', {
                method: 'POST',
                body: formData,
            });

            if (response.ok){
                const data = await response.json()
                console.log("Created User Account Successful")
                navigate("/verify")
                return data
            } else{
                const errorData = await response.json()
                if (errorData.message === 'Username Already Taken'){
                    return setError("Username Already in Use")
                }else{
                    throw new Error(errorData.message)
                }
            }
        }catch (error){
            console.error("Error Signing Up:", error)
            if (error.code === 'auth/email-already-in-use'){
                setError("Email Already In Use")
            } else if (error.code === 'auth/invalid-email'){
                setError("Invalid Email Address")
            }else{
                setError("Failed To Create Account")
            }
        }
        setLoading(false) 
    }


  return (
      <>
        <div className="Card">
            
            <header>
                <h1 id="sign_text">
                    Sign Up
                    <p id="slogan_text">Join Our Family</p>
                </h1>
            </header>

            <form onSubmit={handleSubmit} className='signUpForm'>

                <div className='name_row'>
                    <Form.Group id="firstName">
                        <Form.Control id="name_input" type="text" placeholder='First Name' ref={firstNameRef} required />
                    </Form.Group>

                    <Form.Group id="lastName" >
                        <Form.Control id="name_input" type="text" placeholder='Last Name' ref={lastNameRef} required />
                    </Form.Group>
                </div>

                <Form.Group id="userName">
                    <Form.Control type="text" placeholder='Username'ref={userNameRef} required />
                </Form.Group>     

                <Form.Group id="email">
                    <Form.Control type="email" placeholder='Email'ref={emailRef} required />
                </Form.Group>            
                
                <Form.Group id="password">
                    <Form.Control type="password" placeholder='Password'ref={passwordRef} required />
                </Form.Group>

                <Form.Group id="passwordConfirmation">
                    <Form.Control type="password" placeholder='Password Confirmation'ref={passwordConfirmRef} required />
                </Form.Group>

                <Form.Group id="profilePicture">
                    <Form.Label>Profile Picture</Form.Label>
                    <Form.Control type="file"placeholder='Profile Picture' ref={profilePictureRef} accept="image/*" />
                </Form.Group>

                <p className="w-100 text-center mt-3 mb-1" id="error_Msg">{error}</p>

                <button disabled={loading} id="button" className="w-100 mt-2" type="submit">Sign Up</button>
                    
                <p className="w-100 text-center mt-3 mb-1" id="success_Msg">{message}</p>
            </form>

            
            <div id="loginpage" className="w-100 text-center mt-2">
                Already have an account? <Link to="/login" id='loginlink'> Login Here</Link>
            </div>

        </div>
        
      </>
    
  )
}

export default Signup

