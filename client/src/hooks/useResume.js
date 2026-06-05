import { useState, useCallback, useEffect } from 'react'
import { useResumeStore } from '@/store/resumeStore'

export function useResume() {
  const {
    resumes,
    currentResume,
    isLoading,
    error,
    fetchResumes,
    uploadResume,
    createBuilderResume,
    updateBuilderResume,
    fetchResumeById,
    deleteResume,
    setCurrentResume,
    clearError,
  } = useResumeStore()

  const [uploadProgress, setUploadProgress] = useState(0)

  const handleUpload = useCallback(async (file) => {
    setUploadProgress(0)
    try {
      const result = await uploadResume(file)
      setUploadProgress(100)
      return result
    } catch (error) {
      setUploadProgress(0)
      throw error
    }
  }, [uploadResume])

  const handleDelete = useCallback(async (id) => {
    await deleteResume(id)
  }, [deleteResume])

  const handleCreateBuilderResume = useCallback(async (resumeData) => {
    return createBuilderResume(resumeData)
  }, [createBuilderResume])

  const handleUpdateBuilderResume = useCallback(async (id, resumeData) => {
    return updateBuilderResume(id, resumeData)
  }, [updateBuilderResume])

  const handleFetchResumeById = useCallback(async (id) => {
    return fetchResumeById(id)
  }, [fetchResumeById])

  return {
    resumes,
    currentResume,
    isLoading,
    error,
    uploadProgress,
    fetchResumes,
    uploadResume: handleUpload,
    createBuilderResume: handleCreateBuilderResume,
    updateBuilderResume: handleUpdateBuilderResume,
    fetchResumeById: handleFetchResumeById,
    deleteResume: handleDelete,
    setCurrentResume,
    clearError,
  }
}