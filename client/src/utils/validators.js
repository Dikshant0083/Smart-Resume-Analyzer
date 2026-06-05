export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address'
  }
  return null
}

export const validatePassword = (password) => {
  if (password.length < 8) {
    return 'Password must be at least 8 characters'
  }
  return null
}

export const validateName = (name) => {
  if (name.length < 2) {
    return 'Name must be at least 2 characters'
  }
  if (name.length > 50) {
    return 'Name must be less than 50 characters'
  }
  return null
}

export const validateFile = (file) => {
  if (!file) {
    return 'Please select a file'
  }
  if (file.type !== 'application/pdf') {
    return 'Only PDF files are allowed'
  }
  if (file.size > 5 * 1024 * 1024) {
    return 'File size must be less than 5MB'
  }
  return null
}

export const validateJobDescription = (text) => {
  if (!text || text.trim().length < 50) {
    return 'Please provide a job description (at least 50 characters)'
  }
  return null
}