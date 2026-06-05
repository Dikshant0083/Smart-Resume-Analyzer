import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'

const COLORS = ['#6366F1', '#14B8A6', '#F59E0B', '#EF4444', '#8B5CF6']

const getSkillName = (item, index) => {
  if (typeof item === 'string') return item
  if (item?.skill) return item.skill
  if (item?.name) return item.name
  return `Skill ${index + 1}`
}

const getSkillScore = (item) => {
  if (typeof item?.score === 'number') return item.score
  if (item?.status === 'matched') return 100
  if (item?.status === 'partial') return 50
  return 0
}

export function SkillsChart({ data = [] }) {
  const chartData = (Array.isArray(data) ? data : []).map((item, index) => {
    const fullName = getSkillName(item, index)

    return {
      name: fullName.length > 15 ? `${fullName.slice(0, 15)}...` : fullName,
      score: getSkillScore(item),
      fullName,
    }
  })

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Skill Match Scores</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No skill match data available yet.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Skill Match Scores</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
              <YAxis
                type="category"
                dataKey="name"
                width={100}
                tick={{ fontSize: 11 }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background border rounded-lg p-2 shadow-lg">
                        <p className="font-medium text-sm">{payload[0].payload.fullName}</p>
                        <p className="text-sm text-muted-foreground">
                          Match: {payload[0].value}%
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
