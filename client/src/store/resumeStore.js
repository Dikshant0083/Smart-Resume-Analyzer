import { create } from 'zustand'
import { resumeAPI, analysisAPI } from '@/api'

export const useResumeStore = create((set, get) => ({
  resumes: [],
  currentResume: null,
  analyses: [],
  currentAnalysis: null,
  isLoading: false,
  error: null,

  setResumes: (resumes) => set({ resumes }),
  setCurrentResume: (resume) => set({ currentResume: resume }),
  setAnalyses: (analyses) => set({ analyses }),
  setCurrentAnalysis: (analysis) => set({ currentAnalysis: analysis }),

  fetchResumes: async () => {
    set({ isLoading: true, error: null })
    try {
      const data = await resumeAPI.getAll()
      set({ resumes: data.resumes, isLoading: false })
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch resumes', isLoading: false })
    }
  },

  uploadResume: async (file) => {
    set({ isLoading: true, error: null })
    try {
      const formData = new FormData()
      formData.append('resume', file)
      const data = await resumeAPI.upload(formData)
      set((state) => ({
        resumes: [data.resume, ...state.resumes],
        currentResume: data.resume,
        isLoading: false,
      }))
      return data
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to upload resume', isLoading: false })
      throw error
    }
  },

  createBuilderResume: async (resumeData) => {
    set({ isLoading: true, error: null })
    try {
      const data = await resumeAPI.createBuilder(resumeData)
      set((state) => ({
        resumes: [data.resume, ...state.resumes],
        currentResume: data.resume,
        isLoading: false,
      }))
      return data
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to save resume', isLoading: false })
      throw error
    }
  },

  updateBuilderResume: async (id, resumeData) => {
    set({ isLoading: true, error: null })
    try {
      const data = await resumeAPI.updateBuilder(id, resumeData)
      set((state) => ({
        resumes: state.resumes.map((resume) => (resume._id === id ? data.resume : resume)),
        currentResume: data.resume,
        isLoading: false,
      }))
      return data
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to update resume', isLoading: false })
      throw error
    }
  },

  fetchResumeById: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const data = await resumeAPI.getById(id)
      set({ currentResume: data.resume, isLoading: false })
      return data
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch resume', isLoading: false })
      throw error
    }
  },

  deleteResume: async (id) => {
    set({ isLoading: true, error: null })
    try {
      await resumeAPI.delete(id)
      set((state) => ({
        resumes: state.resumes.filter((r) => r._id !== id),
        isLoading: false,
      }))
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to delete resume', isLoading: false })
      throw error
    }
  },

  fetchAnalyses: async () => {
    set({ isLoading: true, error: null })
    try {
      const data = await analysisAPI.getAll()
      set({ analyses: data.analyses, isLoading: false })
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch analyses', isLoading: false })
    }
  },

  createAnalysis: async (analysisData) => {
    set({ isLoading: true, error: null })
    try {
      const data = await analysisAPI.create(analysisData)
      set((state) => ({
        analyses: [data.analysis, ...state.analyses],
        currentAnalysis: data.analysis,
        isLoading: false,
      }))
      return data
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to create analysis', isLoading: false })
      throw error
    }
  },

  fetchAnalysisById: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const data = await analysisAPI.getById(id)
      set({ currentAnalysis: data.analysis, isLoading: false })
      return data
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch analysis', isLoading: false })
      throw error
    }
  },

  deleteAnalysis: async (id) => {
    set({ isLoading: true, error: null })
    try {
      await analysisAPI.delete(id)
      set((state) => ({
        analyses: state.analyses.filter((a) => a._id !== id),
        isLoading: false,
      }))
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to delete analysis', isLoading: false })
      throw error
    }
  },

  clearError: () => set({ error: null }),
}))