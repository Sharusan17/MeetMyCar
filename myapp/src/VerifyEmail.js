import React, {useEffect, useState} from 'react'
import { useAuth } from './AuthContext'
import {useLocation, useNavigate} from 'react-router-dom'

import './VerifyEmail_css.css'

const VerifyEmail = () => {

    const [verified, setVerified] = useState(false)
    const {currentUser, logout} = useAuth()

    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [emailSent, setEmailSent] = useState(false)

    const navigate = useNavigate()
    const location = useLocation()


    // Check in interval, if the email has been verified
    useEffect(() => {
        const checkVerified = async () => {
            // fetches email address from previous page, to check if been verified
            const newEmail = new URLSearchParams(location.search).get('newEmail')
            try{
                console.log("Checking Verification...")
                //checks if email has been changed
                await currentUser.reload();
                if (newEmail){
                    console.log("New Email Being Verified...")
                    if(newEmail.emailVerified){
                        // login to account, if email has been verified
                        console.log("New Email Verified")
                        setVerified(true)
                        clearInterval(intervalId)
                        await logout()
                        navigate('/login')
                    }
                } else{
                    await currentUser.reload();
                    console.log("Email Being Verified...")
                    if (currentUser.emailVerified ){
                        // navigate to registervehicle, if email has been verified for new users
                        console.log("Email Being Verified")
                        setVerified(true)
                        clearInterval(intervalId)
                        navigate("/registervehicle")
                    }
                }
            }catch (error) {
                setError(error)
                console.log('Error checking email verification status', error)
            }
        }
        // checks every second, if email is verified
        const intervalId = setInterval(checkVerified, 1000)
        return () => clearInterval(intervalId)
    }, [currentUser, location.search, navigate, logout]); 

    // handles resend email verification
    const resendEmail = async() => {
        setError('')
        setMessage('')
        setEmailSent(true)
        try{ 
            await currentUser.sendEmailVerification();
            setMessage("Verification Email Sent")
            setEmailSent(false)
        }catch (error){
            // displays error message, depending on type of error
            setEmailSent(false)
            if (error.code === 'auth/too-many-requests'){
                setError("Try Again Later. Too Many Request")
            }else{
                setError("Failed To Send Verification Email")
            }
            console.log("Error Sending Verification Email", error)
        }
    }

  return (
      <>
            <div className="Card">
                <header>
                    <h1 id="login_text">
                        Verify Email
                    </h1>
                </header>  

                {/* display message depending email is verified or not */}
                <div className='center_H'>
                    <p className="w-100 text-center mt-3 mb-1" id="success_Msg">{message}</p>
                    {verified 
                        ? (
                            <p className='verify_text'>Email Verified Reloading....</p>
                        ):(
                        <>
                            <p className='verify_text'>Check Inbox For Verification Email</p>
                            <div className='center'>
                                {/* resend email verification button */}
                                <button id="verifybtn" onClick={resendEmail} disabled={emailSent}>
                                    {emailSent ? 'Email Sending...' : 'Resend Verification Email'}
                                </button>
                            </div>
                        </>
                    )}
                    <p className="w-100 text-center mt-3 mb-1" id="error_Msg">{error}</p>
                </div>                 
            </div>
        
      </> 
  )
}

export default VerifyEmail