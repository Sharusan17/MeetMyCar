import React, {useState} from 'react'
import { Button } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

export default function Home() {
  const [error, setError] = useState("")
  const {currentUser, logout} = useAuth()
  const navigate= useNavigate()

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

        <h1 className="text-center mb-4">Profile</h1>
        <p>{error}</p>
        <strong>Email: </strong> {currentUser.email}

        <Link to="/reauthenticate" className="btn btn-primary w-100 mt-3"> Update Profile</Link>

        <Link to="/registervehicle" className="btn btn-dark w-100 mt-3"> Register Vehicle</Link>

        <div className="w-100 text-center mt-2">
            <Button variant="link" onClick={handleLogOut}> Log Out </Button>
        </div>

    </div>
  )
}
