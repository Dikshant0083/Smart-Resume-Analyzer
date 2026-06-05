import express from 'express'
import {
  uploadResume,
  createBuilderResume,
  updateBuilderResume,
  exportResumePDF,
  getResumes,
  getResume,
  deleteResume,
} from '../controllers/resumeController.js'
import { protect } from '../middleware/authMiddleware.js'
import upload from '../config/multer.js'

const router = express.Router()

router.route('/')
  .post(protect, upload.single('resume'), uploadResume)
  .get(protect, getResumes)

router.route('/builder')
  .post(protect, createBuilderResume)

router.route('/builder/:id')
  .patch(protect, updateBuilderResume)

router.route('/:id/export')
  .get(protect, exportResumePDF)

router.route('/:id')
  .get(protect, getResume)
  .delete(protect, deleteResume)

export default router