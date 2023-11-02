import React, {useRef, useState} from 'react'
import {Form, Button} from 'react-bootstrap'
import { useAuth } from './AuthContext'
import {Link, useNavigate} from 'react-router-dom'

const UpdateProfile = () => {

    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const {currentUser, updateEmail, updatePassword} = useAuth()
    const [error, setError] = useState('')
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

        const toupdate = []
        setLoading(true)
        setError('')

        if (emailRef.current.value !== currentUser.email){
            toupdate.push(updateEmail(emailRef.current.value))
        }
        if (passwordRef.current.value !== currentUser.password){
            toupdate.push(updatePassword(passwordRef.current.value))
        }

        Promise.all(toupdate).then(() => {
            navigate('/')
        }).catch( () => {
            setError("Failed to Update Account")
        }).finally( () => {
            setLoading(false)
        })
    }


  return (
      <>
            <body>
                <h1 className="text-center mb-4">Update Profile</h1>
                <form onSubmit={handleSubmit}>
                    
                    <Form.Group id="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" ref={emailRef}  defaultValue={currentUser.email} required/>
                    </Form.Group>            
                    
                    <Form.Group id="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" ref={passwordRef} placeholder='Leave Blank to keep the same' />
                    </Form.Group>

                    <Form.Group id="passwordConfirmation">
                        <Form.Label>Password Confirmation</Form.Label>
                        <Form.Control type="password" ref={passwordConfirmRef} placeholder='Leave Blank to keep the same'  />
                    </Form.Group>

                    <p>{error}</p>

                    <Button disabled={loading} className="w-100 mt-2" type="submit">Update</Button>
                </form>

            </body>

            
        <div className="w-100 text-center mt-2">
            <Link to="/">  Go Back Home</Link>
        </div>
      </>
    
  )
}

export default UpdateProfile

