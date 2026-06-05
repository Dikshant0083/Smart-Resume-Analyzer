import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Plus, Sparkles } from 'lucide-react'
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Textarea } from '@/components/ui'
import { Navbar, Sidebar, PageWrapper, PageHeader } from '@/components/layout'
import { useResume } from '@/hooks'

function parseList(value) {
  return value
    .split(/\r?\n|,/) 
    .map((item) => item.trim())
    .filter(Boolean)
}

function parseSection(value, type) {
  return parseList(value).map((line) => {
    if (type === 'project') {
      return { name: '', description: line, link: '' }
    }
    return {
      school: type === 'education' ? '' : undefined,
      degree: type === 'education' ? '' : undefined,
      company: type === 'experience' ? '' : undefined,
      role: type === 'experience' ? '' : undefined,
      dates: '',
      location: '',
      details: line,
    }
  })
}

function formatSection(items, type) {
  if (!Array.isArray(items)) return ''
  return items
    .map((item) => {
      if (!item) return ''
      if (type === 'experience') {
        return [item.role, item.company, item.dates, item.location, item.details]
          .filter(Boolean)
          .join(' — ')
      }
      if (type === 'education') {
        return [item.degree, item.school, item.dates, item.details].filter(Boolean).join(' — ')
      }
      if (type === 'project') {
        return [item.name, item.description, item.link].filter(Boolean).join(' — ')
      }
      return ''
    })
    .filter(Boolean)
    .join('\n')
}

function formatSkills(skills) {
  return Array.isArray(skills) ? skills.join(', ') : ''
}

export default function CreateResume() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { createBuilderResume, fetchResumeById, updateBuilderResume } = useResume()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingResume, setIsLoadingResume] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const isEditing = Boolean(id)

  const [formData, setFormData] = useState({
    resumeTitle: 'Professional Resume',
    template: 'modern',
    fullName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    website: '',
    summary: '',
    skills: '',
    experience: '',
    education: '',
    projects: '',
  })

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }))
  }

  useEffect(() => {
    if (!id) return
    setIsLoadingResume(true)
    fetchResumeById(id)
      .then((data) => {
        const resume = data.resume
        if (!resume) return
        const personal = resume.resumeData?.personal || {}
        setFormData({
          resumeTitle: resume.resumeTitle || 'Professional Resume',
          template: resume.template || 'modern',
          fullName: personal.fullName || '',
          title: personal.title || '',
          email: personal.email || '',
          phone: personal.phone || '',
          location: personal.location || '',
          linkedin: personal.linkedin || '',
          github: personal.github || '',
          website: personal.website || '',
          summary: resume.resumeData?.summary || '',
          skills: formatSkills(resume.resumeData?.skills),
          experience: formatSection(resume.resumeData?.experience, 'experience'),
          education: formatSection(resume.resumeData?.education, 'education'),
          projects: formatSection(resume.resumeData?.projects, 'project'),
        })
      })
      .catch(() => {})
      .finally(() => setIsLoadingResume(false))
  }, [id, fetchResumeById])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccessMessage('')
    setIsSubmitting(true)

    try {
      const payload = {
        resumeTitle: formData.resumeTitle,
        template: formData.template,
        resumeData: {
          personal: {
            fullName: formData.fullName,
            title: formData.title,
            email: formData.email,
            phone: formData.phone,
            location: formData.location,
            linkedin: formData.linkedin,
            github: formData.github,
            website: formData.website,
          },
          summary: formData.summary,
          skills: parseList(formData.skills),
          experience: parseSection(formData.experience, 'experience'),
          education: parseSection(formData.education, 'education'),
          projects: parseSection(formData.projects, 'project'),
        },
      }

      if (isEditing) {
        await updateBuilderResume(id, payload)
        setSuccessMessage('Resume updated successfully. You can now review it in your history.')
      } else {
        await createBuilderResume(payload)
        setSuccessMessage('Resume created successfully. You can now review it in your history.')
      }
      setIsSubmitting(false)
      setTimeout(() => navigate('/history'), 1200)
    } catch (err) {
      setError(err.response?.data?.message || (isEditing ? 'Failed to update resume. Please try again.' : 'Failed to create resume. Please try again.'))
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <PageWrapper>
          <PageHeader
            title={isEditing ? 'Edit Resume' : 'Create Resume'}
            description={isEditing ? 'Update your saved resume and export it when ready.' : 'Build a professional resume from your profile details and export it as PDF.'}
            actions={
              <Button variant="outline" onClick={() => navigate('/history')}>
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to History
              </Button>
            }
          />

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Create Your Resume</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Resume Title
                    </label>
                    <Input value={formData.resumeTitle} onChange={handleChange('resumeTitle')} placeholder="Professional Resume" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Template
                    </label>
                    <select
                      value={formData.template}
                      onChange={handleChange('template')}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="modern">Modern</option>
                      <option value="classic">Classic</option>
                      <option value="professional">Professional</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Full Name
                    </label>
                    <Input value={formData.fullName} onChange={handleChange('fullName')} placeholder="Jane Doe" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Job Title
                    </label>
                    <Input value={formData.title} onChange={handleChange('title')} placeholder="Full Stack Developer" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Email
                      </label>
                      <Input type="email" value={formData.email} onChange={handleChange('email')} placeholder="you@example.com" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Phone
                      </label>
                      <Input value={formData.phone} onChange={handleChange('phone')} placeholder="(123) 456-7890" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Location
                    </label>
                    <Input value={formData.location} onChange={handleChange('location')} placeholder="City, Country" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">LinkedIn</label>
                      <Input value={formData.linkedin} onChange={handleChange('linkedin')} placeholder="linkedin.com/in/yourname" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">GitHub</label>
                      <Input value={formData.github} onChange={handleChange('github')} placeholder="github.com/yourname" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">Website</label>
                      <Input value={formData.website} onChange={handleChange('website')} placeholder="yourwebsite.com" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Profile Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Summary</label>
                    <Textarea value={formData.summary} onChange={handleChange('summary')} placeholder="Write a concise summary of your experience and goals." rows={8} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Skills</label>
                    <Textarea value={formData.skills} onChange={handleChange('skills')} placeholder="React, Node.js, SQL, Team Leadership" rows={4} />
                    <p className="text-xs text-muted-foreground mt-1">Comma or new line separated.</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Experience</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={formData.experience}
                    onChange={handleChange('experience')}
                    placeholder="Senior Software Engineer at Acme Inc. — Built modern web apps..."
                    rows={8}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Enter each experience item on a new line.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Education</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={formData.education}
                    onChange={handleChange('education')}
                    placeholder="BSc Computer Science — University Name — 2020"
                    rows={8}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Enter each education item on a new line.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={formData.projects}
                    onChange={handleChange('projects')}
                    placeholder="Resume Builder — Built using React and Node.js..."
                    rows={8}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Enter each project on a new line.</p>
                </CardContent>
              </Card>
            </div>

            {error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}
            {successMessage && (
              <div className="rounded-lg border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-800">
                <Sparkles className="inline w-4 h-4 mr-2 align-text-bottom" />
                {successMessage}
              </div>
            )}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between sm:items-center">
              <div className="text-sm text-muted-foreground">
                Once saved, your resume will appear in your dashboard and history.
              </div>
              <Button type="submit" disabled={isSubmitting || isLoadingResume} className="inline-flex items-center gap-2">
                <Plus className="w-4 h-4" />
                {isSubmitting ? (isEditing ? 'Updating...' : 'Saving...') : isEditing ? 'Update Resume' : 'Save Resume'}
              </Button>
            </div>
          </form>
        </PageWrapper>
      </div>
    </div>
  )
}
