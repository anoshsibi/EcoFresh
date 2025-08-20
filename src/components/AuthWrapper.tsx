import { useState, useEffect } from 'react'
import Login from './Login'
import Signup from './Signup'
import { loginUser, registerUser } from '../services/authService'
import { auth } from '../services/firebase'
import { onAuthStateChanged } from 'firebase/auth'

interface UserData {
  id: string
  email: string
  firstName: string
  lastName: string
  loginTime: string
}

interface AuthWrapperProps {
  onAuthSuccess: (userData: UserData) => void
}

export default function AuthWrapper({ onAuthSuccess }: AuthWrapperProps) {
  const [isLogin, setIsLogin] = useState(true)

  // Set up auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, retrieve additional data from Firestore if needed
        // For now, we'll just use the basic user info
        const userData = {
          id: user.uid,
          email: user.email || '',
          firstName: user.displayName?.split(' ')[0] || '',
          lastName: user.displayName?.split(' ')[1] || '',
          loginTime: new Date().toISOString()
        }
        
        localStorage.setItem('ecofresh_user', JSON.stringify(userData))
        onAuthSuccess(userData)
      }
    })
    
    return () => unsubscribe()
  }, [])

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      const success = await loginUser(email, password)
      return success
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const handleSignup = async (userData: {
    firstName: string
    lastName: string
    email: string
    password: string
  }): Promise<boolean> => {
    try {
      const result = await registerUser(userData)
      if (!result.success && result.error) {
        console.error('Signup error:', result.error)
      }
      return result.success
    } catch (error) {
      console.error('Signup error:', error)
      return false
    }
  }

  return (
    <>
      {isLogin ? (
        <Login 
          onLogin={handleLogin}
          onSwitchToSignup={() => setIsLogin(false)}
        />
      ) : (
        <Signup 
          onSignup={handleSignup}
          onSwitchToLogin={() => setIsLogin(true)}
        />
      )}
    </>
  )
}
