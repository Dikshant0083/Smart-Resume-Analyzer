import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Upload,
  Search,
  TrendingUp,
  CheckCircle,
  Sparkles,
} from 'lucide-react'
import { Button, Card } from '@/components/ui'

// ─── Static data ──────────────────────────────────────────────
const STEPS = [
  {
    step: '01',
    icon: Upload,
    accent: 'bg-indigo-50 dark:bg-indigo-950',
    iconColor: 'text-indigo-500',
    title: 'Upload your resume',
    description:
      'Drag and drop your PDF resume. Our parser extracts skills, experience, and education instantly.',
  },
  {
    step: '02',
    icon: Search,
    accent: 'bg-teal-50 dark:bg-teal-950',
    iconColor: 'text-teal-500',
    title: 'Paste a job description',
    description:
      'Add any job listing you want to match against — the full text works best for accurate results.',
  },
  {
    step: '03',
    icon: TrendingUp,
    accent: 'bg-green-50 dark:bg-green-950',
    iconColor: 'text-green-600',
    title: 'Get your match score',
    description:
      'See your score, matched vs missing skills, and 3–5 tailored recommendations to improve your chances.',
  },
]

const DEMO = {
  score: 78,
  label: 'Strong match',
  color: '#14B8A6',
  matched: ['JavaScript', 'React', 'Node.js', 'REST APIs'],
  missing: ['TypeScript', 'AWS', 'Docker'],
  suggestions: [
    "Add TypeScript to your skills section — it appears 4× in this JD",
    "Mention any AWS exposure (even personal projects count)",
    "Include Docker in technical skills — required in the JD",
  ],
}

// ─── MatchScoreRing ────────────────────────────────────────────
function MatchScoreRing({ score, color, size = 96 }) {
  const circleRef = useRef(null)
  const radius = (size - 12) / 2
  const circumference = 2 * Math.PI * radius

  useEffect(() => {
    const el = circleRef.current
    if (!el) return
    el.style.strokeDashoffset = String(circumference)
    const timer = setTimeout(() => {
      el.style.transition = 'stroke-dashoffset 1.2s ease-out'
      el.style.strokeDashoffset = String(
        circumference - (score / 100) * circumference
      )
    }, 400)
    return () => clearTimeout(timer)
  }, [score, circumference])

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth="8"
        className="text-muted/30"
      />
      <circle
        ref={circleRef}
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeDasharray={circumference}
        strokeDashoffset={circumference}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text
        x={size / 2}
        y={size / 2 + 7}
        textAnchor="middle"
        fontSize="18"
        fontWeight="700"
        fill={color}
      >
        {score}%
      </text>
    </svg>
  )
}

// ─── SkillChip ─────────────────────────────────────────────────
function SkillChip({ label, status }) {
  const styles = {
    matched: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
    missing: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
  }
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {label}
    </span>
  )
}

// ─── Landing ───────────────────────────────────────────────────
export default function Landing() {
  return (
    <div className="min-h-screen bg-background">

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <img src="/assets/Logo.png" alt="Logo" className="h-8 w-auto" />
            <span className="text-xl font-bold tracking-tight">Resume Analyzer</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="bg-indigo-500 hover:bg-indigo-600 text-white">
                Get started free
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden py-28 px-4 text-center">
        {/* Soft background blobs — CSS only, no JS interval */}
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          aria-hidden="true"
          style={{
            background:
              'radial-gradient(ellipse 60% 40% at 30% 50%, rgba(99,102,241,0.5) 0%, transparent 70%), radial-gradient(ellipse 50% 35% at 75% 60%, rgba(20,184,166,0.4) 0%, transparent 70%)',
          }}
        />

        <div className="container relative max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 text-sm font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            AI-powered resume analysis
          </div>

          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-teal-400 bg-clip-text text-transparent">
              Get your resume
            </span>
            <br />
            ATS-ready in seconds
          </h1>

          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed">
            Upload your resume, paste a job description, and instantly see your
            match score, skill gaps, and personalized tips to get more interviews.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-8">
                Start free analysis
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="px-8">
                Sign in
              </Button>
            </Link>
          </div>

          <p className="mt-5 text-sm text-muted-foreground">
            Free to start · No credit card · Results in seconds
          </p>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">How it works</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Three simple steps to optimize your resume and increase your interview rate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {STEPS.map(({ step, icon: Icon, accent, iconColor, title, description }) => (
              <div
                key={step}
                className="relative p-8 rounded-2xl bg-card border hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300 group"
              >
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xs">
                  {step}
                </div>
                <div
                  className={`w-12 h-12 rounded-xl ${accent} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className={`w-6 h-6 ${iconColor}`} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Demo Result ── */}
      <section className="py-24 px-4">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">See it in action</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Here's what a real analysis result looks like.
            </p>
          </div>

          <div className="max-w-3xl mx-auto rounded-2xl border bg-card overflow-hidden">
            {/* Score header */}
            <div className="flex items-center gap-6 p-8 border-b">
              <div className="flex flex-col items-center gap-2 shrink-0">
                <MatchScoreRing score={DEMO.score} color={DEMO.color} size={100} />
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300">
                  {DEMO.label}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">Frontend Developer — Acme Corp</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Your resume matches most of the core requirements. Close the gaps below to push toward 90%+.
                </p>
                <div className="grid grid-cols-3 gap-3 text-center">
                  {[
                    { label: 'Matched', value: DEMO.matched.length, color: 'text-green-600' },
                    { label: 'Missing', value: DEMO.missing.length, color: 'text-red-500' },
                    { label: 'Total required', value: DEMO.matched.length + DEMO.missing.length, color: 'text-muted-foreground' },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="bg-muted/40 rounded-lg p-3">
                      <p className={`text-2xl font-bold ${color}`}>{value}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Skill breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-8 border-b">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Matched skills
                </p>
                <div className="flex flex-wrap gap-2">
                  {DEMO.matched.map((s) => (
                    <SkillChip key={s} label={s} status="matched" />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Missing skills
                </p>
                <div className="flex flex-wrap gap-2">
                  {DEMO.missing.map((s) => (
                    <SkillChip key={s} label={s} status="missing" />
                  ))}
                </div>
              </div>
            </div>

            {/* Suggestions */}
            <div className="p-8">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">
                Recommendations
              </p>
              <ul className="space-y-3">
                {DEMO.suggestions.map((tip, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-24 px-4 bg-indigo-500 text-white text-center">
        <div className="container max-w-2xl">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to land your dream job?
          </h2>
          <p className="text-white/75 text-lg mb-8">
            Join thousands of job seekers who improved their resumes with ResumeIQ.
          </p>
          <Link to="/register">
            <Button
              size="lg"
              className="bg-white text-indigo-600 hover:bg-indigo-50 font-semibold px-10"
            >
              Get started for free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-8 px-4 border-t">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-indigo-500 flex items-center justify-center">
              <span className="text-white font-bold text-xs">R</span>
            </div>
            <span className="font-semibold">ResumeIQ</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ResumeIQ. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  )
}