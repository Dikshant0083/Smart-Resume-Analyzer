import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '@/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      fetchCurrentUser()
    } else {
      setIsLoading(false)
    }
  }, [])

  const fetchCurrentUser = async () => {
    try {
      const data = await authAPI.getCurrentUser()
      setUser(data.user)
    } catch (err) {
      localStorage.removeItem('token')
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (credentials) => {
    setError(null)
    try {
      const data = await authAPI.login(credentials)
      localStorage.setItem('token', data.token)
      setUser(data.user)
      return data
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
      throw err
    }
  }

  const register = async (userData) => {
    setError(null)
    try {
      const data = await authAPI.register(userData)
      localStorage.setItem('token', data.token)
      setUser(data.user)
      return data
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
      throw err
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  const value = {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}