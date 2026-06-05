import User from '../models/User.js'
import Resume from '../models/Resume.js'
import Analysis from '../models/Analysis.js'
import { asyncHandler } from '../middleware/errorHandler.js'

// @desc    Get all users (admin)
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 })

  // Add resume count to each user
  const usersWithCounts = await Promise.all(
    users.map(async (user) => {
      const resumeCount = await Resume.countDocuments({ user: user._id })
      return {
        ...user.toObject(),
        resumeCount
      }
    })
  )

  res.json({
    success: true,
    users: usersWithCounts
  })
})

// @desc    Get admin stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getStats = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalResumes,
    totalAnalyses,
    activeUsers
  ] = await Promise.all([
    User.countDocuments(),
    Resume.countDocuments(),
    Analysis.countDocuments(),
    User.countDocuments({
      lastLogin: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    })
  ])

  res.json({
    success: true,
    stats: {
      totalUsers,
      totalResumes,
      totalAnalyses,
      activeUsers
    }
  })
})

// @desc    Toggle user active status
// @route   PATCH /api/admin/users/:id/status
// @access  Private/Admin
export const toggleUserStatus = asyncHandler(async (req, res) => {
  const { isActive } = req.body
  const user = await User.findById(req.params.id)

  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  // Prevent deactivating admin users
  if (user.role === 'admin') {
    res.status(400)
    throw new Error('Cannot change status of admin users')
  }

  user.isActive = isActive
  await user.save()

  res.json({
    success: true,
    user: {
      ...user.toObject(),
      resumeCount: await Resume.countDocuments({ user: user._id }),
      analysisCount: await Analysis.countDocuments({ user: user._id })
    }
  })
})

// @desc    Get analyses by day (last 30 days)
// @route   GET /api/admin/analyses-by-day
// @access  Private/Admin
export const getAnalysesByDay = asyncHandler(async (req, res) => {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  thirtyDaysAgo.setHours(0, 0, 0, 0)

  const analyses = await Analysis.aggregate([
    {
      $match: {
        createdAt: { $gte: thirtyDaysAgo }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    },
    {
      $project: {
        date: '$_id',
        count: 1,
        _id: 0
      }
    }
  ])

  res.json({
    success: true,
    data: analyses
  })
})