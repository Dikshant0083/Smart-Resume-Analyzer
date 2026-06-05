import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FileText, Loader2, Upload, X, CheckCircle, XCircle, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent, Button, Textarea, Label, Badge } from '@/components/ui'
import { Navbar, Sidebar, PageWrapper, PageHeader } from '@/components/layout'
import { MatchScoreRing } from '@/components/analysis'
import { useResume, useAnalysis } from '@/hooks'
import { validateJobDescription } from '@/utils/validators'
import { cn } from '@/utils/helpers'

// File Dropzone Component
function FileDropzone({ onFile, accept = '.pdf', isLoading = false }) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [file, setFile] = useState(null)
  const [error, setError] = useState(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    const droppedFile = e.dataTransfer.files[0]
    validateAndSetFile(droppedFile)
  }

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0]
    validateAndSetFile(selectedFile)
  }

  const validateAndSetFile = (selectedFile) => {
    if (!selectedFile) return
    
    if (!selectedFile.name.toLowerCase().endsWith('.pdf')) {
      setError('Only PDF files are allowed')
      return
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB')
      return
    }
    
    setFile(selectedFile)
    setError(null)
    onFile(selectedFile)
  }

  const removeFile = () => {
    setFile(null)
    setError(null)
  }

  if (file) {
    return (
      <div className="relative border-2 border-green-500/50 rounded-xl p-4 bg-green-500/5 animate-fade-in">
        <button
          onClick={removeFile}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted transition-colors"
          disabled={isLoading}
        >
          <X className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
            <FileText className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{file.name}</p>
            <p className="text-sm text-muted-foreground">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <CheckCircle className="w-5 h-5 text-green-500" />
        </div>
      </div>
    )
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200',
        isDragOver
          ? 'border-primary bg-primary/5 scale-[1.02] shadow-lg shadow-primary/20'
          : 'border-border hover:border-primary/50',
        isLoading && 'opacity-50 cursor-not-allowed'
      )}
    >
      <input
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        id="file-upload"
        disabled={isLoading}
      />
      <label htmlFor="file-upload" className="cursor-pointer">
        <div className="flex flex-col items-center gap-3">
          <div className={cn(
            'p-4 rounded-full transition-all duration-200',
            isDragOver ? 'bg-primary/20 scale-110' : 'bg-primary/10'
          )}>
            <Upload className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="font-medium">
              {isDragOver ? 'Drop your resume here' : 'Drag & drop your resume'}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              or click to browse (PDF only, max 5MB)
            </p>
          </div>
        </div>
      </label>
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-500 mt-4 justify-center">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}

// Skill Chip Component
function SkillChip({ label, status }) {
  const statusStyles = {
    matched: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 border-green-200 dark:border-green-800',
    missing: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 border-red-200 dark:border-red-800',
    neutral: 'bg-muted text-muted-foreground border-border',
  }
  
  const icons = {
    matched: <CheckCircle className="w-3 h-3" />,
    missing: <XCircle className="w-3 h-3" />,
    neutral: null,
  }

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border animate-fade-in',
      statusStyles[status]
    )}>
      {icons[status]}
      {label}
    </span>
  )
}

// Insight Card Component
function InsightCard({ priority, text }) {
  const priorityStyles = {
    high: 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950',
    medium: 'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950',
    low: 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950',
  }
  
  const priorityLabels = {
    high: 'High Priority',
    medium: 'Medium',
    low: 'Suggestion',
  }

  return (
    <div className={cn(
      'p-4 rounded-lg border animate-fade-in',
      priorityStyles[priority]
    )}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm">{text}</p>
        <Badge variant="outline" className="text-xs whitespace-nowrap">
          {priorityLabels[priority]}
        </Badge>
      </div>
    </div>
  )
}

// ATS Tips Accordion
function ATSTipsAccordion({ tips = [] }) {
  const [isOpen, setIsOpen] = useState(false)

  if (!tips || tips.length === 0) return null

  return (
    <Card>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-500" />
          <span className="font-medium">ATS Formatting Tips</span>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>
      {isOpen && (
        <div className="px-4 pb-4 space-y-2 animate-fade-in">
          {tips.map((tip, index) => (
            <div key={index} className="flex items-start gap-2 text-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2" />
              <span className="text-muted-foreground">{tip}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}

// Score Badge Component
function ScoreBadge({ score }) {
  const getColor = (score) => {
    if (score >= 90) return { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-800 dark:text-green-100', label: 'Excellent' }
    if (score >= 70) return { bg: 'bg-teal-100 dark:bg-teal-900', text: 'text-teal-800 dark:text-teal-100', label: 'Strong Match' }
    if (score >= 40) return { bg: 'bg-amber-100 dark:bg-amber-900', text: 'text-amber-800 dark:text-amber-100', label: 'Getting There' }
    return { bg: 'bg-red-100 dark:bg-red-900', text: 'text-red-800 dark:text-red-100', label: 'Needs Work' }
  }

  const color = getColor(score)

  return (
    <span className={cn('px-3 py-1 rounded-full text-sm font-medium', color.bg, color.text)}>
      {score}% • {color.label}
    </span>
  )
}

export default function Analyze() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { uploadResume, isLoading: resumeLoading } = useResume()
  const { analyze, currentAnalysis, isAnalyzing, fetchAnalysisById } = useAnalysis()
  
  const [jobDescription, setJobDescription] = useState('')
  const [resumeId, setResumeId] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (id) {
      fetchAnalysisById(id)
    }
  }, [id, fetchAnalysisById])

  const handleUpload = async (file) => {
    try {
      const result = await uploadResume(file)
      setResumeId(result.resume._id)
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload resume')
    }
  }

  const handleAnalyze = async () => {
    const jdError = validateJobDescription(jobDescription)
    if (jdError) {
      setError(jdError)
      return
    }
    if (!resumeId) {
      setError('Please upload a resume first')
      return
    }

    try {
      const result = await analyze({
        resumeId,
        jobDescription,
      })
      navigate(`/history/${result.analysis._id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze resume')
    }
  }

  const isLoading = resumeLoading || isAnalyzing
  const canAnalyze = resumeId && jobDescription.trim().length >= 50

  const jdKeywords = useMemo(() => {
    if (!currentAnalysis) return []
    const combined = [
      ...(currentAnalysis.skillMatches || []),
      ...(currentAnalysis.skillGaps || [])
    ]
    const seen = new Set()
    const list = []
    for (const item of combined) {
      const key = (item.skill || item.name || '').toLowerCase()
      if (!key) continue
      if (seen.has(key)) continue
      seen.add(key)
      list.push(item)
    }
    return list
  }, [currentAnalysis])

  // ATS tips based on analysis
  const atsTips = currentAnalysis ? [
    'Use standard section headings (Experience, Education, Skills)',
    'Avoid tables and columns - ATS cannot parse them well',
    'Use standard file format - PDF is preferred',
    'Include keywords from job description naturally in text',
    'Keep resume length to 1-2 pages',
    'Avoid headers and footers - they may be ignored',
  ] : []

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <PageWrapper>
          <PageHeader
            title="Analyze Resume"
            description="Upload your resume and compare it against a job description"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT Panel - Upload */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Upload Resume
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FileDropzone onFile={handleUpload} isLoading={isLoading} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Job Description</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="jobDescription">Paste the job description</Label>
                    <Textarea
                      id="jobDescription"
                      placeholder="Paste the job description you want to match your resume against..."
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      className="min-h-[200px]"
                    />
                    <div className="flex justify-between mt-2">
                      <p className="text-xs text-muted-foreground">
                        Minimum 50 characters
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {jobDescription.length} / 5000 characters
                      </p>
                    </div>
                  </div>
                  {error && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{error}</span>
                    </div>
                  )}
                  <Button 
                    onClick={handleAnalyze} 
                    disabled={isLoading || !canAnalyze}
                    className={cn(
                      'w-full relative',
                      isLoading && 'animate-pulse'
                    )}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      'Analyze Match'
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* RIGHT Panel - Results */}
            <div className="space-y-6">
              {currentAnalysis ? (
                <>
                  {/* Match Score Ring */}
                  <Card className="p-8">
                    <div className="flex flex-col items-center">
                      <MatchScoreRing 
                        score={currentAnalysis.matchScore} 
                        size={180} 
                        strokeWidth={12}
                        animated
                      />
                      <div className="mt-4 text-center">
                        <ScoreBadge score={currentAnalysis.matchScore} />
                        <p className="mt-2 text-muted-foreground">
                          {currentAnalysis.matchScore >= 70 
                            ? 'Your resume is well-suited for this role!'
                            : currentAnalysis.matchScore >= 40
                            ? 'Good foundation. Review suggestions to improve.'
                            : 'Consider updating your resume with required skills.'}
                        </p>
                      </div>
                    </div>
                  </Card>

                  {/* Job Description Keywords */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Job Description Keywords</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">Keywords extracted from the job description. Add missing keywords to improve matching.</p>
                      <div className="flex flex-wrap gap-2">
                        {jdKeywords.map((item, i) => (
                          <SkillChip
                            key={i}
                            label={item.skill || item.name}
                            status={item.status === 'missing' ? 'missing' : (item.status === 'partial' ? 'neutral' : 'matched')}
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* 3-Column Summary */}
                  <div className="grid grid-cols-3 gap-4">
                    <Card className="p-4 text-center">
                      <p className="text-2xl font-bold text-green-600">
                        {(currentAnalysis.skillMatches || []).filter(s => s.status === 'matched').length}
                      </p>
                      <p className="text-sm text-muted-foreground">Matched Skills</p>
                    </Card>
                    <Card className="p-4 text-center">
                      <p className="text-2xl font-bold text-red-600">
                        {(currentAnalysis.skillGaps || []).filter(s => s.status === 'missing').length}
                      </p>
                      <p className="text-sm text-muted-foreground">Missing Skills</p>
                    </Card>
                    <Card className="p-4 text-center">
                      <p className="text-2xl font-bold text-primary">
                        {(currentAnalysis.extractedResumeData?.experience || []).length}
                      </p>
                      <p className="text-sm text-muted-foreground">Experience Entries</p>
                    </Card>
                  </div>

                  {/* Skill Gap List - Two Columns */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Skill Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-green-600 mb-3 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            You Have
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {(currentAnalysis.skillMatches || [])
                              .filter(s => s.status === 'matched')
                              .map((skill, i) => (
                                <SkillChip 
                                  key={i} 
                                  label={skill.skill} 
                                  status="matched" 
                                />
                              ))}
                            {(currentAnalysis.skillMatches || [])
                              .filter(s => s.status === 'partial')
                              .map((skill, i) => (
                                <SkillChip 
                                  key={`partial-${i}`} 
                                  label={skill.skill} 
                                  status="neutral" 
                                />
                              ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-red-600 mb-3 flex items-center gap-2">
                            <XCircle className="w-4 h-4" />
                            Required
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {(currentAnalysis.skillGaps || [])
                              .filter(s => s.status === 'missing')
                              .map((gap, i) => (
                                <SkillChip 
                                  key={i} 
                                  label={gap.skill} 
                                  status="missing" 
                                />
                              ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Insight Panel */}
                  <Card>
                    <CardHeader>
                      <CardTitle>AI Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {(currentAnalysis.insights || []).map((insight, i) => (
                        <InsightCard 
                          key={i}
                          priority={insight.priority || (i === 0 ? 'high' : i < 2 ? 'medium' : 'low')}
                          text={insight.description || insight.title}
                        />
                      ))}
                    </CardContent>
                  </Card>

                  {/* ATS Tips Accordion */}
                  <ATSTipsAccordion tips={atsTips} />
                </>
              ) : (
                <Card className="p-12 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                      <FileText className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-lg font-medium">No analysis yet</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Upload a resume and add a job description to get started
                      </p>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </PageWrapper>
      </div>
    </div>
  )
}
