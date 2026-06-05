import express from 'express'
import { createAnalysis, getAnalyses, getAnalysis, deleteAnalysis, exportAnalysisPDF } from '../controllers/analysisController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/')
  .post(protect, createAnalysis)
  .get(protect, getAnalyses)

router.route('/:id')
  .get(protect, getAnalysis)
  .delete(protect, deleteAnalysis)

router.get('/:id/export', protect, exportAnalysisPDF)

export default router