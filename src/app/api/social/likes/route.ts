import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/infrastructure/auth/config'
import { LikeService } from '@/domains/social/service'
import { PrismaLikeRepository } from '@/infrastructure/database/social.repository'
import { PrismaStoryRepository } from '@/infrastructure/database/story.repository'
import { NotificationService } from '@/domains/notification/service'
import { PrismaNotificationRepository } from '@/infrastructure/database/notification.repository'

const likeRepository = new PrismaLikeRepository()
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

const likeService = new LikeService(likeRepository, storyUpdater, notificationService)

const LikeInputSchema = z.object({
  storyId: z.string().cuid(),
})

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
    const input = LikeInputSchema.parse(body)

    const like = await likeService.like(
      session.user.id,
      input.storyId,
      session.user.name || 'Usuário'
    )

    return NextResponse.json({ success: true, data: like }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }
    if (error instanceof Error && error.message === 'Already liked') {
      return NextResponse.json(
        { success: false, error: 'Already liked' },
        { status: 409 }
      )
    }
    console.error('Error liking story:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const storyId = searchParams.get('storyId')

    if (!storyId) {
      return NextResponse.json(
        { success: false, error: 'storyId is required' },
        { status: 400 }
      )
    }

    await likeService.unlike(session.user.id, storyId)

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Error && error.message === 'Not liked') {
      return NextResponse.json(
        { success: false, error: 'Not liked' },
        { status: 404 }
      )
    }
    console.error('Error unliking story:', error)
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

    if (!storyId) {
      return NextResponse.json(
        { success: false, error: 'storyId is required' },
        { status: 400 }
      )
    }

    const session = await auth()
    const [likes, isLiked] = await Promise.all([
      likeService.getLikesByStory(storyId),
      session?.user?.id ? likeService.isLiked(session.user.id, storyId) : false,
    ])

    return NextResponse.json({
      success: true,
      data: {
        likes,
        count: likes.length,
        isLiked,
      },
    })
  } catch (error) {
    console.error('Error fetching likes:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
