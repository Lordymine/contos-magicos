import { describe, it, expect } from 'vitest'
import {
  StorySchema,
  CreateStoryInputSchema,
  UpdateStoryInputSchema,
  StoryFiltersSchema,
  StoryTheme,
  AgeGroup,
} from '../types'

describe('Story Types', () => {
  describe('StoryTheme', () => {
    it('accepts valid themes', () => {
      const themes = ['adventure', 'fantasy', 'animals', 'friendship', 'nature', 'space', 'fairytale', 'mystery']
      themes.forEach(theme => {
        expect(StoryTheme.parse(theme)).toBe(theme)
      })
    })

    it('rejects invalid theme', () => {
      expect(() => StoryTheme.parse('horror')).toThrow()
    })
  })

  describe('AgeGroup', () => {
    it('accepts valid age groups', () => {
      expect(AgeGroup.parse('3-5')).toBe('3-5')
      expect(AgeGroup.parse('6-8')).toBe('6-8')
      expect(AgeGroup.parse('9-12')).toBe('9-12')
    })

    it('rejects invalid age group', () => {
      expect(() => AgeGroup.parse('0-2')).toThrow()
      expect(() => AgeGroup.parse('13+')).toThrow()
    })
  })

  describe('StorySchema', () => {
    const validStory = {
      id: 'cltest123456789012345',
      title: 'Test Story',
      content: 'Story content here',
      theme: 'fantasy',
      ageGroup: '6-8',
      authorId: 'cluser123456789012345',
      isPublic: true,
      likesCount: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    it('accepts valid story', () => {
      const result = StorySchema.parse(validStory)
      expect(result.title).toBe('Test Story')
    })

    it('rejects empty title', () => {
      expect(() =>
        StorySchema.parse({ ...validStory, title: '' })
      ).toThrow()
    })

    it('rejects title longer than 200 characters', () => {
      expect(() =>
        StorySchema.parse({ ...validStory, title: 'a'.repeat(201) })
      ).toThrow()
    })

    it('rejects negative likesCount', () => {
      expect(() =>
        StorySchema.parse({ ...validStory, likesCount: -1 })
      ).toThrow()
    })

    it('defaults isPublic to false', () => {
      const storyWithoutPublic = { ...validStory }
      delete (storyWithoutPublic as any).isPublic
      const result = StorySchema.parse(storyWithoutPublic)
      expect(result.isPublic).toBe(false)
    })
  })

  describe('CreateStoryInputSchema', () => {
    const validInput = {
      title: 'My Story',
      theme: 'adventure',
      ageGroup: '6-8',
      prompt: 'A story about a brave knight',
    }

    it('accepts valid input', () => {
      const result = CreateStoryInputSchema.parse(validInput)
      expect(result.title).toBe('My Story')
      expect(result.isPublic).toBe(false)
    })

    it('accepts input with isPublic', () => {
      const result = CreateStoryInputSchema.parse({ ...validInput, isPublic: true })
      expect(result.isPublic).toBe(true)
    })

    it('rejects prompt shorter than 10 characters', () => {
      expect(() =>
        CreateStoryInputSchema.parse({ ...validInput, prompt: 'short' })
      ).toThrow()
    })

    it('rejects prompt longer than 500 characters', () => {
      expect(() =>
        CreateStoryInputSchema.parse({ ...validInput, prompt: 'a'.repeat(501) })
      ).toThrow()
    })

    it('provides meaningful error for empty title', () => {
      try {
        CreateStoryInputSchema.parse({ ...validInput, title: '' })
        expect.fail('Should have thrown')
      } catch (error: any) {
        expect(error.issues[0].message).toBe('Title is required')
      }
    })
  })

  describe('UpdateStoryInputSchema', () => {
    it('accepts partial update with title', () => {
      const result = UpdateStoryInputSchema.parse({ title: 'New Title' })
      expect(result.title).toBe('New Title')
    })

    it('accepts partial update with isPublic', () => {
      const result = UpdateStoryInputSchema.parse({ isPublic: true })
      expect(result.isPublic).toBe(true)
    })

    it('accepts empty object', () => {
      const result = UpdateStoryInputSchema.parse({})
      expect(result.title).toBeUndefined()
      expect(result.isPublic).toBeUndefined()
    })
  })

  describe('StoryFiltersSchema', () => {
    it('applies default values', () => {
      const result = StoryFiltersSchema.parse({})
      expect(result.limit).toBe(20)
      expect(result.offset).toBe(0)
    })

    it('accepts valid filters', () => {
      const result = StoryFiltersSchema.parse({
        theme: 'fantasy',
        ageGroup: '6-8',
        isPublic: true,
        limit: 50,
        offset: 10,
      })
      expect(result.theme).toBe('fantasy')
      expect(result.limit).toBe(50)
    })

    it('rejects limit over 100', () => {
      expect(() =>
        StoryFiltersSchema.parse({ limit: 101 })
      ).toThrow()
    })

    it('rejects negative offset', () => {
      expect(() =>
        StoryFiltersSchema.parse({ offset: -1 })
      ).toThrow()
    })
  })
})
