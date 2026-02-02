import { describe, it, expect, vi, beforeEach } from 'vitest'
import { StoryService, type StoryGenerator } from '../service'
import type { StoryRepository } from '../repository'
import type { Story, StoryWithAuthor } from '../types'

const mockStory: Story = {
  id: 'cltest123456789012345',
  title: 'The Magic Forest',
  content: 'Once upon a time...',
  theme: 'fantasy',
  ageGroup: '6-8',
  authorId: 'cluser123456789012345',
  isPublic: false,
  likesCount: 0,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
}

const mockStoryWithAuthor: StoryWithAuthor = {
  ...mockStory,
  author: {
    id: 'cluser123456789012345',
    name: 'Test User',
    image: null,
  },
}

describe('StoryService', () => {
  let service: StoryService
  let mockRepository: StoryRepository
  let mockGenerator: StoryGenerator

  beforeEach(() => {
    mockRepository = {
      findById: vi.fn(),
      findByIdWithAuthor: vi.fn(),
      findAll: vi.fn(),
      findAllWithAuthor: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      incrementLikes: vi.fn(),
      decrementLikes: vi.fn(),
      countByAuthor: vi.fn(),
    }

    mockGenerator = {
      generate: vi.fn().mockResolvedValue({
        title: 'Generated Title',
        content: 'Generated content...',
      }),
    }

    service = new StoryService(mockRepository, mockGenerator)
  })

  describe('getById', () => {
    it('returns story when found', async () => {
      vi.mocked(mockRepository.findById).mockResolvedValue(mockStory)

      const result = await service.getById('cltest123456789012345')

      expect(result).toEqual(mockStory)
      expect(mockRepository.findById).toHaveBeenCalledWith('cltest123456789012345')
    })

    it('returns null when not found', async () => {
      vi.mocked(mockRepository.findById).mockResolvedValue(null)

      const result = await service.getById('nonexistent')

      expect(result).toBeNull()
    })
  })

  describe('getByIdWithAuthor', () => {
    it('returns story with author when found', async () => {
      vi.mocked(mockRepository.findByIdWithAuthor).mockResolvedValue(mockStoryWithAuthor)

      const result = await service.getByIdWithAuthor('cltest123456789012345')

      expect(result).toEqual(mockStoryWithAuthor)
      expect(result?.author.name).toBe('Test User')
    })
  })

  describe('getAll', () => {
    it('returns stories with validated filters', async () => {
      vi.mocked(mockRepository.findAll).mockResolvedValue([mockStory])

      const result = await service.getAll({ limit: 10, offset: 0 })

      expect(result).toHaveLength(1)
      expect(mockRepository.findAll).toHaveBeenCalledWith({
        limit: 10,
        offset: 0,
      })
    })

    it('applies default pagination values', async () => {
      vi.mocked(mockRepository.findAll).mockResolvedValue([])

      await service.getAll({})

      expect(mockRepository.findAll).toHaveBeenCalledWith({
        limit: 20,
        offset: 0,
      })
    })

    it('filters by theme', async () => {
      vi.mocked(mockRepository.findAll).mockResolvedValue([])

      await service.getAll({ theme: 'fantasy' })

      expect(mockRepository.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ theme: 'fantasy' })
      )
    })

    it('rejects invalid theme', async () => {
      await expect(
        service.getAll({ theme: 'invalid' as any })
      ).rejects.toThrow()
    })
  })

  describe('create', () => {
    it('creates story with generated content', async () => {
      vi.mocked(mockRepository.create).mockResolvedValue(mockStory)

      const result = await service.create(
        {
          title: 'My Story',
          theme: 'fantasy',
          ageGroup: '6-8',
          prompt: 'A story about a magical forest',
          isPublic: false,
        },
        'cluser123456789012345'
      )

      expect(mockGenerator.generate).toHaveBeenCalledWith({
        theme: 'fantasy',
        ageGroup: '6-8',
        prompt: 'A story about a magical forest',
      })
      expect(mockRepository.create).toHaveBeenCalledWith({
        title: 'My Story',
        content: 'Generated content...',
        theme: 'fantasy',
        ageGroup: '6-8',
        authorId: 'cluser123456789012345',
        isPublic: false,
      })
      expect(result).toEqual(mockStory)
    })

    it('validates input', async () => {
      await expect(
        service.create(
          {
            title: '',
            theme: 'fantasy',
            ageGroup: '6-8',
            prompt: 'short',
          },
          'cluser123456789012345'
        )
      ).rejects.toThrow()
    })

    it('rejects prompt shorter than 10 characters', async () => {
      await expect(
        service.create(
          {
            title: 'Valid Title',
            theme: 'fantasy',
            ageGroup: '6-8',
            prompt: 'too short',
          },
          'cluser123456789012345'
        )
      ).rejects.toThrow()
    })
  })

  describe('update', () => {
    it('updates story when authorized', async () => {
      vi.mocked(mockRepository.findById).mockResolvedValue(mockStory)
      vi.mocked(mockRepository.update).mockResolvedValue({
        ...mockStory,
        title: 'Updated Title',
      })

      const result = await service.update(
        'cltest123456789012345',
        { title: 'Updated Title' },
        'cluser123456789012345'
      )

      expect(result.title).toBe('Updated Title')
    })

    it('throws when story not found', async () => {
      vi.mocked(mockRepository.findById).mockResolvedValue(null)

      await expect(
        service.update('nonexistent', { title: 'New' }, 'cluser123456789012345')
      ).rejects.toThrow('Story not found')
    })

    it('throws when user is not author', async () => {
      vi.mocked(mockRepository.findById).mockResolvedValue(mockStory)

      await expect(
        service.update('cltest123456789012345', { title: 'New' }, 'different-user')
      ).rejects.toThrow('Unauthorized')
    })
  })

  describe('delete', () => {
    it('deletes story when authorized', async () => {
      vi.mocked(mockRepository.findById).mockResolvedValue(mockStory)
      vi.mocked(mockRepository.delete).mockResolvedValue()

      await service.delete('cltest123456789012345', 'cluser123456789012345')

      expect(mockRepository.delete).toHaveBeenCalledWith('cltest123456789012345')
    })

    it('throws when story not found', async () => {
      vi.mocked(mockRepository.findById).mockResolvedValue(null)

      await expect(
        service.delete('nonexistent', 'cluser123456789012345')
      ).rejects.toThrow('Story not found')
    })

    it('throws when user is not author', async () => {
      vi.mocked(mockRepository.findById).mockResolvedValue(mockStory)

      await expect(
        service.delete('cltest123456789012345', 'different-user')
      ).rejects.toThrow('Unauthorized')
    })
  })

  describe('getPublicStories', () => {
    it('returns only public stories', async () => {
      vi.mocked(mockRepository.findAllWithAuthor).mockResolvedValue([mockStoryWithAuthor])

      await service.getPublicStories({ limit: 10 })

      expect(mockRepository.findAllWithAuthor).toHaveBeenCalledWith(
        expect.objectContaining({ isPublic: true })
      )
    })
  })

  describe('getUserStories', () => {
    it('returns stories for specific user', async () => {
      vi.mocked(mockRepository.findAll).mockResolvedValue([mockStory])

      await service.getUserStories('cluser123456789012345', { limit: 10 })

      expect(mockRepository.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ authorId: 'cluser123456789012345' })
      )
    })
  })
})
