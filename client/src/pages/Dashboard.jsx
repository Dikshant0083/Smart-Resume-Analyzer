import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, TrendingUp, Target, Clock, FileText, BarChart3, Zap, Sparkles } from 'lucide-react'
import { Button, Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui'
import { Navbar, Sidebar, PageWrapper, PageHeader } from '@/components/layout'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts'
import { useAuth } from '@/hooks'
import { useResume, useAnalysis } from '@/hooks'
import { formatDate } from '@/utils/helpers'

// Animated counter hook
function useAnimatedCounter(target, duration = 1000) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    if (target === 0) {
      setCount(0)
      return
    }

    let startTime = null
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * target))
      if (progress < 1) {
        ref.current = requestAnimationFrame(animate)
      }
    }
    ref.current = requestAnimationFrame(animate)
    return () => ref.current && cancelAnimationFrame(ref.current)
  }, [target, duration])

  return count
}

function StatCard({ label, value, icon: Icon, change, delay = 0 }) {
  const animatedValue = useAnimatedCounter(value)
  
  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-300 animate-fade-in" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-3xl font-bold mt-1">{animatedValue}</p>
          {change !== undefined && (
            <p className={`text-xs mt-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% from last month
            </p>
          )}
        </div>
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-indigo-500/20 flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>
    </Card>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { resumes, fetchResumes } = useResume()
  const { analyses, fetchAnalyses } = useAnalysis()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetchResumes(), fetchAnalyses()]).finally(() => setIsLoading(false))
  }, [])

  const avgScore = analyses.length > 0 
    ? Math.round(analyses.reduce((acc, a) => acc + (a.matchScore || 0), 0) / analyses.length) 
    : 0

  // Calculate top skill gap
  const skillGapCount = {}
  analyses.forEach(a => {
    (a.skillGaps || []).forEach(gap => {
      if (gap.status === 'missing') {
        skillGapCount[gap.skill] = (skillGapCount[gap.skill] || 0) + 1
      }
    })
  })
  const topSkillGap = Object.entries(skillGapCount).sort((a, b) => b[1] - a[1])[0]

  // Radar chart data - skill domains
  const skillDomains = [
    { skill: 'Frontend', fullMark: 100 },
    { skill: 'Backend', fullMark: 100 },
    { skill: 'Database', fullMark: 100 },
    { skill: 'DevOps', fullMark: 100 },
    { skill: 'Cloud', fullMark: 100 },
    { skill: 'Soft Skills', fullMark: 100 },
  ]

  // Calculate domain scores based on skills
  const domainScores = {
    'Frontend': 0, 'Backend': 0, 'Database': 0, 'DevOps': 0, 'Cloud': 0, 'Soft Skills': 0
  }
  const allSkills = new Set()
  analyses.forEach(a => {
    (a.extractedResumeData?.skills || []).forEach(s => allSkills.add(s.toLowerCase()))
  })
  
  const frontendSkills = ['react', 'vue', 'angular', 'javascript', 'typescript', 'html', 'css', 'tailwind']
  const backendSkills = ['node', 'python', 'java', 'express', 'django', 'flask', 'spring', 'api']
  const databaseSkills = ['sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch']
  const devopsSkills = ['docker', 'kubernetes', 'jenkins', 'git', 'ci/cd', 'terraform']
  const cloudSkills = ['aws', 'azure', 'gcp', 'lambda', 'serverless']
  const softSkillsList = ['leadership', 'communication', 'teamwork', 'problem-solving', 'analytical']

  allSkills.forEach(skill => {
    if (frontendSkills.some(s => skill.includes(s))) domainScores['Frontend'] += 20
    if (backendSkills.some(s => skill.includes(s))) domainScores['Backend'] += 20
    if (databaseSkills.some(s => skill.includes(s))) domainScores['Database'] += 20
    if (devopsSkills.some(s => skill.includes(s))) domainScores['DevOps'] += 20
    if (cloudSkills.some(s => skill.includes(s))) domainScores['Cloud'] += 20
    if (softSkillsList.some(s => skill.includes(s))) domainScores['Soft Skills'] += 20
  })

  const radarData = skillDomains.map(domain => ({
    ...domain,
    score: Math.min(domainScores[domain.skill], 100)
  }))

  const getScoreColor = (score) => {
    if (score >= 70) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
    if (score >= 40) return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100'
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
  }

  const getScoreLabel = (score) => {
    if (score >= 90) return 'Excellent'
    if (score >= 70) return 'Strong Match'
    if (score >= 40) return 'Getting There'
    return 'Needs Work'
  }

  // Empty state
  if (!isLoading && analyses.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <PageWrapper>
            <PageHeader
              title={`Welcome, ${user?.name?.split(' ')[0] || 'User'}`}
              description="Start analyzing your resumes to land your dream job"
            />
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <Button onClick={() => navigate('/analyze')} className="gap-2">
                <Plus className="w-4 h-4" />
                Analyze Resume
              </Button>
              <Button variant="secondary" onClick={() => navigate('/create-resume')} className="gap-2">
                <Sparkles className="w-4 h-4" />
                Create Resume
              </Button>
            </div>
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-indigo-500/20 flex items-center justify-center mb-6">
                <FileText className="w-12 h-12 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Upload Your First Resume</h2>
              <p className="text-muted-foreground text-center max-w-md mb-6">
                Get started by uploading your resume and comparing it against a job description.
                We'll analyze your match score and provide actionable insights.
              </p>
              <Button onClick={() => navigate('/analyze')} className="gap-2">
                <Plus className="w-4 h-4" />
                New Analysis
              </Button>
            </div>
          </PageWrapper>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <PageWrapper>
          <PageHeader
            title={`Welcome, ${user?.name?.split(' ')[0] || 'User'}`}
            description="Here's your resume analysis overview"
          />
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Button onClick={() => navigate('/analyze')} className="gap-2">
              <Plus className="w-4 h-4" />
              Analyze Resume
            </Button>
            <Button variant="secondary" onClick={() => navigate('/create-resume')} className="gap-2">
              <Sparkles className="w-4 h-4" />
              Create Resume
            </Button>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total Analyses" value={analyses.length} icon={BarChart3} change={12} delay={0} />
            <StatCard label="Avg Match Score" value={avgScore} icon={Target} change={5} delay={100} />
            <StatCard 
              label="Top Skill Gap" 
              value={topSkillGap ? 1 : 0} 
              icon={Zap} 
              delay={200}
            />
            <StatCard label="Last Active" value={analyses.length > 0 ? 1 : 0} icon={Clock} delay={300} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Analyses Table */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Recent Analyses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Filename</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Job Title</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Score</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analyses.slice(0, 5).map((analysis, index) => (
                          <tr 
                            key={analysis._id} 
                            className="border-b hover:bg-muted/50 transition-colors animate-fade-in"
                            style={{ animationDelay: `${index * 50}ms` }}
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
                              <Badge className={getScoreColor(analysis.matchScore)}>
                                {Math.round(analysis.matchScore)}% • {getScoreLabel(analysis.matchScore)}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-sm text-muted-foreground">
                              {formatDate(analysis.createdAt)}
                            </td>
                            <td className="py-3 px-4">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => navigate(`/history/${analysis._id}`)}
                              >
                                View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Radar Chart */}
            <div>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Skill Coverage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="hsl(var(--border))" />
                        <PolarAngleAxis 
                          dataKey="skill" 
                          tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                        />
                        <PolarRadiusAxis 
                          angle={30} 
                          domain={[0, 100]} 
                          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                        />
                        <Radar
                          name="Score"
                          dataKey="score"
                          stroke="#6366F1"
                          fill="#6366F1"
                          fillOpacity={0.3}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Floating Action Button */}
          <div className="fixed bottom-6 right-6 z-40">
            <Button 
              onClick={() => navigate('/analyze')}
              className="w-14 h-14 rounded-full shadow-lg bg-gradient-to-r from-primary to-indigo-500 hover:from-primary/90 hover:to-indigo-500/90 animate-fade-in"
            >
              <Plus className="w-6 h-6" />
            </Button>
          </div>
        </PageWrapper>
      </div>
    </div>
  )
}