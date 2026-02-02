import { NextResponse } from 'next/server'
import { auth } from '@/infrastructure/auth/config'
import { NotificationService } from '@/domains/notification/service'
import { PrismaNotificationRepository } from '@/infrastructure/database/notification.repository'

const notificationRepository = new PrismaNotificationRepository()
const notificationService = new NotificationService(notificationRepository)

export async function POST() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await notificationService.markAllAsRead(session.user.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error marking all notifications as read:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
