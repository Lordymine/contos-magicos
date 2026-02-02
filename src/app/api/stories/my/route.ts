import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/infrastructure/auth/config'
import { StoryService } from '@/domains/story/service'
import { PrismaStoryRepository } from '@/infrastructure/database/story.repository'
import { OpenRouterStoryGenerator } from '@/infrastructure/openrouter/client'
import { StoryFiltersSchema } from '@/domains/story/types'

const storyRepository = new PrismaStoryRepository()

function getStoryService() {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY not configured')
  }
  const generator = new OpenRouterStoryGenerator(apiKey)
  return new StoryService(storyRepository, generator)
}

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
    const filters = StoryFiltersSchema.parse({
      theme: searchParams.get('theme') || undefined,
      ageGroup: searchParams.get('ageGroup') || undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined,
    })

    const service = getStoryService()
    const stories = await service.getUserStories(session.user.id, filters)

    return NextResponse.json({ success: true, data: stories })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid parameters', details: error.issues },
        { status: 400 }
      )
    }
    console.error('Error fetching user stories:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
