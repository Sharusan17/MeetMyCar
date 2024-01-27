import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

import './ToolBar_css.css'

const ToolBar = () => {
  const [username, setuserName] = useState('')
  const [profilePicture, setprofilePicture] = useState('')

  const {currentUser, logout} = useAuth()
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

                setuserName(data.userData.username)
                setprofilePicture(data.userData.profilePicture)

                // console.log(`User: FirstName ${firstname} LastName: ${lastname}  UserName: ${username}
                //              Profile Picture: ${profilePicture} Vehicles: ${vehicles}`)   

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
    // eslint-disable-next-line
}, [currentUser.uid]);

  const handleLogOut = () =>{
    logout()
    navigate('/login')
    return
  }

  return (
    <>
      <body>
        <nav className='toolbar'>
            <ul className='toolbar-ul'>

              <li className='logo'>
                <Link className='item-link'>
                  <span className='link-text'>MeetMyCar</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M171.3 96H224v96H111.3l30.4-75.9C146.5 104 158.2 96 171.3 96zM272 192V96h81.2c9.7 0 18.9 4.4 25 12l67.2 84H272zm256.2 1L428.2 68c-18.2-22.8-45.8-36-75-36H171.3c-39.3 0-74.6 23.9-89.1 60.3L40.6 196.4C16.8 205.8 0 228.9 0 256V368c0 17.7 14.3 32 32 32H65.3c7.6 45.4 47.1 80 94.7 80s87.1-34.6 94.7-80H385.3c7.6 45.4 47.1 80 94.7 80s87.1-34.6 94.7-80H608c17.7 0 32-14.3 32-32V320c0-65.2-48.8-119-111.8-127zM434.7 368a48 48 0 1 1 90.5 32 48 48 0 1 1 -90.5-32zM160 336a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/></svg>
                </Link>
              </li>

              <li className='toolbar-item'>
                <Link to="/seepost" className='user-item-link'>
                  {profilePicture && (
                          <img 
                              src={`http://localhost:3001/${profilePicture}`} 
                              alt="Profile"
                              style={{ width: '40px', height: '40px' }} 
                          />
                      )}
                  <span className='user-link-text'>{username}</span>
                </Link>
              </li>

              <li className='toolbar-item'>
                <Link to="/seepost" className='item-link'>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M0 488V171.3c0-26.2 15.9-49.7 40.2-59.4L308.1 4.8c7.6-3.1 16.1-3.1 23.8 0L599.8 111.9c24.3 9.7 40.2 33.3 40.2 59.4V488c0 13.3-10.7 24-24 24H568c-13.3 0-24-10.7-24-24V224c0-17.7-14.3-32-32-32H128c-17.7 0-32 14.3-32 32V488c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24zm488 24l-336 0c-13.3 0-24-10.7-24-24V432H512l0 56c0 13.3-10.7 24-24 24zM128 400V336H512v64H128zm0-96V224H512l0 80H128z"/></svg>                  
                  <span className='link-text'>Home</span>
                </Link>
              </li>

              <li className='toolbar-item'>
                <Link to="/seepost" className='item-link'>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/></svg> 
                  <span className='link-text'>Profile</span>
                </Link>
              </li>

              <li className='toolbar-item'>
                <Link to="/" className='item-link'>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M352 320c88.4 0 160-71.6 160-160c0-15.3-2.2-30.1-6.2-44.2c-3.1-10.8-16.4-13.2-24.3-5.3l-76.8 76.8c-3 3-7.1 4.7-11.3 4.7H336c-8.8 0-16-7.2-16-16V118.6c0-4.2 1.7-8.3 4.7-11.3l76.8-76.8c7.9-7.9 5.4-21.2-5.3-24.3C382.1 2.2 367.3 0 352 0C263.6 0 192 71.6 192 160c0 19.1 3.4 37.5 9.5 54.5L19.9 396.1C7.2 408.8 0 426.1 0 444.1C0 481.6 30.4 512 67.9 512c18 0 35.3-7.2 48-19.9L297.5 310.5c17 6.2 35.4 9.5 54.5 9.5zM80 408a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"/></svg>                    
                  <span className='link-text'>Setting</span>
                </Link>
              </li>

              <li className='toolbar-item'>
                <Link to="/seepost" className='item-link'>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344V280H168c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H280v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"/></svg>                    
                  <span className='link-text'>Add Post</span>
                </Link>
              </li>

              <li className='toolbar-item'>
                <Link onClick={handleLogOut} className='item-link'>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 192 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 32C43 32 0 75 0 128L0 384c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z"/></svg>                    
                  <span className='link-text'>Log Out</span>
                </Link>
              </li>

            </ul>
        </nav>
      </body>
      
    </>
    
  )
}
export default ToolBar