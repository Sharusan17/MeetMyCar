import React, {useRef, useState} from 'react'
import {Form} from 'react-bootstrap'
import { useAuth } from './AuthContext'
import {Link, useNavigate} from 'react-router-dom'

import './Login_css.css'


const Reauthenticate = () => {

    const passwordRef = useRef()
    const {currentUser, login} = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()


    async function handleReauthenticate(e){
        e.preventDefault()

        try{
            setError('')
            setLoading(true)
            await login(currentUser.email, passwordRef.current.value)
            navigate("/update-profile")
        }catch(error){
            console.log(error)
            setError('Reauthentication Failed. Please check your password.');
        }
        setLoading(false) 
    }

  return (
      <>
            <div className="Card">

            <header>
                    <h1 id="login_text">
                        Reauthenticate
                    </h1>
                    <div id="red-corner"></div>
                </header>

                <form className='loginForm'>

                    <h2>{currentUser.email}</h2>
                    
                    <Form.Group id="password">
                        <Form.Control type="password" placeholder="Password" ref={passwordRef} required />
                    </Form.Group>

                    <p className="w-100 text-center mt-2 mb-0" id="error_Msg">{error}</p>
                    
                    <button onClick={handleReauthenticate} disabled={loading} id="button" className="w-100 mt-3" >Reauthenticate</button>

                    <div id="forgotPassPage" className="w-100 text-center mt-3">
                        <Link to="/forgot-password" id="forgotLink">Forgot Password</Link>
                    </div>
                </form>
            </div>
      </>
  )
}

export default Reauthenticate