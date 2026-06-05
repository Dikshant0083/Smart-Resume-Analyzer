import React from 'react'
import { cn } from '@/utils/helpers'

export function PageWrapper({ children, className }) {
  return (
    <main
      className={cn(
        'flex-1 container py-6 px-4 animate-fade-in',
        className
      )}
    >
      {children}
    </main>
  )
}

export function PageHeader({ title, description, actions }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}

export function PageSection({ title, children, className }) {
  return (
    <section className={cn('space-y-4', className)}>
      {title && (
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      )}
      {children}
    </section>
  )
}