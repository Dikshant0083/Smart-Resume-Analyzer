import React, { useEffect, useState, useMemo } from 'react'
import { Users, FileText, TrendingUp, BarChart3, Activity, Shield, ToggleLeft, ToggleRight, Loader2, Search, X } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Badge, Button, Input } from '@/components/ui'
import { Navbar, Sidebar, PageWrapper, PageHeader } from '@/components/layout'
import { StatsGrid } from '@/components/dashboard'
import { adminAPI } from '@/api'
import { formatDate, cn } from '@/utils/helpers'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

// Custom Stat Card for Admin
function AdminStatCard({ label, value, icon: Icon, change, delay = 0 }) {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <Card className={cn(
      'p-6 transition-all duration-500',
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    )}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {change !== undefined && (
            <p className={cn(
              'text-sm mt-1 flex items-center gap-1',
              change >= 0 ? 'text-green-600' : 'text-red-600'
            )}>
              <TrendingUp className={cn('w-3 h-3', change < 0 && 'rotate-180')} />
              {Math.abs(change)}% from last month
            </p>
          )}
        </div>
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>
    </Card>
  )
}

// Status Toggle Component
function StatusToggle({ isActive, onToggle, disabled }) {
  const [isToggling, setIsToggling] = useState(false)

  const handleToggle = async () => {
    setIsToggling(true)
    try {
      await onToggle()
    } finally {
      setIsToggling(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={disabled || isToggling}
      className={cn(
        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
        isActive ? 'bg-green-500' : 'bg-muted',
        (disabled || isToggling) && 'opacity-50 cursor-not-allowed'
      )}
    >
      <span className={cn(
        'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
        isActive ? 'translate-x-6' : 'translate-x-1'
      )} />
      {isToggling && (
        <Loader2 className="absolute w-3 h-3 animate-spin text-white" />
      )}
    </button>
  )
}

// Search and Filter Component
function UserFilters({ filters, onFilterChange, onClear }) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <div className="relative flex-1 max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          value={filters.search}
          onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
          className="pl-10"
        />
      </div>
      <select
        value={filters.role}
        onChange={(e) => onFilterChange({ ...filters, role: e.target.value })}
        className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
      >
        <option value="all">All Roles</option>
        <option value="admin">Admin</option>
        <option value="user">User</option>
      </select>
      <select
        value={filters.status}
        onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
        className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
      >
        <option value="all">All Status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
      {(filters.search || filters.role !== 'all' || filters.status !== 'all') && (
        <Button variant="ghost" onClick={onClear} className="gap-1">
          <X className="w-4 h-4" />
          Clear
        </Button>
      )}
    </div>
  )
}

// Analyses Chart Component
function AnalysesChart({ data }) {
  const chartData = useMemo(() => {
    // Generate last 30 days
    const days = []
    const today = new Date()
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      const dayData = data.find(d => d.date === dateStr)
      days.push({
        date: dateStr,
        label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count: dayData ? dayData.count : 0,
      })
    }
    
    return days
  }, [data])

  const maxCount = Math.max(...chartData.map(d => d.count), 1)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Analyses (Last 30 Days)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="label" 
                tick={{ fontSize: 10 }} 
                tickLine={false}
                axisLine={false}
                interval={4}
              />
              <YAxis 
                tick={{ fontSize: 10 }} 
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`}
                    fill={entry.count > 0 ? 'hsl(var(--primary))' : 'hsl(var(--muted))'}
                    opacity={entry.count > 0 ? 0.8 : 0.3}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex justify-between text-sm text-muted-foreground">
          <span>Total: {chartData.reduce((sum, d) => sum + d.count, 0)} analyses</span>
          <span>Avg: {Math.round(chartData.reduce((sum, d) => sum + d.count, 0) / 30)}/day</span>
        </div>
      </CardContent>
    </Card>
  )
}

export default function Admin() {
  const [stats, setStats] = useState([])
  const [users, setUsers] = useState([])
  const [analysesData, setAnalysesData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    role: 'all',
    status: 'all',
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [statsData, usersData, analysesResult] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getUsers(),
        adminAPI.getAnalysesByDay(),
      ])
      
      setStats([
        { label: 'Total Users', value: statsData.stats.totalUsers, icon: Users, change: 15 },
        { label: 'Total Resumes', value: statsData.stats.totalResumes, icon: FileText, change: 22 },
        { label: 'Total Analyses', value: statsData.stats.totalAnalyses, icon: Activity, change: 18 },
        { label: 'Active Users', value: statsData.stats.activeUsers, icon: Shield, change: 8 },
      ])
      
      setUsers(usersData.users)
      setAnalysesData(analysesResult.data || [])
    } catch (err) {
      console.error('Failed to fetch admin data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      await adminAPI.toggleUserStatus(userId, !currentStatus)
      setUsers(users.map(u => 
        u._id === userId ? { ...u, isActive: !currentStatus } : u
      ))
    } catch (err) {
      alert('Failed to update user status')
    }
  }

  const getRoleBadge = (role) => {
    return role === 'admin' ? (
      <Badge variant="destructive">Admin</Badge>
    ) : (
      <Badge variant="secondary">User</Badge>
    )
  }

  const getStatusBadge = (isActive) => {
    return isActive ? (
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-100">
        Active
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-muted text-muted-foreground">
        Inactive
      </Badge>
    )
  }

  const clearFilters = () => {
    setFilters({ search: '', role: 'all', status: 'all' })
  }

  // Filter users
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesName = (user.name || '').toLowerCase().includes(searchLower)
        const matchesEmail = (user.email || '').toLowerCase().includes(searchLower)
        if (!matchesName && !matchesEmail) return false
      }
      if (filters.role !== 'all' && user.role !== filters.role) return false
      if (filters.status !== 'all') {
        const isActive = user.isActive !== false
        if (filters.status === 'active' && !isActive) return false
        if (filters.status === 'inactive' && isActive) return false
      }
      return true
    })
  }, [users, filters])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <PageWrapper>
          <PageHeader
            title="Admin Dashboard"
            description="Manage users and view platform statistics"
          />

          {isLoading ? (
            // Loading skeleton
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <Card key={i} className="p-6 animate-pulse">
                    <div className="h-20 bg-muted rounded" />
                  </Card>
                ))}
              </div>
              <div className="h-[400px] bg-muted rounded-lg animate-pulse" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <AdminStatCard
                    key={stat.label}
                    label={stat.label}
                    value={stat.value}
                    icon={stat.icon}
                    change={stat.change}
                    delay={index * 100}
                  />
                ))}
              </div>

              {/* Analyses Chart */}
              <AnalysesChart data={analysesData} />

              {/* User Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    User Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <UserFilters 
                    filters={filters}
                    onFilterChange={setFilters}
                    onClear={clearFilters}
                  />
                  
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Resumes</TableHead>
                          <TableHead>Analyses</TableHead>
                          <TableHead>Joined</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                              No users found
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredUsers.map((user) => (
                            <TableRow key={user._id}>
                              <TableCell className="font-medium">{user.name}</TableCell>
                              <TableCell className="text-muted-foreground">{user.email}</TableCell>
                              <TableCell>{getRoleBadge(user.role)}</TableCell>
                              <TableCell>{getStatusBadge(user.isActive !== false)}</TableCell>
                              <TableCell>{user.resumeCount || 0}</TableCell>
                              <TableCell>{user.analysisCount || 0}</TableCell>
                              <TableCell className="text-muted-foreground text-sm">
                                {formatDate(user.createdAt)}
                              </TableCell>
                              <TableCell>
                                <StatusToggle
                                  isActive={user.isActive !== false}
                                  onToggle={() => handleToggleUserStatus(user._id, user.isActive !== false)}
                                  disabled={user.role === 'admin'}
                                />
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {filteredUsers.length > 0 && (
                    <p className="mt-4 text-sm text-muted-foreground">
                      Showing {filteredUsers.length} of {users.length} users
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </PageWrapper>
      </div>
    </div>
  )
}