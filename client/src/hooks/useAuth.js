import { useState, useEffect, useCallback } from 'react'
import { useAuthStore } from '@/store/authStore'

export function useAuth() {
  const {
    user,
    isLoading,
    error,
    login: storeLogin,
    register: storeRegister,
    loginWithProvider: storeLoginWithProvider,
    logout: storeLogout,
  } = useAuthStore()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsAuthenticated(!!token && !!user)
  }, [user])

  const login = useCallback(async (credentials) => {
    return await storeLogin(credentials)
  }, [storeLogin])

  const register = useCallback(async (userData) => {
    return await storeRegister(userData)
  }, [storeRegister])

  const loginWithProvider = useCallback(async (provider) => {
    return await storeLoginWithProvider(provider)
  }, [storeLoginWithProvider])

  const logout = useCallback(() => {
    storeLogout()
  }, [storeLogout])

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    login,
    register,
    loginWithProvider,
    logout,
  }
}
