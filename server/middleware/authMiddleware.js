import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { verifyToken } from '../config/jwt.js'

export const protect = async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    })
  }

  try {
    const decoded = verifyToken(token)
    req.user = await User.findById(decoded.id)
    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      })
    }
    
    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    })
  }
}

export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next()
  } else {
    res.status(403).json({
      success: false,
      message: 'Not authorized as admin'
    })
  }
}