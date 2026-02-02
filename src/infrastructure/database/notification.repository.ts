import { prisma } from './prisma'
import type { NotificationRepository } from '@/domains/notification/repository'
import type { Notification, CreateNotificationInput } from '@/domains/notification/types'

export class PrismaNotificationRepository implements NotificationRepository {
  async findById(id: string): Promise<Notification | null> {
    const notification = await prisma.notification.findUnique({
      where: { id },
    })

    if (!notification) return null

    return {
      id: notification.id,
      userId: notification.userId,
      type: notification.type as Notification['type'],
      title: notification.title,
      message: notification.message,
      data: notification.data as Record<string, unknown> | null,
      read: notification.read,
      createdAt: notification.createdAt,
    }
  }

  async findByUser(userId: string, limit = 20, offset = 0): Promise<Notification[]> {
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    })

    return notifications.map(n => ({
      id: n.id,
      userId: n.userId,
      type: n.type as Notification['type'],
      title: n.title,
      message: n.message,
      data: n.data as Record<string, unknown> | null,
      read: n.read,
      createdAt: n.createdAt,
    }))
  }

  async findUnreadByUser(userId: string): Promise<Notification[]> {
    const notifications = await prisma.notification.findMany({
      where: { userId, read: false },
      orderBy: { createdAt: 'desc' },
    })

    return notifications.map(n => ({
      id: n.id,
      userId: n.userId,
      type: n.type as Notification['type'],
      title: n.title,
      message: n.message,
      data: n.data as Record<string, unknown> | null,
      read: n.read,
      createdAt: n.createdAt,
    }))
  }

  async create(data: CreateNotificationInput): Promise<Notification> {
    const notification = await prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        title: data.title,
        message: data.message,
        data: data.data,
      },
    })

    return {
      id: notification.id,
      userId: notification.userId,
      type: notification.type as Notification['type'],
      title: notification.title,
      message: notification.message,
      data: notification.data as Record<string, unknown> | null,
      read: notification.read,
      createdAt: notification.createdAt,
    }
  }

  async markAsRead(id: string): Promise<Notification> {
    const notification = await prisma.notification.update({
      where: { id },
      data: { read: true },
    })

    return {
      id: notification.id,
      userId: notification.userId,
      type: notification.type as Notification['type'],
      title: notification.title,
      message: notification.message,
      data: notification.data as Record<string, unknown> | null,
      read: notification.read,
      createdAt: notification.createdAt,
    }
  }

  async markAllAsRead(userId: string): Promise<void> {
    await prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    })
  }

  async delete(id: string): Promise<void> {
    await prisma.notification.delete({ where: { id } })
  }

  async countUnread(userId: string): Promise<number> {
    return prisma.notification.count({
      where: { userId, read: false },
    })
  }
}
