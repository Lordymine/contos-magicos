'use client'

import { useState, useCallback } from 'react'
import type { CommentWithUser } from '@/domains/social/types'

interface LikeStatus {
  count: number
  isLiked: boolean
}

interface UseSocialResult {
  likeStatus: LikeStatus | null
  comments: CommentWithUser[]
  loading: boolean
  error: string | null
  fetchLikeStatus: (storyId: string) => Promise<void>
  toggleLike: (storyId: string) => Promise<void>
  fetchComments: (storyId: string) => Promise<void>
  addComment: (storyId: string, content: string) => Promise<CommentWithUser | null>
  deleteComment: (commentId: string) => Promise<boolean>
}

export function useSocial(): UseSocialResult {
  const [likeStatus, setLikeStatus] = useState<LikeStatus | null>(null)
  const [comments, setComments] = useState<CommentWithUser[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchLikeStatus = useCallback(async (storyId: string) => {
    try {
      const response = await fetch(`/api/social/likes?storyId=${storyId}`)
      const data = await response.json()

      if (data.success) {
        setLikeStatus({
          count: data.data.count,
          isLiked: data.data.isLiked,
        })
      }
    } catch (err) {
      console.error('Error fetching like status:', err)
    }
  }, [])

  const toggleLike = useCallback(async (storyId: string) => {
    setError(null)

    try {
      if (likeStatus?.isLiked) {
        const response = await fetch(`/api/social/likes?storyId=${storyId}`, {
          method: 'DELETE',
        })
        const data = await response.json()

        if (data.success) {
          setLikeStatus(prev => prev ? {
            count: prev.count - 1,
            isLiked: false,
          } : null)
        } else {
          throw new Error(data.error)
        }
      } else {
        const response = await fetch('/api/social/likes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ storyId }),
        })
        const data = await response.json()

        if (data.success) {
          setLikeStatus(prev => prev ? {
            count: prev.count + 1,
            isLiked: true,
          } : { count: 1, isLiked: true })
        } else {
          throw new Error(data.error)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }, [likeStatus])

  const fetchComments = useCallback(async (storyId: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/social/comments?storyId=${storyId}`)
      const data = await response.json()

      if (data.success) {
        setComments(data.data)
      } else {
        throw new Error(data.error)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [])

  const addComment = useCallback(async (storyId: string, content: string): Promise<CommentWithUser | null> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/social/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storyId, content }),
      })
      const data = await response.json()

      if (data.success) {
        await fetchComments(storyId)
        return data.data
      } else {
        throw new Error(data.error)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      return null
    } finally {
      setLoading(false)
    }
  }, [fetchComments])

  const deleteComment = useCallback(async (commentId: string): Promise<boolean> => {
    setError(null)

    try {
      const response = await fetch(`/api/social/comments/${commentId}`, {
        method: 'DELETE',
      })
      const data = await response.json()

      if (data.success) {
        setComments(prev => prev.filter(c => c.id !== commentId))
        return true
      } else {
        throw new Error(data.error)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      return false
    }
  }, [])

  return {
    likeStatus,
    comments,
    loading,
    error,
    fetchLikeStatus,
    toggleLike,
    fetchComments,
    addComment,
    deleteComment,
  }
}
