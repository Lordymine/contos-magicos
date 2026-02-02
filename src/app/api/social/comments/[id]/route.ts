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
import { UpdateCommentInputSchema } from '@/domains/social/types'

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

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await context.params
    const body = await request.json()
    const input = UpdateCommentInputSchema.parse(body)

    const comment = await commentService.update(id, input, session.user.id)

    return NextResponse.json({ success: true, data: comment })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }
    if (error instanceof Error) {
      if (error.message === 'Comment not found') {
        return NextResponse.json(
          { success: false, error: 'Comment not found' },
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
    console.error('Error updating comment:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await context.params
    await commentService.delete(id, session.user.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Comment not found') {
        return NextResponse.json(
          { success: false, error: 'Comment not found' },
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
    console.error('Error deleting comment:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params
    const comment = await commentService.getById(id)

    if (!comment) {
      return NextResponse.json(
        { success: false, error: 'Comment not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: comment })
  } catch (error) {
    console.error('Error fetching comment:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
