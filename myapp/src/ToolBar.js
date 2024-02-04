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
                              style={{ width: '40px', height: '40px', borderRadius: '50%'}} 
                          />
                      )}
                  <span className='user-link-text'>{username}</span>
                </Link>
              </li>

              <li className='toolbar-item'>
                <Link to="/seepost" className='item-link'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="2.5em" height="2.5em" viewBox="0 0 24 24"><path  d="m10.007 3.772l-6 5.333A3 3 0 0 0 3 11.347v9.903H2a.75.75 0 1 0 0 1.5h20a.75.75 0 0 0 0-1.5h-1v-9.903a3 3 0 0 0-1.007-2.242l-6-5.333a3 3 0 0 0-3.986 0M10 8.25a.75.75 0 0 0 0 1.5h4a.75.75 0 0 0 0-1.5zm4.052 3c.899 0 1.648 0 2.242.08c.628.084 1.195.27 1.65.726c.456.455.642 1.022.726 1.65c.08.594.08 1.344.08 2.242v5.302H5.25v-5.302c0-.898 0-1.648.08-2.242c.084-.628.27-1.195.725-1.65c.456-.456 1.023-.642 1.65-.726c.595-.08 1.345-.08 2.243-.08z" clip-rule="evenodd"/><path d="M14.052 11.25H9.948c-.898 0-1.648 0-2.242.08c-.628.084-1.195.27-1.65.726c-.456.455-.642 1.022-.726 1.65c-.08.594-.08 1.344-.08 2.242v5.302h13.5v-5.302c0-.898 0-1.648-.08-2.242c-.084-.628-.27-1.195-.726-1.65c-.455-.456-1.022-.642-1.65-.726c-.594-.08-1.344-.08-2.242-.08" opacity=".5"/><path d="M9 14.75a.75.75 0 0 0 0 1.5h6a.75.75 0 0 0 0-1.5zm0 3a.75.75 0 0 0 0 1.5h6a.75.75 0 0 0 0-1.5z"/></svg>
                  <span className='link-text'>Home</span>
                </Link>
              </li>

              {/*Navigate to Own Profile*/}
              <li className='toolbar-item'>
                <Link to="/seepost" className='item-link'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="2.5em" height="2.5em" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4m0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4"/></svg>                  
                  <span className='link-text'>Profile</span>
                </Link>
              </li>

              <li className='toolbar-item'>
                <Link to="/" className='item-link'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="2.5em" height="2.5em" viewBox="0 0 512 512"><path  d="m241.406 21l-15.22 34.75a182.242 182.242 0 0 0-23.467 2.97l-23.282-30.064l-25.094 8.532l-.125 38.25c-10.63 5.464-20.817 12.07-30.44 19.78L88.313 79.25L70.156 98.563L88.312 133a180.58 180.58 0 0 0-15.218 26.094l-38.938 1.062l-7.906 25.28l31.438 23.158c-1.505 9.38-2.24 18.858-2.282 28.344L20.5 254.625l3.656 26.25l38.313 7.5a181.6 181.6 0 0 0 8.5 23.5L45.72 343.22l14.093 22.436l39.25-9.187a185.132 185.132 0 0 0 7.718 8.53a187.386 187.386 0 0 0 17.72 16.125l-7.625 39.313l22.938 13.25l29.968-26.094a179.393 179.393 0 0 0 26.407 8.312l9.782 38.406l26.405 2.157l15.875-36.22c10.97-.66 21.904-2.3 32.656-4.938l25.22 29.22l24.593-9.844l-.72-14.813l-57.406-43.53c-16.712 4.225-34.042 5.356-51.063 3.436c-31.754-3.58-62.27-17.92-86.218-42.686c-54.738-56.614-53.173-146.67 3.438-201.406c27.42-26.513 62.69-39.963 98-40.344c37.59-.406 75.214 13.996 103.438 43.187c45.935 47.512 52.196 118.985 19.562 173.095l31.97 24.25a181.443 181.443 0 0 0 10.75-19.375l38.655-1.063l7.906-25.28l-31.217-23a183.327 183.327 0 0 0 2.28-28.594l34.688-17.625l-3.655-26.25l-38.28-7.5a181.934 181.934 0 0 0-12.75-32.125l22.81-31.594l-15.25-21.657l-37.56 10.906c-.472-.5-.93-1.007-1.408-1.5a184.77 184.77 0 0 0-18.937-17.064l7.188-37.125L334 43.78l-28.5 24.814c-9.226-3.713-18.702-6.603-28.313-8.75l-9.343-36.688zM183.25 174.5c-10.344.118-20.597 2.658-30 7.28l45.22 34.314c13.676 10.376 17.555 30.095 7.06 43.937c-10.498 13.85-30.656 15.932-44.53 5.408l-45.188-34.282c-4.627 24.793 4.135 51.063 25.594 67.344c19.245 14.597 43.944 17.33 65.22 9.688l4.78-1.72l4.03 3.063l135.19 102.564l4.03 3.062l-.344 5.063c-1.637 22.55 7.59 45.61 26.844 60.217c21.46 16.28 49.145 17.63 71.78 6.5l-45.186-34.28c-13.874-10.526-17.282-30.506-6.78-44.344c10.5-13.84 30.537-15.405 44.217-5.032l45.188 34.283c4.616-24.784-4.11-51.067-25.563-67.344c-19.313-14.658-43.817-17.562-64.968-10.033l-4.75 1.688l-4.03-3.063l-135.19-102.562l-4.03-3.063l.344-5.03c1.55-22.387-7.85-45.194-27.157-59.845c-12.544-9.516-27.222-13.978-41.78-13.812zm43.563 90.25l163.875 124.344L379.406 404L215.5 279.625z"/></svg> 
                  <span className='link-text'>Setting</span>
                </Link>
              </li>
              
              <li className='toolbar-item'>
                <Link to="/addpost" className='item-link'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="2.5em" height="2.5em" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M21 12a9 9 0 1 1-18 0a9 9 0 0 1 18 0m-8 1v4h-2v-4H7v-2h4V7h2v4h4v2z" clip-rule="evenodd"/></svg>  
                  <span className='link-text'>Add Post</span>
                </Link>
              </li>

              <li className='toolbar-item'>
                <Link onClick={handleLogOut} className='item-link'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="2.5em" height="2.5em" viewBox="0 0 24 24"><path fill="currentColor" d="m17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5M4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4z"/></svg>                  
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