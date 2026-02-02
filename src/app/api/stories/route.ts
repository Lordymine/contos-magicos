import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/infrastructure/auth/config'
import { StoryService, type StoryGenerator } from '@/domains/story/service'
import { PrismaStoryRepository } from '@/infrastructure/database/story.repository'
import { OpenRouterStoryGenerator } from '@/infrastructure/openrouter/client'
import { CreateStoryInputSchema, StoryFiltersSchema, type GenerateStoryInput } from '@/domains/story/types'

const storyRepository = new PrismaStoryRepository()

class NullStoryGenerator implements StoryGenerator {
  async generate(input: GenerateStoryInput): Promise<{ title: string; content: string }> {
    throw new Error('OPENROUTER_API_KEY not configured')
  }
}

function getStoryService() {
  const apiKey = process.env.OPENROUTER_API_KEY
  const generator = apiKey 
    ? new OpenRouterStoryGenerator(apiKey)
    : new NullStoryGenerator()
  return new StoryService(storyRepository, generator)
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const filters = StoryFiltersSchema.parse({
      theme: searchParams.get('theme') || undefined,
      ageGroup: searchParams.get('ageGroup') || undefined,
      isPublic: searchParams.get('isPublic') === 'true' ? true : searchParams.get('isPublic') === 'false' ? false : undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined,
    })

    const service = getStoryService()
    const stories = await service.getAllWithAuthor({ ...filters, isPublic: true })

    return NextResponse.json({ success: true, data: stories })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid parameters', details: error.issues },
        { status: 400 }
      )
    }
    console.error('Error fetching stories:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

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
    const input = CreateStoryInputSchema.parse(body)

    const service = getStoryService()
    const story = await service.create(input, session.user.id)

    return NextResponse.json({ success: true, data: story }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }
    if (error instanceof Error && error.message.includes('Rate limit')) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 429 }
      )
    }
    console.error('Error creating story:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
