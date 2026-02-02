'use client'

import { useState, useEffect, useCallback } from 'react'
import type { NotificationWithMeta } from '@/domains/notification/types'

interface UseNotificationsResult {
  notifications: NotificationWithMeta[]
  unreadCount: number
  loading: boolean
  error: string | null
  fetchNotifications: () => Promise<void>
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
}

export function useNotifications(): UseNotificationsResult {
  const [notifications, setNotifications] = useState<NotificationWithMeta[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchNotifications = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/notifications')
      const data = await response.json()

      if (data.success) {
        setNotifications(data.data.notifications)
        setUnreadCount(data.data.unreadCount)
      } else {
        throw new Error(data.error)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [])

  const markAsRead = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}/read`, {
        method: 'POST',
      })
      const data = await response.json()

      if (data.success) {
        setNotifications(prev =>
          prev.map(n => n.id === id ? { ...n, read: true } : n)
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (err) {
      console.error('Error marking notification as read:', err)
    }
  }, [])

  const markAllAsRead = useCallback(async () => {
    try {
      const response = await fetch('/api/notifications/read-all', {
        method: 'POST',
      })
      const data = await response.json()

      if (data.success) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })))
        setUnreadCount(0)
      }
    } catch (err) {
      console.error('Error marking all notifications as read:', err)
    }
  }, [])

  useEffect(() => {
    const eventSource = new EventSource('/api/notifications/stream')

    eventSource.onmessage = (event) => {
      try {
        const notification = JSON.parse(event.data)
        setNotifications(prev => [notification, ...prev])
        setUnreadCount(prev => prev + 1)
      } catch {
        // keepalive message
      }
    }

    eventSource.onerror = () => {
      eventSource.close()
    }

    return () => {
      eventSource.close()
    }
  }, [])

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  }
}
