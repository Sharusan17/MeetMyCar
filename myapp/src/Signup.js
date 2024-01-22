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

        const userData = {
            firstname: firstNameRef.current.value,
            lastname: lastNameRef.current.value,
            username: userNameRef.current.value,
            email: emailRef.current.value,
        }

        try{
            setError('')
            const {user} = await signup(emailRef.current.value, passwordRef.current.value)

            const firebaseUID = user.uid;

            const response = await fetch('http://localhost:3001/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...userData, user_fbId: firebaseUID }),
            });

            if (response.ok){
                const data = await response.json()
                console.log("Created User Account Successful")
                navigate("/registervehicle")
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
                <div id="red-corner"></div>
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

                <p className="w-100 text-center mt-3 mb-1" id="error_Msg">{error}</p>

                <button disabled={loading} id="button" className="w-100 mt-2" type="submit">Sign Up</button>
                    
                {message}
            </form>

            <img src="https://i.ibb.co/FsSc9k1/Screenshot-2023-11-07-at-18-34-47-fotor-bg-remover-20231107185715.png" alt="Porsche Car"/>
            
            <div id="loginpage" className="w-100 text-center mt-2">
                Already have an account? <Link to="/login" id='loginlink'> Login Here</Link>
            </div>

        </div>
        
      </>
    
  )
}

export default Signup

