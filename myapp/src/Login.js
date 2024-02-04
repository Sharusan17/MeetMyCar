import React, {useRef, useState} from 'react'
import {Form} from 'react-bootstrap'
import { useAuth } from './AuthContext'
import {Link, useNavigate} from 'react-router-dom'

import './Login_css.css'


const Login = () => {

    const emailRef = useRef()
    const passwordRef = useRef()
    const {login} = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()


    async function handleSubmit(e){
        e.preventDefault()

        try{
            setError('')
            setLoading(true)
            await login(emailRef.current.value, passwordRef.current.value)
            navigate("/")
        }catch(error){
            console.error("Error Logging In:", error)
            if(error.code === "auth/too-many-requests"){
                setError(
                    <> 
                        Access to this account has been temporarily disabled <br />
                        Reset Password or Try Again Later
                    </>
                )
            }else if(error.code === "auth/invalid-credential"){
                setError("Invalid Email/Password")
            }else{
                setError("Failed To Log In")
            }
        }
        setLoading(false) 
    }


  return (
      <>
            <div className="Card">

                <header>
                    <h1 id="login_text">
                        Log In
                        <p id="slogan_text">Drive By Your Friends</p>
                    </h1>
                </header>

                <form onSubmit={handleSubmit} className='loginForm'>
                    
                    <Form.Group id="email">
                        <Form.Control type="email" placeholder="Email" ref={emailRef} required />
                    </Form.Group>            
                    
                    <Form.Group id="password">
                        <Form.Control type="password" placeholder="Password" ref={passwordRef} required />
                    </Form.Group>

                    <p className="w-100 text-center mt-2 mb-0" id="error_Msg">{error}</p>
                    
                    <button disabled={loading} id="button" className="w-100 mt-3" type="submit">Log In</button>

                    <div id="forgotPassPage" className="w-100 text-center mt-3">
                        <Link to="/forgot-password" id="forgotLink">Forgot Password</Link>
                    </div>


                    <div id="signupPage" className="w-100 text-center mt-2">
                        Need an account? <Link to="/signup" id="signupLink">  Sign Up</Link>
                </div>
                </form>

            </div>

      </>
    
  )
}

export default Login