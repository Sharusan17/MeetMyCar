import React from 'react'
import {useAuth} from './AuthContext'
import {Navigate } from 'react-router-dom'

export default function PrivateRoute({children}) {
    const {currentUser} = useAuth()
    
    // checks if there is a currentUser (User logged in), if not, it will navigate back to login page
    return currentUser ? children :< Navigate to="/login" />
}
