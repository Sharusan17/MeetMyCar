import React, {useState, useEffect} from 'react'
import { Button } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

const Setting = () => {
  const [userId, setuserId] = useState('')
  const {currentUser, logout} = useAuth()

  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchUserData(){
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

                setuserId(data.userData._id)
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

  async function handleLogOut(){
    setError('')

    try{
      await logout()
      navigate('/login')
    }catch{
      setError('Failed to log out')
    }
  }

  return (
    <div>

        <h1 className="text-center mb-4">Setting</h1>
        <p>{error}</p>
        <strong>Email: </strong> {currentUser.email}

        <Link to="/reauthenticate" className="btn btn-primary w-100 mt-3"> Update Profile</Link>

        <Link to={`/garage/${userId}`} className="btn btn-dark w-100 mt-3"> Check Garage</Link>

        <div className="w-100 text-center mt-2">
            <Button variant="link" onClick={handleLogOut}> Log Out </Button>
        </div>

    </div>
  )
}

export default Setting

