import React, {useEffect, useState} from 'react'
import { useAuth } from './AuthContext'
import {useNavigate} from 'react-router-dom'

const VerifyEmail = () => {

    const [verified, setVerified] = useState(false)
    const {currentUser} = useAuth()

    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [emailSent, setEmailSent] = useState(false)

    const navigate = useNavigate()


    useEffect(() => {
        const checkVerified = async () => {
            await currentUser.reload();
            if (currentUser.emailVerified){
                setVerified(true)
                clearInterval(intervalId)
                navigate("/registervehicle")
            }
        }
        const intervalId = setInterval(checkVerified, 1000)
        return () => clearInterval(intervalId)
    }, [currentUser, navigate]); 

    const resendEmail = async() => {
        setError('')
        setMessage('')
        setEmailSent(true)
        try{
            await currentUser.sendEmailVerification();
            setMessage("Verification Email Sent")
            setEmailSent(false)
        }catch (error){
            setEmailSent(false)
            if (error.code === 'auth/too-many-requests'){
                setError("Try Again Later. Too Many Request")
            }else{
                setError("Failed To  Send Verification Email")
            }
            console.log("Error Sending Verification Email", error)
        }
    }

  return (
      <>
        <h1 className="text-center mb-4">Verify Email</h1>
        <div>
            <p>{message}</p>
            <p>{error}</p>
            {verified 
                ? (
                    <p>Email Verified Reloading....</p>
                ):(
                <>
                    <p>Please Verify Email. Check Inbox or Junk</p>
                    <button onClick={resendEmail} disabled={emailSent}>
                        {emailSent ? 'Email Sending...' : 'Resend Verification Email'}
                    </button>
                </>
            )}
        </div>
      </> 
  )
}

export default VerifyEmail