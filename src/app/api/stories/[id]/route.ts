import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/infrastructure/auth/config'
import { StoryService } from '@/domains/story/service'
import { PrismaStoryRepository } from '@/infrastructure/database/story.repository'
import { OpenRouterStoryGenerator } from '@/infrastructure/openrouter/client'
import { UpdateStoryInputSchema } from '@/domains/story/types'

const storyRepository = new PrismaStoryRepository()

function getStoryService() {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY not configured')
  }
  const generator = new OpenRouterStoryGenerator(apiKey)
  return new StoryService(storyRepository, generator)
}

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params
    const service = getStoryService()
    const story = await service.getByIdWithAuthor(id)

    if (!story) {
      return NextResponse.json(
        { success: false, error: 'Story not found' },
        { status: 404 }
      )
    }

    const session = await auth()
    if (!story.isPublic && story.authorId !== session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Story not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: story })
  } catch (error) {
    console.error('Error fetching story:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
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
    const input = UpdateStoryInputSchema.parse(body)

    const service = getStoryService()
    const story = await service.update(id, input, session.user.id)

    return NextResponse.json({ success: true, data: story })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }
    if (error instanceof Error) {
      if (error.message === 'Story not found') {
        return NextResponse.json(
          { success: false, error: 'Story not found' },
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
    console.error('Error updating story:', error)
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
    const service = getStoryService()
    await service.delete(id, session.user.id)

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Story not found') {
        return NextResponse.json(
          { success: false, error: 'Story not found' },
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
    console.error('Error deleting story:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
