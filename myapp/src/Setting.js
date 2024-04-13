import React, {useState, useEffect} from 'react'
import { Button } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

import './Setting_css.css'
import garagePic from './garage.jpg'; 
import updatePic from './update.jpg'; 

const Setting = () => {
  const [userId, setuserId] = useState('')
  const [username, setuserName] = useState('')
  const [profilePicture, setprofilePicture] = useState('')

  const {currentUser, logout} = useAuth()

  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchUserData(){
        // fetches current user data, and stores the data (id, name and profilePic) into useState, to be used throughout the page.
        try{
            setError('')
            // fetches the user data with firebase ID
            const firebaseUID = currentUser.uid;

            const response = await fetch(`https://meetmycar.onrender.com/users?userfb=${encodeURIComponent(firebaseUID)}`, {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                },
            });

            if (response.ok){
                const data = await response.json()

                // updates user's data states
                setuserId(data.userData._id)
                setuserName(data.userData.username)
                setprofilePicture(data.userData.profilePicture)

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

  // handles logout
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
        <header className='garageHeader'>
            <h1 id="login_text">
                Setting
                <p id="slogan_text">Look At Your Details</p>
            </h1>

            <div className='userSetting'>
              <p className='settingUserName'>{username}</p>
              {profilePicture && (
                  <img className='settingUserImage'
                      src={profilePicture} 
                      alt="Profile"
                  />
              )}
          </div>
        </header> 

        <p>{error}</p>

        {/* Each card has title, image and desc */}

        <div className='Card_Setting'>
          <div className='settingCard'>
            {/* Link To User's Profile */}
            <Link to={`/profile/${userId}`}>
              <div className='cardSettingImage'>
                  <img src={profilePicture} alt={username}/> 
              </div>

              <div className='cardSettingContent'>
                  <div className='cardHeader'>
                      <h2>Check Out Your Profile</h2> 
                  </div>

                  <div className='cardFooter'>
                      <p>{username}</p>
                  </div>
              </div>

            </Link>
          </div>

          <div className='settingCard'>
            <Link to={`/reauthenticate`}>
              <div className='cardSettingImage'>
                  <img src={updatePic} alt={username}/> 
              </div>

              <div className='cardSettingContent'>
                  <div className='cardHeader'>
                  <h2>Update Your Profile</h2> 
                  </div>

                  <div className='cardFooter'>
                  <p>Update</p>
                  </div>
              </div>
              
            </Link>
          </div>

          <div className='settingCard'>
            {/* Link To User's Garage */}
            <Link to={`/garage/${userId}`}>
              <div className='cardSettingImage'>
                  <img src={garagePic} alt="garage"/> 
              </div>

              <div className='cardSettingContent'>
                  <div className='cardHeader'>
                  <h2>Check Out Your Garage</h2> 
                  </div>

                  <div className='cardFooter'>
                  <p>Vehicles</p>
                  </div>
              </div>
              
            </Link>
          </div>

          <div className='settingCard'>
            {/* Link To Creator's (me) Profile */}
            <Link to={`https://meetmycar.onrender.com/profile/65ca0522f846d28f065b115d`}>
              <div className='cardSettingImage'>
                  <img src={profilePicture} alt={username}/> 
              </div>

              <div className='cardSettingContent'>
                  <div className='cardHeader'>
                  <h2>Creator's Profile</h2> 
                  </div>

                  <div className='cardFooter'>
                  <p>Check Out The Creator Collection</p>
                  </div>
              </div>
              
            </Link>
          </div>
        </div>

        {/* About Section */}
        <footer className='settingFooter'>
          <h1>About MeetMyCar...</h1>
          <p>Hey you! Yes, you <strong>{username}</strong>. Did you know MeetMyCar is a social media, made for you petrol-head/car enthusiasts, made by a car enthusiast. I wanted to join the bridge between sharing images of our modified and beautiful vehicles and sharing our specification.</p>
          <p>Incase the superfuel is a bit confusing to understand, let me explain. Each user will have 10 superfuel when they make their account, and this can be given/received. If you really love a post, you can reward that user will a superfuel, and vice versa. Does that make sense? So, how to make superfuel, you asked? Well, make many posts and share around the world 🌎, and let users awards some to you...</p>
          <p>Tell a friend, family, a stranger about this social media, and let's start something awesome together 👋.</p>
          <p>Also, keep a lookout for potential new updates 👀 coming soon...</p>
        </footer>

        {/* Logout Button */}
        <div className="w-100 text-center">
          <button className='btn btn-dark' onClick={handleLogOut}> Log Out </button>
        </div>
    </div>
  )
}

export default Setting

