import React from 'react'
import { Activity, Upload, Search, CheckCircle } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { formatDate } from '@/utils/helpers'

const ACTIVITY_ICONS = {
  upload: Upload,
  analysis: Search,
  success: CheckCircle,
}

const ACTIVITY_COLORS = {
  upload: 'bg-blue-500',
  analysis: 'bg-purple-500',
  success: 'bg-green-500',
}

export function ActivityFeed({ activities = [] }) {
  if (!activities || activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No recent activity</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const Icon = ACTIVITY_ICONS[activity.type] || Activity
            const colorClass = ACTIVITY_COLORS[activity.type] || 'bg-gray-500'
            return (
              <div key={index} className="flex items-start gap-3">
                <div className={`p-2 rounded-full ${colorClass}`}>
                  <Icon className="w-3 h-3 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{activity.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(activity.timestamp)}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}