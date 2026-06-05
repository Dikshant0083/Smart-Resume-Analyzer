import api from './axios'
import { API_ENDPOINTS } from '../utils/constants'

export const authAPI = {
  login: async (credentials) => {
    const response = await api.post(API_ENDPOINTS.auth.login, credentials)
    return response.data
  },

  register: async (userData) => {
    const response = await api.post(API_ENDPOINTS.auth.register, userData)
    return response.data
  },

  firebaseLogin: async (payload) => {
    const response = await api.post(API_ENDPOINTS.auth.firebase, payload)
    return response.data
  },

  logout: async () => {
    const response = await api.post(API_ENDPOINTS.auth.logout)
    return response.data
  },

  getCurrentUser: async () => {
    const response = await api.get(API_ENDPOINTS.auth.me)
    return response.data
  },
  updateProfile: async (payload) => {
    const response = await api.patch(API_ENDPOINTS.auth.me, payload)
    return response.data
  },
}

export const resumeAPI = {
  upload: async (formData) => {
    const response = await api.post(API_ENDPOINTS.resume.upload, formData)
    return response.data
  },

  getAll: async () => {
    const response = await api.get(API_ENDPOINTS.resume.list)
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(API_ENDPOINTS.resume.get(id))
    return response.data
  },

  delete: async (id) => {
    const response = await api.delete(API_ENDPOINTS.resume.delete(id))
    return response.data
  },

  createBuilder: async (data) => {
    const response = await api.post(API_ENDPOINTS.resume.createBuilder, data)
    return response.data
  },

  updateBuilder: async (id, data) => {
    const response = await api.patch(API_ENDPOINTS.resume.updateBuilder(id), data)
    return response.data
  },

  exportPDF: async (id) => {
    const response = await api.get(API_ENDPOINTS.resume.export(id), {
      responseType: 'blob',
    })
    return response.data
  },
}

export const analysisAPI = {
  create: async (data) => {
    const response = await api.post(API_ENDPOINTS.analysis.create, data)
    return response.data
  },

  getAll: async () => {
    const response = await api.get(API_ENDPOINTS.analysis.list)
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(API_ENDPOINTS.analysis.get(id))
    return response.data
  },

  delete: async (id) => {
    const response = await api.delete(API_ENDPOINTS.analysis.delete(id))
    return response.data
  },

  exportPDF: async (id) => {
    const response = await api.get(`/api/analysis/${id}/export`, {
      responseType: 'blob',
    })
    return response.data
  },
}

export const adminAPI = {
  getUsers: async () => {
    const response = await api.get(API_ENDPOINTS.admin.users)
    return response.data
  },

  getStats: async () => {
    const response = await api.get(API_ENDPOINTS.admin.stats)
    return response.data
  },

  toggleUserStatus: async (userId, isActive) => {
    const response = await api.patch(API_ENDPOINTS.admin.toggleUser(userId), { isActive })
    return response.data
  },

  getAnalysesByDay: async () => {
    const response = await api.get(API_ENDPOINTS.admin.analysesByDay)
    return response.data
  },
}
