import express from 'express'
import { getUsers, getStats, toggleUserStatus, getAnalysesByDay } from '../controllers/adminController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/users', protect, admin, getUsers)
router.get('/stats', protect, admin, getStats)
router.patch('/users/:id/status', protect, admin, toggleUserStatus)
router.get('/analyses-by-day', protect, admin, getAnalysesByDay)

export default router