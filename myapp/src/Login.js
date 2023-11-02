import React, {useRef, useState} from 'react'
import {Form, Button} from 'react-bootstrap'
import { useAuth } from './AuthContext'
import {Link, useNavigate} from 'react-router-dom'


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
        }catch{
            setError("Failed To Login")
        }
        setLoading(false) 
    }


  return (
      <>
            <body>
                <h1 className="text-center mb-4">Log In</h1>
                <form onSubmit={handleSubmit}>
                    
                    <Form.Group id="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" ref={emailRef} required />
                    </Form.Group>            
                    
                    <Form.Group id="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" ref={passwordRef} required />
                    </Form.Group>

                    

                    <p>{error}</p>
                    
                    <Button disabled={loading} className="w-100 mt-3" type="submit">Log In</Button>

                    <div className="w-100 text-center mt-3">
                        <Link to="/forgot-password">Forgot Password</Link>
                    </div>
                </form>

            </body>

            
        <div className="w-100 text-center mt-2">
            Need an account? <Link to="/signup">  Sign Up</Link>
        </div>

      </>
    
  )
}

export default Login