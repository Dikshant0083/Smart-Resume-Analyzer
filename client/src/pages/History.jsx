import React, { useEffect, useState, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FileText, Trash2, Loader2, ArrowLeft, Search, Download, Filter, X, Calendar, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Badge } from '@/components/ui'
import { Navbar, Sidebar, PageWrapper, PageHeader } from '@/components/layout'
import { ResumeCard } from '@/components/resume'
import { MatchScoreRing, SkillGapList, InsightPanel, SkillsChart } from '@/components/analysis'
import { useResume, useAnalysis } from '@/hooks'
import { analysisAPI, resumeAPI } from '@/api'
import { formatDate, cn } from '@/utils/helpers'

// Score Badge Component
function ScoreBadge({ score }) {
  const getColor = (score) => {
    if (score >= 90) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
    if (score >= 70) return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-100'
    if (score >= 40) return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100'
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
  }
  
  const getLabel = (score) => {
    if (score >= 90) return 'Excellent'
    if (score >= 70) return 'Strong Match'
    if (score >= 40) return 'Getting There'
    return 'Needs Work'
  }

  return (
    <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getColor(score))}>
      {Math.round(score)}% • {getLabel(score)}
    </span>
  )
}

// Filter Component
function FilterBar({ filters, onFilterChange, onClear }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by job title..."
            value={filters.search}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="gap-2"
        >
          <Filter className="w-4 h-4" />
          Filters
          {(filters.dateRange !== 'all' || filters.scoreRange !== 'all') && (
            <Badge variant="secondary" className="ml-1">
              {(filters.dateRange !== 'all' ? 1 : 0) + (filters.scoreRange !== 'all' ? 1 : 0)}
            </Badge>
          )}
        </Button>
        {(filters.dateRange !== 'all' || filters.scoreRange !== 'all' || filters.search) && (
          <Button variant="ghost" onClick={onClear} className="gap-1">
            <X className="w-4 h-4" />
            Clear
          </Button>
        )}
      </div>

      {isOpen && (
        <Card className="p-4 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Date Range</label>
              <select
                value={filters.dateRange}
                onChange={(e) => onFilterChange({ ...filters, dateRange: e.target.value })}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="all">All Time</option>
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Score Range</label>
              <select
                value={filters.scoreRange}
                onChange={(e) => onFilterChange({ ...filters, scoreRange: e.target.value })}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="all">All Scores</option>
                <option value="90">90-100% (Excellent)</option>
                <option value="70">70-89% (Strong)</option>
                <option value="40">40-69% (Getting There)</option>
                <option value="0">0-39% (Needs Work)</option>
              </select>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

// Pagination Component
function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
      <span className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  )
}

export default function History() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { resumes, fetchResumes, deleteResume } = useResume()
  const { analyses, fetchAnalyses, currentAnalysis, fetchAnalysisById, deleteAnalysis } = useAnalysis()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    dateRange: 'all',
    scoreRange: 'all',
  })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    Promise.all([fetchResumes(), fetchAnalyses()]).finally(() => setIsLoading(false))
  }, [fetchResumes, fetchAnalyses])

  useEffect(() => {
    if (id) {
      fetchAnalysisById(id)
    }
  }, [id, fetchAnalysisById])

  const handleDeleteAnalysis = async (analysisId) => {
    if (!confirm('Are you sure you want to delete this analysis?')) return
    setIsDeleting(true)
    try {
      await deleteAnalysis(analysisId)
      navigate('/history')
    } catch (err) {
      alert('Failed to delete analysis')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteResume = async (resumeId) => {
    if (!confirm('Are you sure you want to delete this resume?')) return
    try {
      await deleteResume(resumeId)
    } catch (err) {
      alert('Failed to delete resume')
    }
  }

  const handleDownloadResume = async (resume) => {
    try {
      const blob = await resumeAPI.exportPDF(resume._id)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${resume.resumeTitle || resume.originalName || 'resume'}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      alert('Failed to download resume PDF. Please try again.')
    }
  }

  const handleEditResume = (resume) => {
    navigate(`/create-resume/${resume._id}`)
  }

  const handleExportPDF = async (analysisId) => {
    try {
      const blob = await analysisAPI.exportPDF(analysisId)
      // Create a download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `analysis-report-${analysisId}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      alert('Failed to export PDF. Please try again.')
    }
  }

  const clearFilters = () => {
    setFilters({ search: '', dateRange: 'all', scoreRange: 'all' })
    setCurrentPage(1)
  }

  // Filter analyses
  const filteredAnalyses = useMemo(() => {
    return analyses.filter(analysis => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesTitle = (analysis.jobTitle || '').toLowerCase().includes(searchLower)
        const matchesResume = (analysis.resume?.originalName || '').toLowerCase().includes(searchLower)
        if (!matchesTitle && !matchesResume) return false
      }

      // Date range filter
      if (filters.dateRange !== 'all') {
        const days = parseInt(filters.dateRange)
        const cutoff = new Date()
        cutoff.setDate(cutoff.getDate() - days)
        if (new Date(analysis.createdAt) < cutoff) return false
      }

      // Score range filter
      if (filters.scoreRange !== 'all') {
        const score = analysis.matchScore
        const minScore = parseInt(filters.scoreRange)
        if (score < minScore || score >= minScore + 20) return false
      }

      return true
    })
  }, [analyses, filters])

  // Paginate
  const totalPages = Math.ceil(filteredAnalyses.length / itemsPerPage)
  const paginatedAnalyses = filteredAnalyses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [filters])

  // Detail view
  if (id && currentAnalysis) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <PageWrapper>
            <PageHeader
              title="Analysis Details"
              actions={
                <Button variant="outline" onClick={() => navigate('/history')}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to History
                </Button>
              }
            />

            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="p-6">
                  <div className="flex flex-col items-center">
                    <MatchScoreRing score={currentAnalysis.matchScore} size={140} animated />
                    <p className="mt-3 text-sm text-muted-foreground">
                      {currentAnalysis.resume?.originalName || 'Resume'}
                    </p>
                  </div>
                </Card>

                <Card className="p-6 lg:col-span-2">
                  <h3 className="font-semibold mb-4">Job Title</h3>
                  <p className="text-muted-foreground">{currentAnalysis.jobTitle || 'Not specified'}</p>
                  <h3 className="font-semibold mt-6 mb-4">Job Description</h3>
                  <p className="text-sm text-muted-foreground line-clamp-4">
                    {currentAnalysis.jobDescription}
                  </p>
                </Card>
              </div>

              <SkillsChart data={currentAnalysis.skillMatches || []} />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Skill Analysis</h3>
                  <SkillGapList gaps={currentAnalysis.skillGaps || []} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Suggestions</h3>
                  <InsightPanel insights={currentAnalysis.insights || []} />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline"
                  onClick={() => handleExportPDF(currentAnalysis._id)}
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download PDF Report
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => handleDeleteAnalysis(currentAnalysis._id)}
                  disabled={isDeleting}
                >
                  {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
                  Delete Analysis
                </Button>
              </div>
            </div>
          </PageWrapper>
        </div>
      </div>
    )
  }

  // List view
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <PageWrapper>
          <PageHeader
            title="History"
            description="View and manage your past resume analyses"
          />

          {/* Filters */}
          <div className="mb-6">
            <FilterBar 
              filters={filters} 
              onFilterChange={setFilters} 
              onClear={clearFilters}
            />
          </div>

          {isLoading ? (
            // Skeleton loading
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Card key={i} className="p-4 animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-muted rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-1/3" />
                      <div className="h-3 bg-muted rounded w-1/4" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div>
              {resumes.length > 0 && (
                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold">My Resumes</h2>
                      <p className="text-sm text-muted-foreground">Resume builder output saved for reuse, editing, and export.</p>
                    </div>
                    <Button onClick={() => navigate('/create-resume')} className="gap-2">
                      <Plus className="w-4 h-4" />
                      Create New Resume
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {resumes.map((resume) => (
                      <ResumeCard
                        key={resume._id}
                        resume={resume}
                        onDownload={handleDownloadResume}
                        onDelete={handleDeleteResume}
                        onEdit={handleEditResume}
                      />
                    ))}
                  </div>
                </div>
              )}

              {filteredAnalyses.length === 0 ? (
                <Card className="p-12 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                      <FileText className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-lg font-medium">
                        {analyses.length === 0 ? 'No analyses yet' : 'No analyses match your filters'}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {analyses.length === 0
                          ? 'Upload your first resume to get started'
                          : 'Try adjusting your filters or clear them'}
                      </p>
                    </div>
                    {analyses.length === 0 ? (
                      <Button onClick={() => navigate('/analyze')}>
                        New Analysis
                      </Button>
                    ) : (
                      <Button variant="outline" onClick={clearFilters}>
                        Clear Filters
                      </Button>
                    )}
                  </div>
                </Card>
              ) : (
                <>
                  {/* Analyses Table */}
                  <Card>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b bg-muted/50">
                              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Resume</th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Job Title</th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Score</th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {paginatedAnalyses.map((analysis, index) => (
                              <tr 
                                key={analysis._id} 
                                className="border-b hover:bg-muted/50 transition-colors animate-fade-in"
                                style={{ animationDelay: `${index * 30}ms` }}
                              >
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-primary" />
                                    <span className="text-sm font-medium truncate max-w-[150px]">
                                      {analysis.resume?.originalName || 'Resume'}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-sm text-muted-foreground">
                                  {analysis.jobTitle || '-'}
                                </td>
                                <td className="py-3 px-4">
                                  <ScoreBadge score={analysis.matchScore} />
                                </td>
                                <td className="py-3 px-4 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {formatDate(analysis.createdAt)}
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-1">
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => navigate(`/history/${analysis._id}`)}
                                    >
                                      View
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleExportPDF(analysis._id)}
                                    >
                                      <Download className="w-4 h-4" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleDeleteAnalysis(analysis._id)}
                                      className="text-red-500 hover:text-red-600"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Pagination */}
                  <div className="mt-4">
                    <Pagination 
                      currentPage={currentPage} 
                      totalPages={totalPages} 
                      onPageChange={setCurrentPage}
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </PageWrapper>
      </div>
    </div>
  )
}
