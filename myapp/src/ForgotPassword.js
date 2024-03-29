import React, {useRef, useState} from 'react'
import {Form} from 'react-bootstrap'
import { useAuth } from './AuthContext'
import {Link, useNavigate} from 'react-router-dom'


const ForgotPassword = () => {

    const emailRef = useRef()
    const {passwordReset} = useAuth()

    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    // handles form submission 
    async function handleSubmit(e){
        e.preventDefault()
        // sends a password reset using firebase to the current email address
        try{
            setMessage('')
            setError('')
            setLoading(true)
            await passwordReset(emailRef.current.value)
            setMessage("Check your inbox for further instruction")     
            // after the password reset email has been sent, it will navigate back to login page
            setTimeout(() => {
                navigate("/login")
            }, 2000) 
        }catch{
            setError("Failed To Reset Password")
        }
        setLoading(false) 
    }


  return (
      <>
            <div className="Card">
                <header>
                    <h1 id="login_text">
                        Reset Password
                    </h1>
                </header>                
                
                <form onSubmit={handleSubmit} className='loginForm'>

                    <p className="w-100 text-center mt-2" id="success_Msg">{message}</p>

                    <Form.Group id="email">
                        <Form.Control type="email" placeholder="Email" ref={emailRef} required />
                    </Form.Group>  
   
                    <p className="w-100 text-center mt-2 mb-1" id="error_Msg">{error}</p>
                    
                    <button disabled={loading} id="button" className="w-100 mt-1" type="submit">Reset Password</button>

                    <div id="loginPage" className="w-100 text-center mt-2">
                        <Link to="/login" id="loginlink">Login Here</Link>
                    </div>

                </form>

            </div>  
      </>
    
  )
}

export default ForgotPassword