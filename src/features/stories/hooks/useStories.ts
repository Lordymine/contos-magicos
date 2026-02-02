'use client'

import { useState, useCallback } from 'react'
import type { StoryWithAuthor, CreateStoryInput, StoryFilters } from '@/domains/story/types'

interface UseStoriesResult {
  stories: StoryWithAuthor[]
  loading: boolean
  error: string | null
  fetchStories: (filters?: StoryFilters) => Promise<void>
  fetchMyStories: () => Promise<void>
  createStory: (input: CreateStoryInput) => Promise<StoryWithAuthor | null>
  deleteStory: (id: string) => Promise<boolean>
}

export function useStories(): UseStoriesResult {
  const [stories, setStories] = useState<StoryWithAuthor[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStories = useCallback(async (filters?: StoryFilters) => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (filters?.theme) params.set('theme', filters.theme)
      if (filters?.ageGroup) params.set('ageGroup', filters.ageGroup)
      if (filters?.limit) params.set('limit', filters.limit.toString())
      if (filters?.offset) params.set('offset', filters.offset.toString())

      const response = await fetch(`/api/stories?${params}`)
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch stories')
      }

      setStories(data.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchMyStories = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/stories/my')
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch your stories')
      }

      setStories(data.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [])

  const createStory = useCallback(async (input: CreateStoryInput): Promise<StoryWithAuthor | null> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to create story')
      }

      return data.data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteStory = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/stories/${id}`, {
        method: 'DELETE',
      })
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to delete story')
      }

      setStories(prev => prev.filter(s => s.id !== id))
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    stories,
    loading,
    error,
    fetchStories,
    fetchMyStories,
    createStory,
    deleteStory,
  }
}
