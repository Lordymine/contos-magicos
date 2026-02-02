import type { Story, StoryFilters, StoryWithAuthor } from '../types'

export interface StoryRepository {
  findById(id: string): Promise<Story | null>
  findByIdWithAuthor(id: string): Promise<StoryWithAuthor | null>
  findAll(filters: StoryFilters): Promise<Story[]>
  findAllWithAuthor(filters: StoryFilters): Promise<StoryWithAuthor[]>
  create(data: Omit<Story, 'id' | 'createdAt' | 'updatedAt' | 'likesCount'>): Promise<Story>
  update(id: string, data: Partial<Pick<Story, 'title' | 'isPublic'>>): Promise<Story>
  delete(id: string): Promise<void>
  incrementLikes(id: string): Promise<void>
  decrementLikes(id: string): Promise<void>
  countByAuthor(authorId: string): Promise<number>
}
