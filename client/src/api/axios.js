import axios from 'axios'

const rawApiUrl = import.meta.env.VITE_API_URL || '/api'
const normalizedApiUrl = rawApiUrl.trim().replace(/\/+$|^\s+|\s+$/g, '')
const API_URL = normalizedApiUrl.startsWith('/') ? normalizedApiUrl : `/${normalizedApiUrl}`

const api = axios.create({
  baseURL: API_URL,
})

// Request interceptor to add auth token
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

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api