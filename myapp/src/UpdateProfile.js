import React, {useEffect, useRef, useState} from 'react'
import {Form} from 'react-bootstrap'
import { useAuth } from './AuthContext'
import {Popup} from 'reactjs-popup'
import {Link, useNavigate} from 'react-router-dom'

import './UpdateProfile_css.css'

const UpdateProfile = () => {

    const usernameRef = useRef()
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const profilePictureRef = useRef()

    const [userId, setUserId] = useState('')
    const [firstname, setfirstName] = useState('')
    const [lastname, setlastName] = useState('')
    const [username, setuserName] = useState('')
    const [profilePicture, setprofilePicture] = useState('')
    const [vehicles, setVehicles] = useState([])

    const {currentUser, logout, sendEmailVerify, updateEmail, updatePassword, deleteUser} = useAuth()

    const [emailChanging, setemailChanging] = useState(false)
    const [confirmDeleteUser, setconfirmDeleteUser] = useState(false)
    const [openDeleteModal, setOpenDeleteModal] = useState(false)

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        async function fetchUserData(){
            // fetches current user data after every updates to user, and stores the data into useState, to be used throughout the page.
            await updateUser()
            try{
                setError('')
                // fetches the user data with firebase ID
                const firebaseUID = currentUser.uid;
                // console.log(firebaseUID)

                const response = await fetch(`http://localhost:3001/users?userfb=${encodeURIComponent(firebaseUID)}`, {
                    method: 'GET',
                    headers: {
                        'accept': 'application/json',
                    },
                });

                if (response.ok){
                    const data = await response.json()

                    // updates user's data states
                    setUserId(data.userData._id)
                    setfirstName(data.userData.firstname)
                    setlastName(data.userData.lastname)
                    setuserName(data.userData.username)
                    setprofilePicture(data.userData.profilePicture)
                    setVehicles(data.userData.vehicles)

                    console.log("Fetched User Details:", data)
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

    // handles updates to user account
    const updateUser = async () => {

        const formData = new FormData();

        if (profilePictureRef.current && profilePictureRef.current.files[0]){
            formData.append('profilePicture', profilePictureRef.current.files[0])
        }

        formData.append('email', emailRef.current.value)

        try{
            // console.log("Updated Email: ", updatedEmail)
            setLoading(true)
            setError('')
            const firebaseUID = currentUser.uid;
            // console.log(firebaseUID)

            // amends user's data into database
            const response = await fetch(`http://localhost:3001/users/update?userfb=${encodeURIComponent(firebaseUID)}`, {
                method: 'PUT',
                body: formData,
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

    // handles update user submission
    async function handleSubmit(e){
        e.preventDefault()

        // validates password meets requirement
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

        // checks if any of the field has been changed
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
        }
        if (passwordRef.current.value.length >0 && passwordRef.current.value !== currentUser.password){
            console.log("Password Updating...")
            toupdate.push(updatePassword(passwordRef.current.value))
        }
        if (profilePictureRef.current.value !==profilePicture){
            console.log("Profile Picture Updating...")
            toupdate.push(updateUser())
        }

        // adds all changes to a list and updates all changes
        Promise.all(toupdate).then(() => {
            navigate('/setting')
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

    // handle delete user's account
    async function handleDelete(e){
        e.preventDefault()

        // opens delete confirmation
        if (!confirmDeleteUser){
            setconfirmDeleteUser(true)
            setOpenDeleteModal(true)
            return
        }

        setLoading(true)
        setError('')

        try{
            // sends delete request to database to remove account
            const response = await fetch(`http://localhost:3001/users/delete?userfb=${encodeURIComponent(userId)}`, {
                method: 'DELETE',
            });

            if (response.ok){
                console.log("Deleted User")
                // deletes account in firebase database
                deleteUser()
            } else{
                const errorData = await response.json()
                setError("Failed To Delete User")
                console.error("Error Deleting User:", error)
                throw new Error(errorData.message)
            }
        }catch (error){
            console.error("Error Deleting User:", error)
            setError("Failed To Delete User")
        }finally{
            setLoading(false)
        }
    }

    // handle image input, and display new inserted image
    function handleImageInput(e){
        setprofilePicture(URL.createObjectURL(e.target.files[0]))
    }

    // handle email change
    const handleEmailChange = () =>{
        setemailChanging(true)
    }
    
    // handle delete modal
    const handleCloseDelete = () => {
        setOpenDeleteModal(false)
        setconfirmDeleteUser(false)
    }   
    
  return (
        <div>
            <header className='updateHeader'>
                <h1 id="login_text">
                    Update Profile
                    <p id="slogan_text">Amend Your Details</p>
                </h1>
                <h3 className='updateName'>{firstname} {lastname}</h3>
            </header>

            {/* Update Form */}
            <form className='updateForm' onSubmit={handleSubmit}>

                <p className="w-100 text-center mt-0 mb-0" id="error_Msg">{error}</p>

                <Form.Group className='formBox' id="username">
                    <Form.Label className='formLabel'>Username</Form.Label>
                    <Form.Control className='formInput' type="text" ref={usernameRef}  defaultValue={username} disabled/>
                </Form.Group>   
                
                <Form.Group className='formBox' id="email">
                    <Form.Label className='formLabel'>Email</Form.Label>
                    <Form.Control className='formInput' type="email" ref={emailRef}  defaultValue={currentUser.email} onChange={handleEmailChange} required/>
                </Form.Group>            
                
                <Form.Group className='formBox' id="password">
                    <Form.Label className='formLabel'>Password</Form.Label>
                    {/* check if email is being changed and display message depending on situation */}
                    <Form.Control className='formInput' type="password" ref={passwordRef} placeholder={emailChanging ? 'Cannot Be Updated While Email Updating' : 'Leave Blank to keep the same'} disabled={emailChanging}/>
                </Form.Group>

                <Form.Group className='formBox' id="passwordConfirmation">
                    <Form.Label className='formLabel'>Password Confirmation</Form.Label>
                    {/* check if email is being changed and display message depending on situation */}
                    <Form.Control className='formInput' type="password" ref={passwordConfirmRef} placeholder={emailChanging ? 'Cannot Be Updated While Email Updating' : 'Leave Blank to keep the same'} disabled={emailChanging} />
                </Form.Group>

                <Form.Group className='formBox' id="profilePicture">
                    <Form.Label className='formLabel'>Profile Picture</Form.Label>
                    {/* display profile pic */}
                    {profilePicture && (
                        <img
                            src={profilePicture} 
                            alt="Profile"
                            className='profileImg'
                        />
                    )}
                    <Form.Control className='formInput' type="file" ref={profilePictureRef} placeholder='Insert Image' defaultValue={profilePicture} onChange={handleImageInput}  accept="image/*"/>
                </Form.Group>

               

                <Form.Group className='formBox' id="vehicles">
                    <Form.Label className='formLabel'>Look At Your Vehicles</Form.Label>
                    {/* shows all user's vehicle */}
                    <select className='formVehicle'>
                        <option value="" disabled>VRN</option>
                        {vehicles.map(vehicle => ( 
                            <option key={vehicle.vehicleId} value={vehicle.vehicleId}> {vehicle.vrn} </option>
                        ))}
                    </select>
                </Form.Group>

                <button disabled={loading} className="btn btn-dark w-100 mt-2" type="submit">Update</button>
                
            {/* modal for confirm delete */}
                {confirmDeleteUser ? (
                    <>
                        <Popup open={openDeleteModal} closeOnDocumentClick onClose={() => handleCloseDelete()} className='Popup'>
                            <div className='UpdateModal'>
                                <>
                                    <p className='deleteheading'>Confirm deletion of <strong>{usernameRef.current.value}</strong>'s account? </p>
                                    <div className='deletelst'>
                                        <div className='deletebtn'>
                                            <button disabled={loading} className="btn btn-dark w-100" variant="cancel" onClick={() => handleCloseDelete()}>Cancel</button>
                                            <button disabled={loading} className="btn btn-danger w-100" variant="danger" onClick={handleDelete}>Delete</button>
                                        </div>
                                        <p id='deletemsg'>This action is irreversible.</p>      
                                    </div>
                                </>
                            </div>
                        </Popup>
                    </>
                ) :(
                    <>
                        <button disabled={loading} className="btn btn-outline-dark w-100 mt-2" variant="danger" type="submit"  onClick={handleDelete}>Delete Account</button>
                    </>
                )}

            </form>

            {/* Alternative flow for user's doesnt want to make changes */}    
            <div className="cancelMsg">
                <Link to="/setting" className="cancelMsg">  Go Back Home</Link>
            </div>
        </div>
  )
}

export default UpdateProfile

