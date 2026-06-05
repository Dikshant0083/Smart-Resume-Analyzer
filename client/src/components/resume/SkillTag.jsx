import React from 'react'
import { Badge } from '@/components/ui'
import { cn } from '@/utils/helpers'

export function SkillTag({ skill, category, matchScore, showScore = false }) {
  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
    if (score >= 60) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
  }

  return (
    <div className="inline-flex items-center gap-1.5">
      <Badge variant="outline" className="font-normal">
        {skill}
      </Badge>
      {showScore && matchScore !== undefined && (
        <span className={cn('text-xs px-1.5 py-0.5 rounded', getScoreColor(matchScore))}>
          {matchScore}%
        </span>
      )}
    </div>
  )
}

export function SkillList({ skills, category, showScore = false }) {
  if (!skills || skills.length === 0) return null

  return (
    <div className="space-y-2">
      {category && <h4 className="text-sm font-medium text-muted-foreground">{category}</h4>}
      <div className="flex flex-wrap gap-1.5">
        {skills.map((skill, index) => (
          <SkillTag
            key={index}
            skill={typeof skill === 'string' ? skill : skill.name}
            matchScore={typeof skill === 'object' ? skill.score : undefined}
            showScore={showScore}
          />
        ))}
      </div>
    </div>
  )
}