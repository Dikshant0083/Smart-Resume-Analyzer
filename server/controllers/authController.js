import User from '../models/User.js'
import crypto from 'crypto'
import { generateToken } from '../config/jwt.js'
import { verifyFirebaseIdToken } from '../config/firebaseAuth.js'
import { asyncHandler } from '../middleware/errorHandler.js'

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide name, email and password'
    })
  }

  // Check if user exists
  const userExists = await User.findOne({ email: email.toLowerCase() })
  if (userExists) {
    return res.status(400).json({
      success: false,
      message: 'User already exists'
    })
  }

  // Create user
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password
  })

  const token = generateToken(user._id)

  res.status(201).json({
    success: true,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar
    }
  })
})

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email and password'
    })
  }

  // Check for user
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password')
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    })
  }

  // Check password
  const isMatch = await user.comparePassword(password)
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    })
  }

  const token = generateToken(user._id)

  res.json({
    success: true,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar
    }
  })
})

// @desc    Authenticate user with Firebase
// @route   POST /api/auth/firebase
// @access  Public
export const firebaseLogin = asyncHandler(async (req, res) => {
  const { idToken, name, avatar } = req.body

  if (!idToken) {
    return res.status(400).json({
      success: false,
      message: 'Firebase ID token is required'
    })
  }

  let decodedToken

  try {
    decodedToken = await verifyFirebaseIdToken(idToken)
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid Firebase token'
    })
  }

  const signInProvider = decodedToken.firebase?.sign_in_provider
  const allowedProviders = new Set(['google.com', 'github.com'])

  if (!allowedProviders.has(signInProvider)) {
    return res.status(400).json({
      success: false,
      message: 'Only Google and GitHub sign-in are supported'
    })
  }

  if (!decodedToken.email || decodedToken.email_verified === false) {
    return res.status(400).json({
      success: false,
      message: 'Firebase account must have a verified email address'
    })
  }

  const email = decodedToken.email.toLowerCase()
  const emailName = email.split('@')[0]
  const displayName = (name || decodedToken.name || emailName).trim() || emailName
  const profilePhoto = avatar || decodedToken.picture || ''

  let user = await User.findOne({ email })

  if (!user) {
    user = await User.create({
      name: displayName,
      email,
      password: crypto.randomBytes(24).toString('hex'),
      avatar: profilePhoto
    })
  } else {
    const shouldUpdateAvatar = profilePhoto && user.avatar !== profilePhoto

    if (shouldUpdateAvatar) {
      user.avatar = profilePhoto
      await user.save()
    }
  }

  const token = generateToken(user._id)

  res.json({
    success: true,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar
    }
  })
})

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)

  res.json({
    success: true,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      resumeCount: user.resumeCount,
      analysisCount: user.analysisCount
    }
  })
})

// @desc    Update current logged in user
// @route   PATCH /api/auth/me
// @access  Private
export const updateMe = asyncHandler(async (req, res) => {
  const { name, avatar, password } = req.body

  const user = await User.findById(req.user.id).select('+password')
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' })
  }

  if (name) user.name = name
  if (avatar !== undefined) user.avatar = avatar
  if (password) user.password = password

  await user.save()

  res.json({
    success: true,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      resumeCount: user.resumeCount,
      analysisCount: user.analysisCount
    }
  })
})

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  })
})
