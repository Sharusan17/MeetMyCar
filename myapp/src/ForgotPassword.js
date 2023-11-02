import React, {useRef, useState} from 'react'
import {Form, Button} from 'react-bootstrap'
import { useAuth } from './AuthContext'
import {Link, useNavigate} from 'react-router-dom'


const ForgotPassword = () => {

    const emailRef = useRef()
    const {passwordReset} = useAuth()
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()




    async function handleSubmit(e){
        e.preventDefault()

        try{
            setMessage('')
            setError('')
            setLoading(true)
            await passwordReset(emailRef.current.value)
            setMessage("Check your inbox for further instruction")      
        }catch{
            setError("Failed To Reset Password")
        }
        setLoading(false) 
    }


  return (
      <>
            <body>
                <h1 className="text-center mb-4">Reset Password</h1>
                <form onSubmit={handleSubmit}>

                  {message}
                    
                    <Form.Group id="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" ref={emailRef} required />
                    </Form.Group>            
   
                    <p>{error}</p>
                    
                    <Button disabled={loading} className="w-100 mt-3" type="submit">Reset Password</Button>

                    <div className="w-100 text-center mt-3">
                        <Link to="/login">Login</Link>
                    </div>

                </form>

                   

            </body>

            
        

      </>
    
  )
}

export default ForgotPassword