import React from 'react'
import { FileText, TrendingUp, Users, Clock } from 'lucide-react'
import { Card } from '@/components/ui'
import { cn } from '@/utils/helpers'

const ICONS = {
  resumes: FileText,
  analyses: TrendingUp,
  users: Users,
  time: Clock,
}

export function StatsGrid({ stats = [] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = ICONS[stat.icon] || FileText
        return (
          <Card
            key={index}
            className="p-4 hover:shadow-md transition-all duration-200 animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
                {stat.change && (
                  <p
                    className={cn(
                      'text-xs mt-1',
                      stat.change > 0 ? 'text-green-600' : 'text-red-600'
                    )}
                  >
                    {stat.change > 0 ? '+' : ''}
                    {stat.change}% from last month
                  </p>
                )}
              </div>
              <div className="p-3 rounded-lg bg-primary/10">
                <Icon className="w-5 h-5 text-primary" />
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}