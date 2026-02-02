import { z } from 'zod'

export const NotificationType = z.enum([
  'like',
  'comment',
  'mention',
])

export type NotificationType = z.infer<typeof NotificationType>

export const NotificationSchema = z.object({
  id: z.string().cuid(),
  userId: z.string().cuid(),
  type: NotificationType,
  title: z.string().min(1).max(200),
  message: z.string().min(1).max(500),
  data: z.record(z.string(), z.any()).nullable(),
  read: z.boolean().default(false),
  createdAt: z.date(),
})

export type Notification = z.infer<typeof NotificationSchema>

export const CreateNotificationInputSchema = z.object({
  userId: z.string().cuid(),
  type: NotificationType,
  title: z.string().min(1).max(200),
  message: z.string().min(1).max(500),
  data: z.record(z.string(), z.any()).optional(),
})

export type CreateNotificationInput = z.infer<typeof CreateNotificationInputSchema>

export interface NotificationWithMeta extends Notification {
  timeAgo: string
}
