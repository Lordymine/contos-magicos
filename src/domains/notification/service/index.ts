import type { Notification, CreateNotificationInput, NotificationWithMeta } from '../types'
import { CreateNotificationInputSchema } from '../types'
import type { NotificationRepository } from '../repository'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export interface NotificationEmitter {
  emit(userId: string, notification: Notification): void
}

export class NotificationService {
  constructor(
    private readonly repository: NotificationRepository,
    private readonly emitter?: NotificationEmitter
  ) {}

  async create(input: CreateNotificationInput): Promise<Notification> {
    const validated = CreateNotificationInputSchema.parse(input)

    const notification = await this.repository.create(validated)

    if (this.emitter) {
      this.emitter.emit(validated.userId, notification)
    }

    return notification
  }

  async getByUser(userId: string, limit = 20, offset = 0): Promise<NotificationWithMeta[]> {
    const notifications = await this.repository.findByUser(userId, limit, offset)
    return notifications.map(this.addMeta)
  }

  async getUnreadByUser(userId: string): Promise<NotificationWithMeta[]> {
    const notifications = await this.repository.findUnreadByUser(userId)
    return notifications.map(this.addMeta)
  }

  async markAsRead(id: string, userId: string): Promise<Notification> {
    const notification = await this.repository.findById(id)
    if (!notification) {
      throw new Error('Notification not found')
    }

    if (notification.userId !== userId) {
      throw new Error('Unauthorized')
    }

    return this.repository.markAsRead(id)
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.repository.markAllAsRead(userId)
  }

  async delete(id: string, userId: string): Promise<void> {
    const notification = await this.repository.findById(id)
    if (!notification) {
      throw new Error('Notification not found')
    }

    if (notification.userId !== userId) {
      throw new Error('Unauthorized')
    }

    await this.repository.delete(id)
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.repository.countUnread(userId)
  }

  async notifyLike(storyAuthorId: string, likerName: string, storyId: string): Promise<void> {
    await this.create({
      userId: storyAuthorId,
      type: 'like',
      title: 'Nova curtida',
      message: `${likerName} curtiu sua história`,
      data: { storyId },
    })
  }

  async notifyComment(storyAuthorId: string, commenterName: string, storyId: string): Promise<void> {
    await this.create({
      userId: storyAuthorId,
      type: 'comment',
      title: 'Novo comentário',
      message: `${commenterName} comentou na sua história`,
      data: { storyId },
    })
  }

  async notifyMention(mentionedUserId: string, commentId: string, mentionerName: string): Promise<void> {
    await this.create({
      userId: mentionedUserId,
      type: 'mention',
      title: 'Você foi mencionado',
      message: `${mentionerName} mencionou você em um comentário`,
      data: { commentId },
    })
  }

  private addMeta(notification: Notification): NotificationWithMeta {
    return {
      ...notification,
      timeAgo: formatDistanceToNow(notification.createdAt, {
        addSuffix: true,
        locale: ptBR,
      }),
    }
  }
}
