import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000, // 15 second timeout — prevents form from hanging forever
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor — attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor — handle 401 and network errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Session expired — clear token and redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
      return Promise.reject(error)
    }

    // Network error or timeout — wrap with a clear message
    if (!error.response) {
      const networkError = new Error(
        error.code === 'ECONNABORTED'
          ? 'Request timed out. Please try again.'
          : 'Unable to connect to the server. Please check your connection.'
      )
      networkError.response = null
      return Promise.reject(networkError)
    }

    return Promise.reject(error)
  }
)

export default api