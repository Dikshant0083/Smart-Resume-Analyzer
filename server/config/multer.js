import multer from 'multer'
import path from 'path'

const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
  const fileExtension = path.extname(file.originalname).toLowerCase()
  const isPdfMimeType = file.mimetype === 'application/pdf'
  const isPdfExtension = file.mimetype === 'application/octet-stream' && fileExtension === '.pdf'

  if (isPdfMimeType || isPdfExtension) {
    cb(null, true)
  } else {
    cb(new Error('Only PDF files are allowed'), false)
  }
}

const upload = multer({
  storage,
  limits: {
    fileSize: 4 * 1024 * 1024 // 4MB - Vercel serverless request body safe limit
  },
  fileFilter
})

export default upload