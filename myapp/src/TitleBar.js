import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

import './TitleBar_css.css'

const TitleBar = () => {
  const {currentUser} = useAuth()

  const [userid, setuserId] = useState('')
  const searchUserName = useRef()

  const navigate= useNavigate()

  useEffect(() => {
    async function fetchUserData(){
        try{
            const firebaseUID = currentUser.uid;

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
                throw new Error(errorData.message)
            }
        }catch (error){
            console.error("Error Fetching User Data:", error)
        }
    }
    fetchUserData();
}, [currentUser.uid]);

const handleSearchUser = () => {
  navigate(`/profile/username/${searchUserName.current.value}`)
  console.log(searchUserName.current.value)
}

  return (
    <div className='titlebar'>
        <div className='titlebar_buttons'>
            <form onSubmit={handleSearchUser}>
              <input type="search" placeholder="Search..." ref={searchUserName} required/>
              <button type="submit">🔍</button>
            </form>
        </div>
        <div className='titlebar_buttons'>
          <button onClick={() => navigate(`/profile/${userid}`)}>🙍‍♂️</button>        
        </div>

    </div>
  )
}
export default TitleBar

