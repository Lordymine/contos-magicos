import { describe, it, expect, vi, beforeEach } from 'vitest'
import { LikeService, CommentService, type NotificationService, type StoryLikesUpdater } from '../service'
import type { LikeRepository, CommentRepository, MentionRepository, UserLookupRepository } from '../repository'
import type { Like, Comment, CommentWithUser } from '../types'

const mockLike: Like = {
  id: 'cllike12345678901234',
  userId: 'cluser123456789012345',
  storyId: 'clstory12345678901234',
  createdAt: new Date('2024-01-01'),
}

const mockComment: Comment = {
  id: 'clcomm12345678901234',
  content: 'Great story!',
  userId: 'cluser123456789012345',
  storyId: 'clstory12345678901234',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
}

const mockCommentWithUser: CommentWithUser = {
  ...mockComment,
  user: {
    id: 'cluser123456789012345',
    name: 'Test User',
    image: null,
  },
  mentions: [],
}

describe('LikeService', () => {
  let service: LikeService
  let mockLikeRepo: LikeRepository
  let mockStoryUpdater: StoryLikesUpdater
  let mockNotifications: NotificationService

  beforeEach(() => {
    mockLikeRepo = {
      findByUserAndStory: vi.fn(),
      findByStory: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
      countByStory: vi.fn(),
    }

    mockStoryUpdater = {
      incrementLikes: vi.fn(),
      decrementLikes: vi.fn(),
      getAuthorId: vi.fn(),
    }

    mockNotifications = {
      notifyMention: vi.fn(),
      notifyLike: vi.fn(),
      notifyComment: vi.fn(),
    }

    service = new LikeService(mockLikeRepo, mockStoryUpdater, mockNotifications)
  })

  describe('like', () => {
    it('creates like when not already liked', async () => {
      vi.mocked(mockLikeRepo.findByUserAndStory).mockResolvedValue(null)
      vi.mocked(mockLikeRepo.create).mockResolvedValue(mockLike)
      vi.mocked(mockStoryUpdater.getAuthorId).mockResolvedValue('author-id')

      const result = await service.like('cluser123456789012345', 'clstory12345678901234', 'Test User')

      expect(result).toEqual(mockLike)
      expect(mockLikeRepo.create).toHaveBeenCalledWith({
        userId: 'cluser123456789012345',
        storyId: 'clstory12345678901234',
      })
      expect(mockStoryUpdater.incrementLikes).toHaveBeenCalledWith('clstory12345678901234')
    })

    it('throws when already liked', async () => {
      vi.mocked(mockLikeRepo.findByUserAndStory).mockResolvedValue(mockLike)

      await expect(
        service.like('cluser123456789012345', 'clstory12345678901234', 'Test User')
      ).rejects.toThrow('Already liked')
    })

    it('notifies story author', async () => {
      vi.mocked(mockLikeRepo.findByUserAndStory).mockResolvedValue(null)
      vi.mocked(mockLikeRepo.create).mockResolvedValue(mockLike)
      vi.mocked(mockStoryUpdater.getAuthorId).mockResolvedValue('author-id')

      await service.like('cluser123456789012345', 'clstory12345678901234', 'Test User')

      expect(mockNotifications.notifyLike).toHaveBeenCalledWith(
        'author-id',
        'Test User',
        'clstory12345678901234'
      )
    })

    it('does not notify if user is author', async () => {
      vi.mocked(mockLikeRepo.findByUserAndStory).mockResolvedValue(null)
      vi.mocked(mockLikeRepo.create).mockResolvedValue(mockLike)
      vi.mocked(mockStoryUpdater.getAuthorId).mockResolvedValue('cluser123456789012345')

      await service.like('cluser123456789012345', 'clstory12345678901234', 'Test User')

      expect(mockNotifications.notifyLike).not.toHaveBeenCalled()
    })
  })

  describe('unlike', () => {
    it('removes like when exists', async () => {
      vi.mocked(mockLikeRepo.findByUserAndStory).mockResolvedValue(mockLike)
      vi.mocked(mockLikeRepo.delete).mockResolvedValue()

      await service.unlike('cluser123456789012345', 'clstory12345678901234')

      expect(mockLikeRepo.delete).toHaveBeenCalledWith('cluser123456789012345', 'clstory12345678901234')
      expect(mockStoryUpdater.decrementLikes).toHaveBeenCalledWith('clstory12345678901234')
    })

    it('throws when not liked', async () => {
      vi.mocked(mockLikeRepo.findByUserAndStory).mockResolvedValue(null)

      await expect(
        service.unlike('cluser123456789012345', 'clstory12345678901234')
      ).rejects.toThrow('Not liked')
    })
  })

  describe('isLiked', () => {
    it('returns true when liked', async () => {
      vi.mocked(mockLikeRepo.findByUserAndStory).mockResolvedValue(mockLike)

      const result = await service.isLiked('cluser123456789012345', 'clstory12345678901234')

      expect(result).toBe(true)
    })

    it('returns false when not liked', async () => {
      vi.mocked(mockLikeRepo.findByUserAndStory).mockResolvedValue(null)

      const result = await service.isLiked('cluser123456789012345', 'clstory12345678901234')

      expect(result).toBe(false)
    })
  })
})

describe('CommentService', () => {
  let service: CommentService
  let mockCommentRepo: CommentRepository
  let mockMentionRepo: MentionRepository
  let mockUserLookup: UserLookupRepository
  let mockStoryUpdater: StoryLikesUpdater
  let mockNotifications: NotificationService

  beforeEach(() => {
    mockCommentRepo = {
      findById: vi.fn(),
      findByIdWithUser: vi.fn(),
      findByStory: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      countByStory: vi.fn(),
    }

    mockMentionRepo = {
      create: vi.fn(),
      createMany: vi.fn(),
      deleteByComment: vi.fn(),
      findByUser: vi.fn(),
    }

    mockUserLookup = {
      findByUsername: vi.fn(),
      findByUsernames: vi.fn(),
    }

    mockStoryUpdater = {
      incrementLikes: vi.fn(),
      decrementLikes: vi.fn(),
      getAuthorId: vi.fn(),
    }

    mockNotifications = {
      notifyMention: vi.fn(),
      notifyLike: vi.fn(),
      notifyComment: vi.fn(),
    }

    service = new CommentService(
      mockCommentRepo,
      mockMentionRepo,
      mockUserLookup,
      mockStoryUpdater,
      mockNotifications
    )
  })

  describe('create', () => {
    it('creates comment without mentions', async () => {
      vi.mocked(mockCommentRepo.create).mockResolvedValue(mockComment)
      vi.mocked(mockUserLookup.findByUsernames).mockResolvedValue([])
      vi.mocked(mockStoryUpdater.getAuthorId).mockResolvedValue('author-id')

      const result = await service.create(
        { content: 'Great story!', storyId: 'clstory12345678901234' },
        'cluser123456789012345',
        'Test User'
      )

      expect(result).toEqual(mockComment)
      expect(mockCommentRepo.create).toHaveBeenCalledWith({
        content: 'Great story!',
        storyId: 'clstory12345678901234',
        userId: 'cluser123456789012345',
      })
    })

    it('creates mentions when @ users exist', async () => {
      vi.mocked(mockCommentRepo.create).mockResolvedValue({
        ...mockComment,
        content: 'Hey @john and @jane!',
      })
      vi.mocked(mockUserLookup.findByUsernames).mockResolvedValue([
        { id: 'john-id', name: 'john' },
        { id: 'jane-id', name: 'jane' },
      ])
      vi.mocked(mockStoryUpdater.getAuthorId).mockResolvedValue('author-id')

      await service.create(
        { content: 'Hey @john and @jane!', storyId: 'clstory12345678901234' },
        'cluser123456789012345',
        'Test User'
      )

      expect(mockMentionRepo.createMany).toHaveBeenCalledWith([
        { commentId: 'clcomm12345678901234', mentionedUserId: 'john-id' },
        { commentId: 'clcomm12345678901234', mentionedUserId: 'jane-id' },
      ])
    })

    it('notifies mentioned users', async () => {
      vi.mocked(mockCommentRepo.create).mockResolvedValue({
        ...mockComment,
        content: 'Hey @john!',
      })
      vi.mocked(mockUserLookup.findByUsernames).mockResolvedValue([
        { id: 'john-id', name: 'john' },
      ])
      vi.mocked(mockStoryUpdater.getAuthorId).mockResolvedValue('author-id')

      await service.create(
        { content: 'Hey @john!', storyId: 'clstory12345678901234' },
        'cluser123456789012345',
        'Test User'
      )

      expect(mockNotifications.notifyMention).toHaveBeenCalledWith(
        'john-id',
        'clcomm12345678901234',
        'Test User'
      )
    })

    it('does not notify self-mentions', async () => {
      vi.mocked(mockCommentRepo.create).mockResolvedValue({
        ...mockComment,
        content: 'Hey @self!',
      })
      vi.mocked(mockUserLookup.findByUsernames).mockResolvedValue([
        { id: 'cluser123456789012345', name: 'self' },
      ])
      vi.mocked(mockStoryUpdater.getAuthorId).mockResolvedValue('author-id')

      await service.create(
        { content: 'Hey @self!', storyId: 'clstory12345678901234' },
        'cluser123456789012345',
        'Test User'
      )

      expect(mockNotifications.notifyMention).not.toHaveBeenCalled()
    })

    it('validates content is not empty', async () => {
      await expect(
        service.create(
          { content: '', storyId: 'clstory12345678901234' },
          'cluser123456789012345',
          'Test User'
        )
      ).rejects.toThrow()
    })

    it('validates content is not too long', async () => {
      await expect(
        service.create(
          { content: 'a'.repeat(1001), storyId: 'clstory12345678901234' },
          'cluser123456789012345',
          'Test User'
        )
      ).rejects.toThrow()
    })
  })

  describe('update', () => {
    it('updates comment when authorized', async () => {
      vi.mocked(mockCommentRepo.findById).mockResolvedValue(mockComment)
      vi.mocked(mockCommentRepo.update).mockResolvedValue({
        ...mockComment,
        content: 'Updated content',
      })
      vi.mocked(mockUserLookup.findByUsernames).mockResolvedValue([])

      const result = await service.update(
        'clcomm12345678901234',
        { content: 'Updated content' },
        'cluser123456789012345'
      )

      expect(result.content).toBe('Updated content')
      expect(mockMentionRepo.deleteByComment).toHaveBeenCalledWith('clcomm12345678901234')
    })

    it('throws when comment not found', async () => {
      vi.mocked(mockCommentRepo.findById).mockResolvedValue(null)

      await expect(
        service.update('nonexistent', { content: 'New' }, 'cluser123456789012345')
      ).rejects.toThrow('Comment not found')
    })

    it('throws when user is not author', async () => {
      vi.mocked(mockCommentRepo.findById).mockResolvedValue(mockComment)

      await expect(
        service.update('clcomm12345678901234', { content: 'New' }, 'different-user')
      ).rejects.toThrow('Unauthorized')
    })
  })

  describe('delete', () => {
    it('deletes comment when authorized', async () => {
      vi.mocked(mockCommentRepo.findById).mockResolvedValue(mockComment)
      vi.mocked(mockCommentRepo.delete).mockResolvedValue()

      await service.delete('clcomm12345678901234', 'cluser123456789012345')

      expect(mockMentionRepo.deleteByComment).toHaveBeenCalledWith('clcomm12345678901234')
      expect(mockCommentRepo.delete).toHaveBeenCalledWith('clcomm12345678901234')
    })

    it('throws when user is not author', async () => {
      vi.mocked(mockCommentRepo.findById).mockResolvedValue(mockComment)

      await expect(
        service.delete('clcomm12345678901234', 'different-user')
      ).rejects.toThrow('Unauthorized')
    })
  })

  describe('getByStory', () => {
    it('returns comments for story', async () => {
      vi.mocked(mockCommentRepo.findByStory).mockResolvedValue([mockCommentWithUser])

      const result = await service.getByStory('clstory12345678901234', 20, 0)

      expect(result).toHaveLength(1)
      expect(mockCommentRepo.findByStory).toHaveBeenCalledWith('clstory12345678901234', 20, 0)
    })
  })
})
