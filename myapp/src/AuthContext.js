import React, {useContext, useEffect, useState} from 'react'
import {auth} from './firebase'

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider ({children}) {
    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)

    //using firebase's method to create user, login and update account details

    function signup(email, password){
      return auth.createUserWithEmailAndPassword(email, password)
    }

    function login(email, password){
      return auth.signInWithEmailAndPassword(email, password)
    }

    function logout(){
      return auth.signOut()
    }

    function passwordReset(email){
      return auth.sendPasswordResetEmail(email)
    }

    function updateEmail(email){
      return currentUser.verifyBeforeUpdateEmail(email)
    }

    function updatePassword(password){
      return currentUser.updatePassword(password)
    }

    function deleteUser(){
      return currentUser.delete()
    }

    // Sets current user and loading state on authentication state change
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged(user =>{
        setCurrentUser(user)
        setLoading(false)
      })

      return unsubscribe
    }, [])

   
    // Values exported to be used through out the application
    const value  = {
        currentUser,
        signup,
        login,
        logout,
        passwordReset,
        updateEmail,
        updatePassword,
        deleteUser
    }


  return (
    <AuthContext.Provider value = {value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}