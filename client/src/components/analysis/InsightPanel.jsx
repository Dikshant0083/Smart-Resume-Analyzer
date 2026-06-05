import React from 'react'
import { Lightbulb, TrendingUp, AlertTriangle, Target } from 'lucide-react'
import { Card } from '@/components/ui'

const ICONS = {
  lightbulb: Lightbulb,
  trending: TrendingUp,
  alert: AlertTriangle,
  target: Target,
}

export function InsightPanel({ insights = [] }) {
  if (!insights || insights.length === 0) {
    return (
      <Card className="p-4">
        <p className="text-sm text-muted-foreground">No insights available</p>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {insights.map((insight, index) => {
        const Icon = ICONS[insight.type] || Lightbulb
        return (
          <Card
            key={index}
            className="p-4 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-medium">{insight.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {insight.description}
                </p>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}