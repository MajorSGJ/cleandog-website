import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loginError, setLoginError] = useState('')
  const [token, setToken] = useState(localStorage.getItem('authToken') || null)

  // Check authentication status on mount and token change
  useEffect(() => {
    const checkAuth = async () => {
      if (!token) {
        setIsAuthenticated(false)
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch('/api/auth/check', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        const data = await response.json()
        setIsAuthenticated(data.authenticated)
        
        if (!data.authenticated) {
          localStorage.removeItem('authToken')
          setToken(null)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        setIsAuthenticated(false)
        localStorage.removeItem('authToken')
        setToken(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [token])

  const login = async (username, password) => {
    setLoginError('')
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      })

      const data = await response.json()
      
      if (data.success) {
        setToken(data.token)
        localStorage.setItem('authToken', data.token)
        setIsAuthenticated(true)
        setLoginError('')
        return true
      } else {
        setLoginError(data.error || 'Login failed')
        return false
      }
    } catch (error) {
      console.error('Login error:', error)
      setLoginError('Connection error. Please try again.')
      return false
    }
  }

  const logout = async () => {
    try {
      if (token) {
        await fetch('/api/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('authToken')
      setToken(null)
      setIsAuthenticated(false)
    }
  }

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      isLoading,
      loginError,
      login,
      logout,
      token
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
