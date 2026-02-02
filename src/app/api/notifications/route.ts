import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/infrastructure/auth/config'
import { NotificationService } from '@/domains/notification/service'
import { PrismaNotificationRepository } from '@/infrastructure/database/notification.repository'

const notificationRepository = new PrismaNotificationRepository()
const notificationService = new NotificationService(notificationRepository)

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const unreadOnly = searchParams.get('unread') === 'true'
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0

    const [notifications, unreadCount] = await Promise.all([
      unreadOnly
        ? notificationService.getUnreadByUser(session.user.id)
        : notificationService.getByUser(session.user.id, limit, offset),
      notificationService.getUnreadCount(session.user.id),
    ])

    return NextResponse.json({
      success: true,
      data: {
        notifications,
        unreadCount,
      },
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
