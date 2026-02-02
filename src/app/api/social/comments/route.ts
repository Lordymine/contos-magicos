import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/infrastructure/auth/config'
import { CommentService } from '@/domains/social/service'
import {
  PrismaCommentRepository,
  PrismaMentionRepository,
  PrismaUserLookupRepository,
} from '@/infrastructure/database/social.repository'
import { PrismaStoryRepository } from '@/infrastructure/database/story.repository'
import { NotificationService } from '@/domains/notification/service'
import { PrismaNotificationRepository } from '@/infrastructure/database/notification.repository'
import { CreateCommentInputSchema } from '@/domains/social/types'

const commentRepository = new PrismaCommentRepository()
const mentionRepository = new PrismaMentionRepository()
const userLookupRepository = new PrismaUserLookupRepository()
const storyRepository = new PrismaStoryRepository()
const notificationRepository = new PrismaNotificationRepository()
const notificationService = new NotificationService(notificationRepository)

const storyUpdater = {
  incrementLikes: (storyId: string) => storyRepository.incrementLikes(storyId),
  decrementLikes: (storyId: string) => storyRepository.decrementLikes(storyId),
  getAuthorId: async (storyId: string) => {
    const story = await storyRepository.findById(storyId)
    return story?.authorId ?? null
  },
}

const commentService = new CommentService(
  commentRepository,
  mentionRepository,
  userLookupRepository,
  storyUpdater,
  notificationService
)

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const input = CreateCommentInputSchema.parse(body)

    const comment = await commentService.create(
      input,
      session.user.id,
      session.user.name || 'Usuário'
    )

    return NextResponse.json({ success: true, data: comment }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const storyId = searchParams.get('storyId')
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0

    if (!storyId) {
      return NextResponse.json(
        { success: false, error: 'storyId is required' },
        { status: 400 }
      )
    }

    const comments = await commentService.getByStory(storyId, limit, offset)

    return NextResponse.json({ success: true, data: comments })
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
