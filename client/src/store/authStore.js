import { create } from 'zustand'
import { authAPI } from '@/api'
import { auth, githubProvider, googleProvider } from '@/firebase'
import { signInWithPopup, signOut } from 'firebase/auth'

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
  google: {
    popupProvider: googleProvider,
    provider: 'google',
  },
  github: {
    popupProvider: githubProvider,
    provider: 'github',
  },
}

const getAuthErrorMessage = (error, fallback) => {
  if (error.response?.data?.message) {
    return error.response.data.message
  }

  switch (error.code) {
    case 'auth/popup-closed-by-user':
      return 'Sign-in popup was closed before authentication completed'
    case 'auth/cancelled-popup-request':
      return 'Another sign-in popup is already open'
    case 'auth/account-exists-with-different-credential':
      return 'An account with this email already exists using a different sign-in method'
    case 'auth/unauthorized-domain':
      return 'This domain is not allowed in your Firebase authentication settings'
    default:
      return error.message || fallback
  }
}

export const useAuthStore = create((set) => ({
  user: readStoredUser(),
  isLoading: false,
  error: null,

  setUser: (user) => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('user')
    }
    set({ user })
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null })
    try {
      const data = await authAPI.login(credentials)
      persistSession(data)
      set({ user: data.user, isLoading: false })
      return data
    } catch (error) {
      const message = getAuthErrorMessage(error, 'Login failed')
      set({ error: message, isLoading: false })
      throw error
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null })
    try {
      const data = await authAPI.register(userData)
      persistSession(data)
      set({ user: data.user, isLoading: false })
      return data
    } catch (error) {
      const message = getAuthErrorMessage(error, 'Registration failed')
      set({ error: message, isLoading: false })
      throw error
    }
  },

  loginWithProvider: async (providerKey) => {
    const providerConfig = firebaseProviders[providerKey]

    if (!providerConfig) {
      const error = new Error('Unsupported Firebase auth provider')
      set({ error: error.message })
      throw error
    }

    set({ isLoading: true, error: null })

    try {
      const result = await signInWithPopup(auth, providerConfig.popupProvider)
      const idToken = await result.user.getIdToken()

      const data = await authAPI.firebaseLogin({
        idToken,
        provider: providerConfig.provider,
        name: result.user.displayName,
        avatar: result.user.photoURL,
      })

      persistSession(data)
      set({ user: data.user, isLoading: false })
      return data
    } catch (error) {
      await signOut(auth).catch(() => {})

      const message = getAuthErrorMessage(error, 'Social sign-in failed')
      set({ error: message, isLoading: false })
      throw error
    }
  },

  logout: () => {
    clearSession()
    signOut(auth).catch(() => {})
    set({ user: null, error: null })
  },

  updateProfile: async (payload) => {
    set({ isLoading: true, error: null })
    try {
      const data = await authAPI.updateProfile(payload)
      // Update persisted session token remains same; replace stored user
      const token = localStorage.getItem('token')
      if (token) {
        localStorage.setItem('user', JSON.stringify(data.user))
      }
      set({ user: data.user, isLoading: false })
      return data
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message || 'Failed to update profile'
      set({ error: message, isLoading: false })
      throw error
    }
  },

  clearError: () => set({ error: null }),
}))
