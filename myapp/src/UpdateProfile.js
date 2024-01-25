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
    const vehiclesRef = useRef()

    const [firstname, setfirstName] = useState('')
    const [lastname, setlastName] = useState('')
    const [username, setuserName] = useState('')
    const [profilePicture, setprofilePicture] = useState('')
    const [vehicles, setVehicles] = useState([])

    const {currentUser, logout, sendEmailVerify, updateEmail, updatePassword} = useAuth()

    const [emailChanging, setemailChanging] = useState(false)

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        async function fetchUserData(){
            await updateUser()
            try{
                setError('')
                const firebaseUID = currentUser.uid;
                // console.log(firebaseUID)

                const response = await fetch(`http://localhost:3001/users/details?userfb=${encodeURIComponent(firebaseUID)}`, {
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
        // eslint-disable-next-line
    }, [currentUser.uid]); 

    const updateUser = async () => {

        const updatedUserData = {
            email: emailRef.current.value,
            profilePicture: profilePictureRef.current.value,
            vehicles: vehiclesRef.current.value.split(',')
        }

        try{
            // console.log("Updated Email: ", updatedEmail)
            setLoading(true)
            setError('')
            const firebaseUID = currentUser.uid;
            // console.log(firebaseUID)

            const response = await fetch(`http://localhost:3001/users/update?userfb=${encodeURIComponent(firebaseUID)}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedUserData),
            });

            if (response.ok){
                console.log("Updated User Details")
            } else{
                const errorData = await response.json()
                setError("Failed To Update User Details")
                console.error("Error Updating User Details:", error)
                throw new Error(errorData.message)
            }
        }catch (error){
            console.error("Error Updating User Details:", error)
            setError("Failed To Update User Details")
        }finally{
            setLoading(false)
        }
    }

    async function handleSubmit(e){
        e.preventDefault()

        if(passwordRef.current.value.length){
            if (passwordRef.current.value !== passwordConfirmRef.current.value){
                return setError("Password do not match")
            }
            if (passwordRef.current.value.length < 6 && passwordConfirmRef.current.value.length < 6 ){
                return setError("Password Too Short")
            }
        }

        const toupdate = []
        setLoading(true)
        setError('')

        if (emailRef.current.value !== currentUser.email){
            try{
                await toupdate.push(updateEmail(emailRef.current.value))
                console.log("Email Updating...")
                toupdate.push(updateUser())
                navigate(`/verify?newEmail=${encodeURIComponent(emailRef.current.value)}`);
                return;
            }catch(error){
                setError(error)
                console.log(error)
            }
            //try update if not catch errors
            //if can be updated it should go to verify page
            //when verified it should logout the user out
            //also if email is being changed all other changes should not work
        }
        if (passwordRef.current.value.length >0 && passwordRef.current.value !== currentUser.password){
            console.log("Password Updating...")
            toupdate.push(updatePassword(passwordRef.current.value))
        }
        if (profilePictureRef.current.value !==profilePicture){
            console.log("Profile Picture Updating...")
            toupdate.push(updateUser())
        }
        // if (vehiclesRef.current.value !== vehicles.current){
        //     console.log("Vehicles Updating...")
        //     toupdate.push(updateUser())
        // }

        Promise.all(toupdate).then(() => {
            navigate('/')
        }).catch( (error) => {
            console.log("Failed to Update Account" , error)
            if (error.code === 'auth/operation-not-allowed'){
                setError("Verify Current Email Address")
                sendEmailVerify()
            }else if (error.code === 'auth/requires-recent-login'){
                setError("Login Session Timeout")
                setTimeout(() => {
                    logout()
                }, 2000)
            }else{
                setError("Failed to Update Account")
            }
        }).finally( () => {
            setLoading(false)
        })
    }

    const handleEmailChange= () =>{
        setemailChanging(true)
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
                        <Form.Control type="email" ref={emailRef}  defaultValue={currentUser.email} onChange={handleEmailChange} required/>
                    </Form.Group>            
                    
                    <Form.Group id="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" ref={passwordRef} placeholder={emailChanging ? 'Cannot Be Updated While Email Updating' : 'Leave Blank to keep the same'} disabled={emailChanging}/>
                    </Form.Group>

                    <Form.Group id="passwordConfirmation">
                        <Form.Label>Password Confirmation</Form.Label>
                        <Form.Control type="password" ref={passwordConfirmRef} placeholder={emailChanging ? 'Cannot Be Updated While Email Updating' : 'Leave Blank to keep the same'} disabled={emailChanging} />
                    </Form.Group>

                    <Form.Group id="profilePicture">
                        <Form.Label>Profile Picture</Form.Label>
                        <Form.Control type="" ref={profilePictureRef} defaultValue={profilePicture} placeholder=''  />
                    </Form.Group>

                    <Form.Group id="vehicles">
                        <Form.Label>Look At Your Vehicles</Form.Label>
                        <Form.Control type="array" ref={vehiclesRef} defaultValue={vehicles} placeholder=''  />
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

