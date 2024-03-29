import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

import './TitleBar_css.css'

const TitleBar = () => {
  const {currentUser} = useAuth()

  const [userid, setuserId] = useState('')
  const searchUserName = useRef()

  const navigate = useNavigate()

  useEffect(() => {
    async function fetchUserData(){
        // fetches current user data, and stores the data (id) into useState, to be used throughout the page.
        try{
            // fetches the user data with firebase ID
            const firebaseUID = currentUser.uid;

            const response = await fetch(`http://localhost:3001/users?userfb=${encodeURIComponent(firebaseUID)}`, {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                },
            });

            if (response.ok){
                const data = await response.json()

                // updates user's data states
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

// handles user search with username
const handleSearchUser = () => {
  navigate(`/profile/username/${searchUserName.current.value}`)
  console.log(searchUserName.current.value)
}

  return (
    <div className='titlebar'>
      {/* TitleBar */}
        <div className='titlebar_buttons'>
            {/* Username Search Bar */}
            <form onSubmit={handleSearchUser}>
              <input type="search" placeholder="Search..." ref={searchUserName} required/>
              <button type="submit" id='searchbtn'><svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path d="m19.6 21l-6.3-6.3q-.75.6-1.725.95T9.5 16q-2.725 0-4.612-1.888T3 9.5q0-2.725 1.888-4.612T9.5 3q2.725 0 4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l6.3 6.3zM9.5 14q1.875 0 3.188-1.312T14 9.5q0-1.875-1.312-3.187T9.5 5Q7.625 5 6.313 6.313T5 9.5q0 1.875 1.313 3.188T9.5 14"/></svg></button>
            </form>
            {/* Profile Button */}
            <button onClick={() => navigate(`/profile/${userid}`)}>🙍‍♂️</button>        
        </div>
    </div>
  )
}
export default TitleBar

