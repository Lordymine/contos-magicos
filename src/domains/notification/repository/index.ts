import type { Notification, CreateNotificationInput } from '../types'

export interface NotificationRepository {
  findById(id: string): Promise<Notification | null>
  findByUser(userId: string, limit?: number, offset?: number): Promise<Notification[]>
  findUnreadByUser(userId: string): Promise<Notification[]>
  create(data: CreateNotificationInput): Promise<Notification>
  markAsRead(id: string): Promise<Notification>
  markAllAsRead(userId: string): Promise<void>
  delete(id: string): Promise<void>
  countUnread(userId: string): Promise<number>
}
