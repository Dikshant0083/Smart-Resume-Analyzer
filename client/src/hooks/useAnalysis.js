import { useState, useCallback } from 'react'
import { useResumeStore } from '@/store/resumeStore'

export function useAnalysis() {
  const analyses = useResumeStore((state) => state.analyses)
  const currentAnalysis = useResumeStore((state) => state.currentAnalysis)
  const isLoading = useResumeStore((state) => state.isLoading)
  const error = useResumeStore((state) => state.error)
  const fetchAnalyses = useResumeStore((state) => state.fetchAnalyses)
  const createAnalysis = useResumeStore((state) => state.createAnalysis)
  const fetchAnalysisById = useResumeStore((state) => state.fetchAnalysisById)
  const deleteAnalysis = useResumeStore((state) => state.deleteAnalysis)
  const setCurrentAnalysis = useResumeStore((state) => state.setCurrentAnalysis)
  const clearError = useResumeStore((state) => state.clearError)

  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const analyze = useCallback(async (data) => {
    setIsAnalyzing(true)
    try {
      const result = await createAnalysis(data)
      return result
    } finally {
      setIsAnalyzing(false)
    }
  }, [createAnalysis])

  const getAnalysis = useCallback(async (id) => {
    return await fetchAnalysisById(id)
  }, [fetchAnalysisById])

  const removeAnalysis = useCallback(async (id) => {
    await deleteAnalysis(id)
  }, [deleteAnalysis])

  return {
    analyses,
    currentAnalysis,
    isLoading,
    isAnalyzing,
    error,
    fetchAnalyses,
    fetchAnalysisById,
    deleteAnalysis,
    analyze,
    getAnalysis,
    removeAnalysis,
    setCurrentAnalysis,
    clearError,
  }
}
