import React, { useEffect, useState } from 'react'
import { cn } from '@/utils/helpers'

export function MatchScoreRing({ score, size = 120, strokeWidth = 8, animated = false }) {
  const [displayScore, setDisplayScore] = useState(animated ? 0 : score)
  
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (displayScore / 100) * circumference

  // Animate the score
  useEffect(() => {
    if (!animated) {
      setDisplayScore(score)
      return
    }

    let startTime = null
    const duration = 1200
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      
      // Ease-out function
      const easeOut = 1 - Math.pow(1 - progress, 3)
      setDisplayScore(Math.round(easeOut * score))
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    requestAnimationFrame(animate)
  }, [score, animated])

  const getColor = (score) => {
    if (score >= 70) return '#14B8A6' // teal (was green 80+)
    if (score >= 40) return '#F59E0B' // amber (was yellow 40-69)
    return '#EF4444' // red (was orange <40)
  }

  const getLabel = (score) => {
    if (score >= 90) return 'Excellent'
    if (score >= 70) return 'Strong Match'
    if (score >= 40) return 'Getting There'
    return 'Needs Work'
  }

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-muted/20"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor(displayScore)}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
          style={{
            strokeDashoffset: animated ? offset : offset,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold" style={{ color: getColor(displayScore) }}>
          {displayScore}
        </span>
        <span className="text-xs text-muted-foreground mt-1">{getLabel(displayScore)}</span>
      </div>
    </div>
  )
}

export function MatchScoreCard({ score, label, details }) {
  return (
    <div className="flex flex-col items-center p-6 bg-card rounded-lg border">
      <MatchScoreRing score={score} />
      <p className="mt-4 text-sm font-medium text-center">{label}</p>
      {details && (
        <p className="mt-1 text-xs text-muted-foreground text-center">{details}</p>
      )}
    </div>
  )
}