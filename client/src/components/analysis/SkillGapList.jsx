import React from 'react'
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react'
import { Card } from '@/components/ui'
import { cn } from '@/utils/helpers'

export function SkillGapList({ gaps = [] }) {
  const getIcon = (status) => {
    switch (status) {
      case 'matched':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'missing':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'partial':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'matched':
        return 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800'
      case 'missing':
        return 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800'
      case 'partial':
        return 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800'
      default:
        return 'bg-muted'
    }
  }

  if (!gaps || gaps.length === 0) {
    return (
      <Card className="p-4">
        <p className="text-sm text-muted-foreground">No skill gaps identified</p>
      </Card>
    )
  }

  return (
    <div className="space-y-2">
      {gaps.map((gap, index) => (
        <div
          key={index}
          className={cn(
            'flex items-center justify-between p-3 rounded-lg border transition-colors',
            getStatusColor(gap.status)
          )}
        >
          <div className="flex items-center gap-3">
            {getIcon(gap.status)}
            <span className="text-sm font-medium">{gap.skill}</span>
          </div>
          <span className="text-xs text-muted-foreground">{gap.message}</span>
        </div>
      ))}
    </div>
  )
}