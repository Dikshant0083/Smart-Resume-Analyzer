import Resume from '../models/Resume.js'
import User from '../models/User.js'
import { asyncHandler } from '../middleware/errorHandler.js'
import { extractTextFromPDF } from '../services/pdfParser.js'
import { extractSkills, extractEducation, extractExperience } from '../services/nlpExtractor.js'

const buildTextContentFromData = (data) => {
  const chunks = []
  if (data.personal) {
    const { fullName, title, email, phone, location, linkedin, github, website } = data.personal
    if (fullName) chunks.push(fullName)
    if (title) chunks.push(title)
    if (email) chunks.push(email)
    if (phone) chunks.push(phone)
    if (location) chunks.push(location)
    if (linkedin) chunks.push(linkedin)
    if (github) chunks.push(github)
    if (website) chunks.push(website)
  }
  if (data.summary) chunks.push(data.summary)
  if (data.skills && data.skills.length) chunks.push(data.skills.join(' '))
  if (data.experience && data.experience.length) {
    data.experience.forEach((item) => {
      chunks.push(item.company, item.role, item.dates, item.location, item.details)
    })
  }
  if (data.education && data.education.length) {
    data.education.forEach((item) => {
      chunks.push(item.school, item.degree, item.dates, item.details)
    })
  }
  if (data.projects && data.projects.length) {
    data.projects.forEach((item) => {
      chunks.push(item.name, item.description, item.link)
    })
  }
  return chunks.filter(Boolean).join(' ')
}

// @desc    Upload resume
// @route   POST /api/resume
// @access  Private
export const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'Please upload a file'
    })
  }

  // Extract text from PDF
  const textContent = await extractTextFromPDF(req.file.path)

  // Extract structured data
  const skills = extractSkills(textContent)
  const education = extractEducation(textContent)
  const experience = extractExperience(textContent)

  const resume = await Resume.create({
    user: req.user.id,
    originalName: req.file.originalname,
    fileName: req.file.filename,
    filePath: req.file.path,
    fileSize: req.file.size,
    textContent,
    extractedData: {
      skills,
      education,
      experience
    }
  })

  // Update user resume count
  await User.findByIdAndUpdate(req.user.id, {
    $inc: { resumeCount: 1 }
  })

  res.status(201).json({
    success: true,
    resume
  })
})

// @desc    Create builder resume
// @route   POST /api/resume/builder
// @access  Private
export const createBuilderResume = asyncHandler(async (req, res) => {
  const { resumeTitle, template, resumeData } = req.body
  const textContent = buildTextContentFromData(resumeData || {})

  const resume = await Resume.create({
    user: req.user.id,
    resumeTitle: resumeTitle || 'Untitled Resume',
    template: template || 'modern',
    resumeData: resumeData || {},
    textContent,
    originalName: resumeTitle || 'Untitled Resume',
  })

  await User.findByIdAndUpdate(req.user.id, {
    $inc: { resumeCount: 1 }
  })

  res.status(201).json({
    success: true,
    resume
  })
})

// @desc    Update builder resume
// @route   PATCH /api/resume/builder/:id
// @access  Private
export const updateBuilderResume = asyncHandler(async (req, res) => {
  const { resumeTitle, template, resumeData } = req.body

  const resume = await Resume.findOne({ _id: req.params.id, user: req.user.id })
  if (!resume) {
    return res.status(404).json({ success: false, message: 'Resume not found' })
  }

  resume.resumeTitle = resumeTitle || resume.resumeTitle
  resume.template = template || resume.template
  resume.resumeData = resumeData || resume.resumeData
  resume.textContent = buildTextContentFromData(resume.resumeData || {})

  await resume.save()

  res.json({
    success: true,
    resume
  })
})

// @desc    Export resume as PDF
// @route   GET /api/resume/:id/export
// @access  Private
export const exportResumePDF = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({
    _id: req.params.id,
    user: req.user.id
  })

  if (!resume) {
    return res.status(404).json({
      success: false,
      message: 'Resume not found'
    })
  }

  // For uploaded resumes, send the original file when file exists.
  if (resume.filePath) {
    return res.download(resume.filePath, resume.originalName)
  }

  // Generate PDF for builder resumes
  const PDFModule = await import('pdfkit')
  const PDFDocument = PDFModule.default || PDFModule
  const doc = new PDFDocument({ 
    margin: 50,
    bufferPages: true
  })

  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition', `attachment; filename="${resume.resumeTitle || 'resume'}.pdf"`)

  doc.pipe(res)

  const { personal = {}, summary = '', skills = [], education = [], experience = [], projects = [] } = resume.resumeData || {}
  const pageWidth = doc.page.width - 100 // accounting for margins

  // Helper function to add section titles
  const addSectionTitle = (title) => {
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#111827').text(title)
    doc.moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).stroke('#e5e7eb')
    doc.moveDown(0.3)
  }

  // Header: Full Name
  doc.fontSize(28).font('Helvetica-Bold').fillColor('#1f2937').text(personal.fullName || resume.resumeTitle, {
    width: pageWidth,
    align: 'left'
  })

  // Subtitle: Job Title
  if (personal.title) {
    doc.fontSize(14).font('Helvetica').fillColor('#6b7280').text(personal.title, {
      width: pageWidth,
      align: 'left'
    })
  }
  doc.moveDown(0.5)

  // Contact Information
  const contactItems = []
  if (personal.email) contactItems.push(personal.email)
  if (personal.phone) contactItems.push(personal.phone)
  if (personal.location) contactItems.push(personal.location)
  if (personal.linkedin) contactItems.push(personal.linkedin)
  if (personal.github) contactItems.push(personal.github)
  if (personal.website) contactItems.push(personal.website)

  if (contactItems.length > 0) {
    doc.fontSize(9).fillColor('#6b7280').text(contactItems.join(' | '), {
      width: pageWidth,
      align: 'left'
    })
  }
  doc.moveDown(1)

  // Summary Section
  if (summary && summary.trim()) {
    addSectionTitle('Professional Summary')
    doc.fontSize(10).fillColor('#111827').font('Helvetica').text(summary, {
      width: pageWidth,
      align: 'left',
      lineGap: 3
    })
    doc.moveDown(0.8)
  }

  // Skills Section
  if (skills && skills.length > 0) {
    addSectionTitle('Skills')
    const skillsText = skills.filter(Boolean).join(' • ')
    doc.fontSize(10).fillColor('#111827').text(skillsText, {
      width: pageWidth,
      align: 'left',
      lineGap: 2
    })
    doc.moveDown(0.8)
  }

  // Experience Section
  if (experience && experience.length > 0) {
    addSectionTitle('Professional Experience')
    experience.forEach((item, index) => {
      if (!item) return

      // Position and Company
      const positionText = `${item.role || 'Position'} • ${item.company || 'Company'}`
      doc.fontSize(11).font('Helvetica-Bold').fillColor('#1f2937').text(positionText, {
        width: pageWidth,
        align: 'left'
      })

      // Dates and Location on same line
      const dateLocation = [item.dates, item.location].filter(Boolean).join(' | ')
      if (dateLocation) {
        doc.fontSize(9).fillColor('#6b7280').font('Helvetica').text(dateLocation, {
          width: pageWidth,
          align: 'left'
        })
      }

      // Description
      if (item.details) {
        doc.moveDown(0.2)
        doc.fontSize(10).fillColor('#111827').font('Helvetica').text(item.details, {
          width: pageWidth,
          align: 'left',
          lineGap: 2
        })
      }

      if (index < experience.length - 1) {
        doc.moveDown(0.6)
      }
    })
    doc.moveDown(0.8)
  }

  // Education Section
  if (education && education.length > 0) {
    addSectionTitle('Education')
    education.forEach((item, index) => {
      if (!item) return

      // Degree and School
      const degreeText = `${item.degree || 'Degree'} • ${item.school || 'Institution'}`
      doc.fontSize(11).font('Helvetica-Bold').fillColor('#1f2937').text(degreeText, {
        width: pageWidth,
        align: 'left'
      })

      // Dates
      if (item.dates) {
        doc.fontSize(9).fillColor('#6b7280').font('Helvetica').text(item.dates, {
          width: pageWidth,
          align: 'left'
        })
      }

      // Details
      if (item.details) {
        doc.moveDown(0.2)
        doc.fontSize(10).fillColor('#111827').font('Helvetica').text(item.details, {
          width: pageWidth,
          align: 'left',
          lineGap: 2
        })
      }

      if (index < education.length - 1) {
        doc.moveDown(0.6)
      }
    })
    doc.moveDown(0.8)
  }

  // Projects Section
  if (projects && projects.length > 0) {
    addSectionTitle('Projects')
    projects.forEach((item, index) => {
      if (!item) return

      // Project Name
      doc.fontSize(11).font('Helvetica-Bold').fillColor('#1f2937').text(item.name || 'Project', {
        width: pageWidth,
        align: 'left'
      })

      // Project Link
      if (item.link) {
        doc.fontSize(9).fillColor('#0066cc').font('Helvetica').text(item.link, {
          width: pageWidth,
          align: 'left'
        })
      }

      // Description
      if (item.description) {
        doc.moveDown(0.2)
        doc.fontSize(10).fillColor('#111827').font('Helvetica').text(item.description, {
          width: pageWidth,
          align: 'left',
          lineGap: 2
        })
      }

      if (index < projects.length - 1) {
        doc.moveDown(0.6)
      }
    })
  }

  doc.end()
})

// @desc    Get all resumes for user
// @route   GET /api/resume
// @access  Private
export const getResumes = asyncHandler(async (req, res) => {
  const resumes = await Resume.find({ user: req.user.id }).sort({ createdAt: -1 })

  res.json({
    success: true,
    resumes
  })
})

// @desc    Get single resume
// @route   GET /api/resume/:id
// @access  Private
export const getResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({
    _id: req.params.id,
    user: req.user.id
  })

  if (!resume) {
    return res.status(404).json({
      success: false,
      message: 'Resume not found'
    })
  }

  res.json({
    success: true,
    resume
  })
})

// @desc    Delete resume
// @route   DELETE /api/resume/:id
// @access  Private
export const deleteResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({
    _id: req.params.id,
    user: req.user.id
  })

  if (!resume) {
    return res.status(404).json({
      success: false,
      message: 'Resume not found'
    })
  }

  await resume.deleteOne()

  // Update user resume count
  await User.findByIdAndUpdate(req.user.id, {
    $inc: { resumeCount: -1 }
  })

  res.json({
    success: true,
    message: 'Resume deleted'
  })
})