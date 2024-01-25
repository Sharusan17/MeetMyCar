import React, {useEffect, useState} from 'react'
import { useAuth } from './AuthContext'
import {useLocation, useNavigate} from 'react-router-dom'

const VerifyEmail = () => {

    const [verified, setVerified] = useState(false)
    const {currentUser, logout} = useAuth()

    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [emailSent, setEmailSent] = useState(false)

    const navigate = useNavigate()
    const location = useLocation()



    useEffect(() => {
        const checkVerified = async () => {
            const newEmail = new URLSearchParams(location.search).get('newEmail')
            try{
                console.log("Checking Verification...")
                //checks if email has been changed
                await currentUser.reload();
                if (newEmail){
                    console.log("New Email Being Verified...")
                    if(newEmail.emailVerified){
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
        const intervalId = setInterval(checkVerified, 1000)
        return () => clearInterval(intervalId)
    }, [currentUser, location.search, navigate, logout]); 

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
                setError("Failed To Send Verification Email")
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