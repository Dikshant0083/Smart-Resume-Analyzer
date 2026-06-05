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

// Load env vars
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// Connect to database
connectDB()

// Body parser - with extended parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Enable CORS - allow all origins for development
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// Rate limiting - more permissive for development
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 1000 }))

// Mount routes
app.use('/api/auth', authRoutes)
app.use('/api/resume', resumeRoutes)
app.use('/api/analysis', analysisRoutes)
app.use('/api/admin', adminRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'ResumeIQ API is running' })
})

// Error handler
app.use(errorHandler)

const PORT = process.env.PORT || 5000

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

export default app