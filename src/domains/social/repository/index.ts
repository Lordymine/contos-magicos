import type { Like, Comment, Mention, CommentWithUser, LikeWithUser } from '../types'

export interface LikeRepository {
  findByUserAndStory(userId: string, storyId: string): Promise<Like | null>
  findByStory(storyId: string): Promise<LikeWithUser[]>
  create(data: Omit<Like, 'id' | 'createdAt'>): Promise<Like>
  delete(userId: string, storyId: string): Promise<void>
  countByStory(storyId: string): Promise<number>
}

export interface CommentRepository {
  findById(id: string): Promise<Comment | null>
  findByIdWithUser(id: string): Promise<CommentWithUser | null>
  findByStory(storyId: string, limit?: number, offset?: number): Promise<CommentWithUser[]>
  create(data: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Comment>
  update(id: string, content: string): Promise<Comment>
  delete(id: string): Promise<void>
  countByStory(storyId: string): Promise<number>
}

export interface MentionRepository {
  create(data: Omit<Mention, 'id' | 'createdAt'>): Promise<Mention>
  createMany(data: Array<Omit<Mention, 'id' | 'createdAt'>>): Promise<void>
  deleteByComment(commentId: string): Promise<void>
  findByUser(userId: string, limit?: number, offset?: number): Promise<Mention[]>
}

export interface UserLookupRepository {
  findByUsername(username: string): Promise<{ id: string } | null>
  findByUsernames(usernames: string[]): Promise<Array<{ id: string; name: string }>>
}
