import { createContext, useContext, useCallback } from 'react'
import { useAuthStore } from '@/store/authStore'

// AuthContext delegates entirely to the Zustand authStore
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const store = useAuthStore()
  return <AuthContext.Provider value={store}>{children}</AuthContext.Provider>
}

// useAuth — primary hook used across the app
export function useAuth() {
  const {
    user,
    isLoading,
    error,
    login: storeLogin,
    register: storeRegister,
    loginWithProvider: storeLoginWithProvider,
    logout: storeLogout,
    clearError: storeClearError,
  } = useAuthStore()

  const isAuthenticated = !!user && !!localStorage.getItem('token')

  const login = useCallback((credentials) => storeLogin(credentials), [storeLogin])
  const register = useCallback((userData) => storeRegister(userData), [storeRegister])
  const loginWithProvider = useCallback((provider) => storeLoginWithProvider(provider), [storeLoginWithProvider])
  const logout = useCallback(() => storeLogout(), [storeLogout])
  const clearError = useCallback(() => storeClearError(), [storeClearError])

  return { user, isLoading, error, isAuthenticated, login, register, loginWithProvider, logout, clearError }
}