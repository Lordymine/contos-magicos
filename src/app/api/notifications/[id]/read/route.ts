import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/infrastructure/auth/config'
import { NotificationService } from '@/domains/notification/service'
import { PrismaNotificationRepository } from '@/infrastructure/database/notification.repository'

const notificationRepository = new PrismaNotificationRepository()
const notificationService = new NotificationService(notificationRepository)

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await context.params
    const notification = await notificationService.markAsRead(id, session.user.id)

    return NextResponse.json({ success: true, data: notification })
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Notification not found') {
        return NextResponse.json(
          { success: false, error: 'Notification not found' },
          { status: 404 }
        )
      }
      if (error.message === 'Unauthorized') {
        return NextResponse.json(
          { success: false, error: 'Unauthorized' },
          { status: 403 }
        )
      }
    }
    console.error('Error marking notification as read:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
