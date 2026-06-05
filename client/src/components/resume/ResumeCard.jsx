import React from 'react'
import { FileText, Download, Trash2, Calendar } from 'lucide-react'
import { Card, Button, Badge } from '@/components/ui'
import { formatDate } from '@/utils/helpers'

export function ResumeCard({ resume, onDownload, onDelete, onAnalyze, onEdit }) {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <FileText className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium truncate">{resume.originalName}</h4>
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(resume.createdAt)}</span>
          </div>
          {resume.analysisCount > 0 && (
            <Badge variant="secondary" className="mt-2">
              {resume.analysisCount} analysis{resume.analysisCount > 1 ? 'es' : ''}
            </Badge>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mt-4">
        {onAnalyze && (
          <Button size="sm" variant="outline" onClick={() => onAnalyze(resume)}>
            Analyze
          </Button>
        )}
        {onEdit && (
          <Button size="sm" variant="secondary" onClick={() => onEdit(resume)}>
            Edit
          </Button>
        )}
        {onDownload && (
          <Button size="sm" variant="ghost" onClick={() => onDownload(resume)}>
            <Download className="w-4 h-4" />
          </Button>
        )}
        {onDelete && (
          <Button size="sm" variant="ghost" onClick={() => onDelete(resume._id)}>
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        )}
      </div>
    </Card>
  )
}