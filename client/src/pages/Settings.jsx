import React, { useState, useEffect } from 'react'
import { Navbar, Sidebar, PageWrapper, PageHeader } from '@/components/layout'
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Label } from '@/components/ui'
import { useAuthStore } from '@/store/authStore'

export default function Settings() {
  const { user, updateProfile, isLoading } = useAuthStore()
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setAvatar(user.avatar || '')
    }
  }, [user])

  const handleSave = async () => {
    setMessage('')
    try {
      await updateProfile({ name, avatar: avatar || '', password: password || undefined })
      setMessage('Profile updated successfully')
      setPassword('')
    } catch (err) {
      setMessage(err.response?.data?.message || err.message || 'Failed to update profile')
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <PageWrapper>
          <PageHeader title="Settings" description="Update your profile and account settings" />

          <div className="max-w-2xl">
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} />
                </div>

                <div>
                  <Label>Avatar URL</Label>
                  <Input value={avatar} onChange={(e) => setAvatar(e.target.value)} />
                </div>

                <div>
                  <Label>Change Password (optional)</Label>
                  <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>

                {message && (
                  <div className="text-sm text-muted-foreground">{message}</div>
                )}

                <div className="flex items-center gap-2">
                  <Button onClick={handleSave} disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Changes'}</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </PageWrapper>
      </div>
    </div>
  )
}
