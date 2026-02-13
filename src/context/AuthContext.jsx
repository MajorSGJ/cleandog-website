import { createContext, useContext, useState } from 'react'
import { adminCredentials } from '../data/defaultData'

const AuthContext = createContext()

// SHA-256 hash function
const sha256 = async (message) => {
  const msgBuffer = new TextEncoder().encode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  const [loginError, setLoginError] = useState('')

  const login = async (username, password) => {
    const passwordHash = await sha256(password)
    if (username === adminCredentials.username && passwordHash === adminCredentials.passwordHash) {
      setIsAuthenticated(true)
      setLoginError('')
      return true
    }
    setLoginError('Nieprawidłowa nazwa użytkownika lub hasło')
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      loginError,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
