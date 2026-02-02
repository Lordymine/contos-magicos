import { prisma } from './prisma'
import type { StoryRepository } from '@/domains/story/repository'
import type { Story, StoryFilters, StoryWithAuthor } from '@/domains/story/types'

export class PrismaStoryRepository implements StoryRepository {
  async findById(id: string): Promise<Story | null> {
    const story = await prisma.story.findUnique({
      where: { id },
    })

    if (!story) return null

    return {
      id: story.id,
      title: story.title,
      content: story.content,
      theme: story.theme as Story['theme'],
      ageGroup: story.ageGroup as Story['ageGroup'],
      authorId: story.authorId,
      isPublic: story.isPublic,
      likesCount: story.likesCount,
      createdAt: story.createdAt,
      updatedAt: story.updatedAt,
    }
  }

  async findByIdWithAuthor(id: string): Promise<StoryWithAuthor | null> {
    const story = await prisma.story.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true, image: true },
        },
      },
    })

    if (!story) return null

    return {
      id: story.id,
      title: story.title,
      content: story.content,
      theme: story.theme as Story['theme'],
      ageGroup: story.ageGroup as Story['ageGroup'],
      authorId: story.authorId,
      isPublic: story.isPublic,
      likesCount: story.likesCount,
      createdAt: story.createdAt,
      updatedAt: story.updatedAt,
      author: story.author,
    }
  }

  async findAll(filters: StoryFilters): Promise<Story[]> {
    const stories = await prisma.story.findMany({
      where: {
        ...(filters.authorId && { authorId: filters.authorId }),
        ...(filters.theme && { theme: filters.theme }),
        ...(filters.ageGroup && { ageGroup: filters.ageGroup }),
        ...(filters.isPublic !== undefined && { isPublic: filters.isPublic }),
      },
      orderBy: { createdAt: 'desc' },
      take: filters.limit,
      skip: filters.offset,
    })

    return stories.map(story => ({
      id: story.id,
      title: story.title,
      content: story.content,
      theme: story.theme as Story['theme'],
      ageGroup: story.ageGroup as Story['ageGroup'],
      authorId: story.authorId,
      isPublic: story.isPublic,
      likesCount: story.likesCount,
      createdAt: story.createdAt,
      updatedAt: story.updatedAt,
    }))
  }

  async findAllWithAuthor(filters: StoryFilters): Promise<StoryWithAuthor[]> {
    const stories = await prisma.story.findMany({
      where: {
        ...(filters.authorId && { authorId: filters.authorId }),
        ...(filters.theme && { theme: filters.theme }),
        ...(filters.ageGroup && { ageGroup: filters.ageGroup }),
        ...(filters.isPublic !== undefined && { isPublic: filters.isPublic }),
      },
      include: {
        author: {
          select: { id: true, name: true, image: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: filters.limit,
      skip: filters.offset,
    })

    return stories.map(story => ({
      id: story.id,
      title: story.title,
      content: story.content,
      theme: story.theme as Story['theme'],
      ageGroup: story.ageGroup as Story['ageGroup'],
      authorId: story.authorId,
      isPublic: story.isPublic,
      likesCount: story.likesCount,
      createdAt: story.createdAt,
      updatedAt: story.updatedAt,
      author: story.author,
    }))
  }

  async create(
    data: Omit<Story, 'id' | 'createdAt' | 'updatedAt' | 'likesCount'>
  ): Promise<Story> {
    const story = await prisma.story.create({
      data: {
        title: data.title,
        content: data.content,
        theme: data.theme,
        ageGroup: data.ageGroup,
        authorId: data.authorId,
        isPublic: data.isPublic,
      },
    })

    return {
      id: story.id,
      title: story.title,
      content: story.content,
      theme: story.theme as Story['theme'],
      ageGroup: story.ageGroup as Story['ageGroup'],
      authorId: story.authorId,
      isPublic: story.isPublic,
      likesCount: story.likesCount,
      createdAt: story.createdAt,
      updatedAt: story.updatedAt,
    }
  }

  async update(
    id: string,
    data: Partial<Pick<Story, 'title' | 'isPublic'>>
  ): Promise<Story> {
    const story = await prisma.story.update({
      where: { id },
      data,
    })

    return {
      id: story.id,
      title: story.title,
      content: story.content,
      theme: story.theme as Story['theme'],
      ageGroup: story.ageGroup as Story['ageGroup'],
      authorId: story.authorId,
      isPublic: story.isPublic,
      likesCount: story.likesCount,
      createdAt: story.createdAt,
      updatedAt: story.updatedAt,
    }
  }

  async delete(id: string): Promise<void> {
    await prisma.story.delete({ where: { id } })
  }

  async incrementLikes(id: string): Promise<void> {
    await prisma.story.update({
      where: { id },
      data: { likesCount: { increment: 1 } },
    })
  }

  async decrementLikes(id: string): Promise<void> {
    await prisma.story.update({
      where: { id },
      data: { likesCount: { decrement: 1 } },
    })
  }

  async countByAuthor(authorId: string): Promise<number> {
    return prisma.story.count({ where: { authorId } })
  }
}
