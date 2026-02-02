import type { Like, Comment, CommentWithUser, LikeWithUser } from '../types'
import { CreateCommentInputSchema, UpdateCommentInputSchema, extractMentions } from '../types'
import type { LikeRepository, CommentRepository, MentionRepository, UserLookupRepository } from '../repository'

export interface NotificationService {
  notifyMention(mentionedUserId: string, commentId: string, mentionerName: string): Promise<void>
  notifyLike(storyAuthorId: string, likerName: string, storyId: string): Promise<void>
  notifyComment(storyAuthorId: string, commenterName: string, storyId: string): Promise<void>
}

export interface StoryLikesUpdater {
  incrementLikes(storyId: string): Promise<void>
  decrementLikes(storyId: string): Promise<void>
  getAuthorId(storyId: string): Promise<string | null>
}

export class LikeService {
  constructor(
    private readonly likeRepo: LikeRepository,
    private readonly storyUpdater: StoryLikesUpdater,
    private readonly notifications?: NotificationService
  ) {}

  async like(userId: string, storyId: string, userName: string): Promise<Like> {
    const existing = await this.likeRepo.findByUserAndStory(userId, storyId)
    if (existing) {
      throw new Error('Already liked')
    }

    const like = await this.likeRepo.create({ userId, storyId })
    await this.storyUpdater.incrementLikes(storyId)

    if (this.notifications) {
      const authorId = await this.storyUpdater.getAuthorId(storyId)
      if (authorId && authorId !== userId) {
        await this.notifications.notifyLike(authorId, userName, storyId)
      }
    }

    return like
  }

  async unlike(userId: string, storyId: string): Promise<void> {
    const existing = await this.likeRepo.findByUserAndStory(userId, storyId)
    if (!existing) {
      throw new Error('Not liked')
    }

    await this.likeRepo.delete(userId, storyId)
    await this.storyUpdater.decrementLikes(storyId)
  }

  async isLiked(userId: string, storyId: string): Promise<boolean> {
    const like = await this.likeRepo.findByUserAndStory(userId, storyId)
    return like !== null
  }

  async getLikesByStory(storyId: string): Promise<LikeWithUser[]> {
    return this.likeRepo.findByStory(storyId)
  }

  async getLikesCount(storyId: string): Promise<number> {
    return this.likeRepo.countByStory(storyId)
  }
}

export class CommentService {
  constructor(
    private readonly commentRepo: CommentRepository,
    private readonly mentionRepo: MentionRepository,
    private readonly userLookup: UserLookupRepository,
    private readonly storyUpdater: StoryLikesUpdater,
    private readonly notifications?: NotificationService
  ) {}

  async create(
    input: { content: string; storyId: string },
    userId: string,
    userName: string
  ): Promise<Comment> {
    const validated = CreateCommentInputSchema.parse(input)

    const comment = await this.commentRepo.create({
      content: validated.content,
      storyId: validated.storyId,
      userId,
    })

    const mentionUsernames = extractMentions(validated.content)
    if (mentionUsernames.length > 0) {
      const users = await this.userLookup.findByUsernames(mentionUsernames)
      if (users.length > 0) {
        await this.mentionRepo.createMany(
          users.map(user => ({
            commentId: comment.id,
            mentionedUserId: user.id,
          }))
        )

        if (this.notifications) {
          for (const user of users) {
            if (user.id !== userId) {
              await this.notifications.notifyMention(user.id, comment.id, userName)
            }
          }
        }
      }
    }

    if (this.notifications) {
      const authorId = await this.storyUpdater.getAuthorId(validated.storyId)
      if (authorId && authorId !== userId) {
        await this.notifications.notifyComment(authorId, userName, validated.storyId)
      }
    }

    return comment
  }

  async update(id: string, input: { content: string }, userId: string): Promise<Comment> {
    const validated = UpdateCommentInputSchema.parse(input)

    const comment = await this.commentRepo.findById(id)
    if (!comment) {
      throw new Error('Comment not found')
    }

    if (comment.userId !== userId) {
      throw new Error('Unauthorized')
    }

    await this.mentionRepo.deleteByComment(id)

    const updated = await this.commentRepo.update(id, validated.content)

    const mentionUsernames = extractMentions(validated.content)
    if (mentionUsernames.length > 0) {
      const users = await this.userLookup.findByUsernames(mentionUsernames)
      if (users.length > 0) {
        await this.mentionRepo.createMany(
          users.map(user => ({
            commentId: id,
            mentionedUserId: user.id,
          }))
        )
      }
    }

    return updated
  }

  async delete(id: string, userId: string): Promise<void> {
    const comment = await this.commentRepo.findById(id)
    if (!comment) {
      throw new Error('Comment not found')
    }

    if (comment.userId !== userId) {
      throw new Error('Unauthorized')
    }

    await this.mentionRepo.deleteByComment(id)
    await this.commentRepo.delete(id)
  }

  async getByStory(storyId: string, limit = 20, offset = 0): Promise<CommentWithUser[]> {
    return this.commentRepo.findByStory(storyId, limit, offset)
  }

  async getById(id: string): Promise<CommentWithUser | null> {
    return this.commentRepo.findByIdWithUser(id)
  }
}
