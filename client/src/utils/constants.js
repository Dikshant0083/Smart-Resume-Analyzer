export const VALIDATION_RULES = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password: {
    minLength: 8,
    hasUpperCase: /[A-Z]/,
    hasLowerCase: /[a-z]/,
    hasNumber: /[0-9]/,
  },
  name: {
    minLength: 2,
    maxLength: 50,
  },
}

export const FILE_LIMITS = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['application/pdf'],
}

export const API_ENDPOINTS = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    firebase: '/api/auth/firebase',
    logout: '/api/auth/logout',
    me: '/api/auth/me',
  },
  resume: {
    upload: '/api/resume',
    list: '/api/resume',
    get: (id) => `/api/resume/${id}`,
    delete: (id) => `/api/resume/${id}`,
    createBuilder: '/api/resume/builder',
    updateBuilder: (id) => `/api/resume/builder/${id}`,
    export: (id) => `/api/resume/${id}/export`,
  },
  analysis: {
    create: '/api/analysis',
    list: '/api/analysis',
    get: (id) => `/api/analysis/${id}`,
    delete: (id) => `/api/analysis/${id}`,
  },
  admin: {
    users: '/api/admin/users',
    stats: '/api/admin/stats',
    toggleUser: (userId) => `/api/admin/users/${userId}/status`,
    analysesByDay: '/api/admin/analyses-by-day',
  },
}

export const SKILL_CATEGORIES = {
  technical: 'Technical',
  soft: 'Soft Skills',
  language: 'Languages',
  tools: 'Tools & Software',
  frameworks: 'Frameworks',
}

export const MATCH_SCORE_THRESHOLDS = {
  excellent: 80,
  good: 60,
  fair: 40,
  poor: 0,
}
