import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, FileText, History, Settings, BarChart3, Users } from 'lucide-react'
import { cn } from '@/utils/helpers'
import { useAuthStore } from '@/store/authStore'

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: Home },
  { path: '/analyze', label: 'Analyze Resume', icon: FileText },
  { path: '/create-resume', label: 'Create Resume', icon: BarChart3 },
  { path: '/history', label: 'History', icon: History },
]

const adminItems = [
  { path: '/admin', label: 'Admin Panel', icon: BarChart3 },
  { path: '/admin/users', label: 'Users', icon: Users },
]

export function Sidebar() {
  const location = useLocation()
  const { user } = useAuthStore()
  const isAdmin = user?.role === 'admin'

  return (
    <aside className="hidden lg:flex flex-col w-64 h-[calc(100vh-4rem)] sticky top-16 border-r bg-card p-4">
      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {isAdmin && (
        <>
          <div className="my-4 border-t" />
          <div className="space-y-2">
            <p className="px-3 text-xs font-semibold text-muted-foreground uppercase">
              Admin
            </p>
            {adminItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              )
            })}
          </div>
        </>
      )}

      <div className="mt-auto pt-4 border-t">
        <Link
          to="/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
        >
          <Settings className="w-5 h-5" />
          Settings
        </Link>
      </div>
    </aside>
  )
}