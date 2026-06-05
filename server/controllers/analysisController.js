import Analysis from '../models/Analysis.js'
import Resume from '../models/Resume.js'
import User from '../models/User.js'
import { asyncHandler } from '../middleware/errorHandler.js'
import { matchResumeToJob } from '../services/matchEngine.js'
import { generateSuggestions } from '../services/suggestionEngine.js'

// @desc    Create analysis
// @route   POST /api/analysis
// @access  Private
export const createAnalysis = asyncHandler(async (req, res) => {
  const { resumeId, jobDescription, jobTitle } = req.body

  // Get resume
  const resume = await Resume.findById(resumeId)
  if (!resume) {
    return res.status(404).json({
      success: false,
      message: 'Resume not found'
    })
  }

  // Check ownership
  if (resume.user.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to analyze this resume'
    })
  }

  // Perform matching
  const matchResult = matchResumeToJob(resume.textContent, jobDescription, resume.extractedData.skills)

  // Generate suggestions
  const insights = generateSuggestions(matchResult, resume.extractedData)

  // Create analysis
  const analysis = await Analysis.create({
    user: req.user.id,
    resume: resumeId,
    jobDescription,
    jobTitle: jobTitle || '',
    matchScore: matchResult.score,
    skillMatches: matchResult.skillMatches,
    skillGaps: matchResult.skillGaps,
    insights,
    extractedResumeData: {
      skills: resume.extractedData.skills,
      education: resume.extractedData.education,
      experience: resume.extractedData.experience
    }
  })

  // Update resume analysis count
  await Resume.findByIdAndUpdate(resumeId, {
    $inc: { analysisCount: 1 }
  })

  // Update user analysis count
  await User.findByIdAndUpdate(req.user.id, {
    $inc: { analysisCount: 1 }
  })

  // Populate resume details
  await analysis.populate('resume')

  res.status(201).json({
    success: true,
    analysis
  })
})

// @desc    Get all analyses for user
// @route   GET /api/analysis
// @access  Private
export const getAnalyses = asyncHandler(async (req, res) => {
  const analyses = await Analysis.find({ user: req.user.id })
    .populate('resume', 'originalName')
    .sort({ createdAt: -1 })

  res.json({
    success: true,
    analyses
  })
})

// @desc    Get single analysis
// @route   GET /api/analysis/:id
// @access  Private
export const getAnalysis = asyncHandler(async (req, res) => {
  const analysis = await Analysis.findOne({
    _id: req.params.id,
    user: req.user.id
  }).populate('resume')

  if (!analysis) {
    return res.status(404).json({
      success: false,
      message: 'Analysis not found'
    })
  }

  res.json({
    success: true,
    analysis
  })
})

// @desc    Delete analysis
// @route   DELETE /api/analysis/:id
// @access  Private
export const deleteAnalysis = asyncHandler(async (req, res) => {
  const analysis = await Analysis.findOne({
    _id: req.params.id,
    user: req.user.id
  })

  if (!analysis) {
    return res.status(404).json({
      success: false,
      message: 'Analysis not found'
    })
  }

  await analysis.deleteOne()

  res.json({
    success: true,
    message: 'Analysis deleted'
  })
})

// @desc    Export analysis as PDF
// @route   GET /api/analysis/:id/export
// @access  Private
export const exportAnalysisPDF = asyncHandler(async (req, res) => {
  const analysis = await Analysis.findOne({
    _id: req.params.id,
    user: req.user.id
  }).populate('resume')

  if (!analysis) {
    return res.status(404).json({
      success: false,
      message: 'Analysis not found'
    })
  }

  // Generate PDF using pdfkit
  // Generate PDF using pdfkit (dynamic import for ESM compatibility)
  const PDFModule = await import('pdfkit')
  const PDFDocument = PDFModule.default || PDFModule

  const doc = new PDFDocument({ margin: 50 })
  
  // Set response headers for file download
  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition', `attachment; filename="analysis-${analysis._id}.pdf"`)
  
  doc.pipe(res)
  
  // Title
  doc.fontSize(24).font('Helvetica-Bold').text('Resume Analysis Report', { align: 'center' })
  doc.moveDown(0.5)
  
  // Date
  doc.fontSize(10).font('Helvetica').text(`Generated: ${new Date().toLocaleDateString()}`, { align: 'center' })
  doc.moveDown(2)
  
  // Job Title
  doc.fontSize(14).font('Helvetica-Bold').text('Job Title:')
  doc.fontSize(12).font('Helvetica').text(analysis.jobTitle || 'Not specified')
  doc.moveDown()
  
  // Match Score
  doc.fontSize(14).font('Helvetica-Bold').text('Match Score:')
  const scoreColor = analysis.matchScore >= 70 ? '#14B8A6' : analysis.matchScore >= 40 ? '#F59E0B' : '#EF4444'
  doc.fontSize(48).fillColor(scoreColor).text(`${Math.round(analysis.matchScore)}%`, { align: 'center' })
  doc.fillColor('black')
  doc.moveDown(2)
  
  // Skills Section
  doc.fontSize(14).font('Helvetica-Bold').text('Matched Skills:')
  doc.moveDown(0.5)
  if (analysis.skillMatches && analysis.skillMatches.length > 0) {
    const matchedSkills = analysis.skillMatches.filter(s => s.status === 'matched').map(s => s.skill)
    doc.fontSize(10).font('Helvetica').text(matchedSkills.join(', '))
  } else {
    doc.fontSize(10).font('Helvetica').text('No skills matched')
  }
  doc.moveDown()
  
  // Missing Skills
  doc.fontSize(14).font('Helvetica-Bold').text('Missing Skills:')
  doc.moveDown(0.5)
  if (analysis.skillGaps && analysis.skillGaps.length > 0) {
    const missingSkills = analysis.skillGaps.map(s => s.skill)
    doc.fontSize(10).font('Helvetica').text(missingSkills.join(', '))
  } else {
    doc.fontSize(10).font('Helvetica').text('No critical skill gaps identified')
  }
  doc.moveDown(2)
  
  // Insights Section
  if (analysis.insights && analysis.insights.length > 0) {
    doc.fontSize(14).font('Helvetica-Bold').text('Recommendations:')
    doc.moveDown(0.5)
    
    analysis.insights.forEach((insight, index) => {
      doc.fontSize(11).font('Helvetica-Bold').text(`${index + 1}. ${insight.category || 'General'}`)
      doc.fontSize(10).font('Helvetica').text(insight.suggestion || insight.description || '')
      doc.moveDown(0.5)
    })
  }
  
  // Footer
  doc.moveDown(2)
  doc.fontSize(8).font('Helvetica').text('Generated by ResumeIQ - Smart Resume Analyzer', { align: 'center' })
  
  doc.end()
})