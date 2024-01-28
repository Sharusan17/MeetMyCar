import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

import './TitleBar_css.css'

const TitleBar = () => {
  const {currentUser} = useAuth()
  const navigate= useNavigate()

  return (
    <div className='titlebar'>
        <div className='titlebar_buttons'>
            <form >
              <input type="search" name="searchInput" placeholder="Search..." />
              <button type="submit">🔍</button>
            </form>
        </div>
        <div className='titlebar_buttons'>
          <button onClick={() => navigate('/profile')}>🙍‍♂️</button>        
        </div>

    </div>
  )
}
export default TitleBar

