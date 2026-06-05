import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import connectDB from './config/db.js'
import { errorHandler } from './middleware/errorHandler.js'
import rateLimit from './middleware/rateLimiter.js'

// Route imports
import authRoutes from './routes/auth.js'
import resumeRoutes from './routes/resume.js'
import analysisRoutes from './routes/analysis.js'
import adminRoutes from './routes/admin.js'

// Load env vars from server/.env
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.join(__dirname, '.env') })

const app = express()

// Body parser
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// CORS
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

// Rate limiting
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 1000 }))

// ✅ Health check — NO DB needed, responds instantly
// MUST be before the DB middleware
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'ResumeIQ API is running' })
})

// ✅ DB connection middleware — only for actual data routes
// NOT global — health check above is excluded
const dbMiddleware = async (req, res, next) => {
  try {
    await connectDB()
    next()
  } catch (error) {
    console.error('DB connection failed:', error.message)
    res.status(500).json({
      success: false,
      message: 'Database unavailable. Please try again in a moment.',
    })
  }
}

// Mount routes with DB middleware applied per-router
app.use('/api/auth', dbMiddleware, authRoutes)
app.use('/api/resume', dbMiddleware, resumeRoutes)
app.use('/api/analysis', dbMiddleware, analysisRoutes)
app.use('/api/admin', dbMiddleware, adminRoutes)

// Error handler
app.use(errorHandler)

// Only start HTTP server in local dev
const PORT = process.env.PORT || 5000
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

export default app