import React, {useEffect, useRef, useState} from 'react'
import {Form, Button} from 'react-bootstrap'
import { useAuth } from './AuthContext'
import {Link, useNavigate} from 'react-router-dom'

const UpdateProfile = () => {

    const usernameRef = useRef()
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const profilePictureRef = useRef()
    const vehicleRef = useRef()

    const [firstname, setfirstName] = useState('')
    const [lastname, setlastName] = useState('')
    const [username, setuserName] = useState('')
    const [profilePicture, setprofilePicture] = useState('')
    const [vehicles, setVehicles] = useState([])

    const {currentUser, updateEmail, updatePassword} = useAuth()

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        async function fetchUserData(){
            try{
                setError('')
                const firebaseUID = currentUser.uid;
                // console.log(firebaseUID)

                const response = await fetch(`http://localhost:3001/users/register?userfb=${encodeURIComponent(firebaseUID)}`, {
                    method: 'GET',
                    headers: {
                        'accept': 'application/json',
                    },
                });

                if (response.ok){
                    const data = await response.json()

                    setfirstName(data.userData.firstname)
                    setlastName(data.userData.lastname)
                    setuserName(data.userData.username)
                    setprofilePicture(data.userData.profilePicture)
                    setVehicles(data.userData.vehicles)

                    // console.log(`User: FirstName ${firstname} LastName: ${lastname}  UserName: ${username}
                    //              Profile Picture: ${profilePicture} Vehicles: ${vehicles}`)   

                    console.log("Fetched User Details")
                    return data
                } else{
                    const errorData = await response.json()
                    setError("Failed To Fetch User Data")
                    throw new Error(errorData.message)
                }
            }catch (error){
                console.error("Error Fetching User Data:", error)
                setError("Failed To Fetch User Data")
            }
        }
        fetchUserData();
    }, [currentUser.uid]); 


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
        }).catch( (error) => {
            console.log("Failed to Update Account" , error)
            if (error.code === 'auth/operation-not-allowed'){
                setError("Verify Current Email Address")
            }else{
                setError("Failed to Update Account")
            }
        }).finally( () => {
            setLoading(false)
        })
    }

  return (
      <>
            <body>
                <h3 className="text mb-2">{firstname} {lastname}</h3>
                <h4 className="text mb-4">Update Profile</h4>
                <form onSubmit={handleSubmit}>

                <Form.Group id="username">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" ref={usernameRef}  defaultValue={username} disabled/>
                    </Form.Group>   
                    
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

                    <Form.Group id="profilePicture">
                        <Form.Label>Profile Picture</Form.Label>
                        <Form.Control type="" ref={profilePictureRef} defaultValue={profilePicture} placeholder=''  />
                    </Form.Group>

                    <Form.Group id="vehicles">
                        <Form.Label>Look At Your Vehicles</Form.Label>
                        <Form.Control type="array" ref={vehicleRef} defaultValue={vehicles} placeholder=''  />
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

