import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NotificationService, type NotificationEmitter } from '../service'
import type { NotificationRepository } from '../repository'
import type { Notification } from '../types'

const mockNotification: Notification = {
  id: 'clnoti12345678901234',
  userId: 'cluser123456789012345',
  type: 'like',
  title: 'Nova curtida',
  message: 'John curtiu sua história',
  data: { storyId: 'clstory12345678901234' },
  read: false,
  createdAt: new Date('2024-01-01'),
}

describe('NotificationService', () => {
  let service: NotificationService
  let mockRepository: NotificationRepository
  let mockEmitter: NotificationEmitter

  beforeEach(() => {
    mockRepository = {
      findById: vi.fn(),
      findByUser: vi.fn(),
      findUnreadByUser: vi.fn(),
      create: vi.fn(),
      markAsRead: vi.fn(),
      markAllAsRead: vi.fn(),
      delete: vi.fn(),
      countUnread: vi.fn(),
    }

    mockEmitter = {
      emit: vi.fn(),
    }

    service = new NotificationService(mockRepository, mockEmitter)
  })

  describe('create', () => {
    it('creates notification and emits event', async () => {
      vi.mocked(mockRepository.create).mockResolvedValue(mockNotification)

      const result = await service.create({
        userId: 'cluser123456789012345',
        type: 'like',
        title: 'Nova curtida',
        message: 'John curtiu sua história',
        data: { storyId: 'clstory12345678901234' },
      })

      expect(result).toEqual(mockNotification)
      expect(mockEmitter.emit).toHaveBeenCalledWith('cluser123456789012345', mockNotification)
    })

    it('validates input', async () => {
      await expect(
        service.create({
          userId: 'invalid',
          type: 'like',
          title: '',
          message: 'test',
        })
      ).rejects.toThrow()
    })
  })

  describe('getByUser', () => {
    it('returns notifications with meta', async () => {
      vi.mocked(mockRepository.findByUser).mockResolvedValue([mockNotification])

      const result = await service.getByUser('cluser123456789012345')

      expect(result).toHaveLength(1)
      expect(result[0]).toHaveProperty('timeAgo')
      expect(mockRepository.findByUser).toHaveBeenCalledWith('cluser123456789012345', 20, 0)
    })
  })

  describe('getUnreadByUser', () => {
    it('returns unread notifications', async () => {
      vi.mocked(mockRepository.findUnreadByUser).mockResolvedValue([mockNotification])

      const result = await service.getUnreadByUser('cluser123456789012345')

      expect(result).toHaveLength(1)
      expect(result[0].read).toBe(false)
    })
  })

  describe('markAsRead', () => {
    it('marks notification as read when authorized', async () => {
      vi.mocked(mockRepository.findById).mockResolvedValue(mockNotification)
      vi.mocked(mockRepository.markAsRead).mockResolvedValue({
        ...mockNotification,
        read: true,
      })

      const result = await service.markAsRead('clnoti12345678901234', 'cluser123456789012345')

      expect(result.read).toBe(true)
    })

    it('throws when notification not found', async () => {
      vi.mocked(mockRepository.findById).mockResolvedValue(null)

      await expect(
        service.markAsRead('nonexistent', 'cluser123456789012345')
      ).rejects.toThrow('Notification not found')
    })

    it('throws when user is not owner', async () => {
      vi.mocked(mockRepository.findById).mockResolvedValue(mockNotification)

      await expect(
        service.markAsRead('clnoti12345678901234', 'different-user')
      ).rejects.toThrow('Unauthorized')
    })
  })

  describe('markAllAsRead', () => {
    it('marks all notifications as read', async () => {
      vi.mocked(mockRepository.markAllAsRead).mockResolvedValue()

      await service.markAllAsRead('cluser123456789012345')

      expect(mockRepository.markAllAsRead).toHaveBeenCalledWith('cluser123456789012345')
    })
  })

  describe('delete', () => {
    it('deletes notification when authorized', async () => {
      vi.mocked(mockRepository.findById).mockResolvedValue(mockNotification)
      vi.mocked(mockRepository.delete).mockResolvedValue()

      await service.delete('clnoti12345678901234', 'cluser123456789012345')

      expect(mockRepository.delete).toHaveBeenCalledWith('clnoti12345678901234')
    })

    it('throws when user is not owner', async () => {
      vi.mocked(mockRepository.findById).mockResolvedValue(mockNotification)

      await expect(
        service.delete('clnoti12345678901234', 'different-user')
      ).rejects.toThrow('Unauthorized')
    })
  })

  describe('getUnreadCount', () => {
    it('returns count of unread notifications', async () => {
      vi.mocked(mockRepository.countUnread).mockResolvedValue(5)

      const result = await service.getUnreadCount('cluser123456789012345')

      expect(result).toBe(5)
    })
  })

  describe('notifyLike', () => {
    it('creates like notification', async () => {
      vi.mocked(mockRepository.create).mockResolvedValue(mockNotification)

      await service.notifyLike('clauthor1234567890123', 'John', 'clstory12345678901234')

      expect(mockRepository.create).toHaveBeenCalledWith({
        userId: 'clauthor1234567890123',
        type: 'like',
        title: 'Nova curtida',
        message: 'John curtiu sua história',
        data: { storyId: 'clstory12345678901234' },
      })
    })
  })

  describe('notifyComment', () => {
    it('creates comment notification', async () => {
      vi.mocked(mockRepository.create).mockResolvedValue(mockNotification)

      await service.notifyComment('clauthor1234567890123', 'Jane', 'clstory12345678901234')

      expect(mockRepository.create).toHaveBeenCalledWith({
        userId: 'clauthor1234567890123',
        type: 'comment',
        title: 'Novo comentário',
        message: 'Jane comentou na sua história',
        data: { storyId: 'clstory12345678901234' },
      })
    })
  })

  describe('notifyMention', () => {
    it('creates mention notification', async () => {
      vi.mocked(mockRepository.create).mockResolvedValue(mockNotification)

      await service.notifyMention('clmention123456789012', 'clcomm12345678901234', 'Bob')

      expect(mockRepository.create).toHaveBeenCalledWith({
        userId: 'clmention123456789012',
        type: 'mention',
        title: 'Você foi mencionado',
        message: 'Bob mencionou você em um comentário',
        data: { commentId: 'clcomm12345678901234' },
      })
    })
  })
})
