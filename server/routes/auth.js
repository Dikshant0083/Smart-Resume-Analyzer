import express from 'express'
import { register, login, firebaseLogin, getMe, logout, updateMe } from '../controllers/authController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/firebase', firebaseLogin)
router.get('/me', protect, getMe)
router.patch('/me', protect, updateMe)
router.post('/logout', protect, logout)

export default router
