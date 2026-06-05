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
    login: '/auth/login',
    register: '/auth/register',
    firebase: '/auth/firebase',
    logout: '/auth/logout',
    me: '/auth/me',
  },
  resume: {
    upload: '/resume',
    list: '/resume',
    get: (id) => `/resume/${id}`,
    delete: (id) => `/resume/${id}`,
    createBuilder: '/resume/builder',
    updateBuilder: (id) => `/resume/builder/${id}`,
    export: (id) => `/resume/${id}/export`,
  },
  analysis: {
    create: '/analysis',
    list: '/analysis',
    get: (id) => `/analysis/${id}`,
    delete: (id) => `/analysis/${id}`,
  },
  admin: {
    users: '/admin/users',
    stats: '/admin/stats',
    toggleUser: (userId) => `/admin/users/${userId}/status`,
    analysesByDay: '/admin/analyses-by-day',
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
