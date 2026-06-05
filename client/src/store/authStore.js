import { create } from 'zustand'
import { authAPI } from '@/api'
import { auth, githubProvider, googleProvider } from '@/firebase'
import {
  signInWithPopup,
  signOut
} from 'firebase/auth'

const readStoredUser = () => {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const storedUser = localStorage.getItem('user')
    return storedUser ? JSON.parse(storedUser) : null
  } catch (error) {
    localStorage.removeItem('user')
    return null
  }
}

const persistSession = ({ token, user }) => {
  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(user))
}

const clearSession = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

const firebaseProviders = {
  google: googleProvider,
  github: githubProvider,
}

const getAuthErrorMessage = (error, fallback) => {
  if (error.response?.data?.message) {
    return error.response.data.message
  }

  switch (error.code) {
    case 'auth/popup-blocked':
      return 'Popup was blocked by your browser. Please allow popups for this site and try again.'
    case 'auth/popup-closed-by-user':
      return 'Sign-in window was closed before authentication completed.'
    case 'auth/cancelled-popup-request':
      return 'Another sign-in request is already in progress.'
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with the same email but different sign-in credentials.'
    case 'auth/unauthorized-domain':
      return 'This domain is not authorized in Firebase. Please contact support.'
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection and try again.'
    default:
      return error.message || fallback
  }
}

export const useAuthStore = create((set) => ({
  user: readStoredUser(),
  isLoading: false,
  error: null,

  // Email/password login
  login: async (credentials) => {
    set({ isLoading: true, error: null })

    try {
      const data = await authAPI.login(credentials)
      persistSession(data)
      set({
        user: data.user,
        isLoading: false,
        error: null,
      })
      return data
    } catch (error) {
      const message = getAuthErrorMessage(error, 'Login failed. Please check your credentials.')
      set({ error: message, isLoading: false })
      throw error
    }
  },

  // Email/password registration
  register: async (userData) => {
    set({ isLoading: true, error: null })

    try {
      const data = await authAPI.register(userData)
      persistSession(data)
      set({
        user: data.user,
        isLoading: false,
        error: null,
      })
      return data
    } catch (error) {
      const message = getAuthErrorMessage(error, 'Registration failed. Please try again.')
      set({ error: message, isLoading: false })
      throw error
    }
  },

  // Google / GitHub OAuth via popup (works on localhost AND Vercel)
  loginWithProvider: async (providerKey) => {
    const provider = firebaseProviders[providerKey]

    if (!provider) {
      throw new Error('Unsupported sign-in provider: ' + providerKey)
    }

    set({ isLoading: true, error: null })

    try {
      // signInWithPopup works reliably on all environments
      const result = await signInWithPopup(auth, provider)

      const providerName = result.providerId === 'github.com' ? 'github' : 'google'
      const idToken = await result.user.getIdToken()

      const data = await authAPI.firebaseLogin({
        idToken,
        provider: providerName,
        name: result.user.displayName,
        avatar: result.user.photoURL,
      })

      persistSession(data)

      set({
        user: data.user,
        isLoading: false,
        error: null,
      })

      return data
    } catch (error) {
      // Sign out from Firebase if backend call failed
      await signOut(auth).catch(() => {})

      const message = getAuthErrorMessage(error, 'Social sign-in failed. Please try again.')
      set({ error: message, isLoading: false })
      throw error
    }
  },

  // Clear error state (useful to reset error on form change)
  clearError: () => {
    set({ error: null })
  },

  logout: () => {
    clearSession()
    signOut(auth).catch(() => {})
    set({ user: null, error: null })
  },
}))