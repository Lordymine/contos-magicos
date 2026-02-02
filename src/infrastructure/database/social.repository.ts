import { prisma } from './prisma'
import type { LikeRepository, CommentRepository, MentionRepository, UserLookupRepository } from '@/domains/social/repository'
import type { Like, Comment, CommentWithUser, LikeWithUser, Mention } from '@/domains/social/types'

export class PrismaLikeRepository implements LikeRepository {
  async findByUserAndStory(userId: string, storyId: string): Promise<Like | null> {
    const like = await prisma.like.findUnique({
      where: { userId_storyId: { userId, storyId } },
    })

    if (!like) return null

    return {
      id: like.id,
      userId: like.userId,
      storyId: like.storyId,
      createdAt: like.createdAt,
    }
  }

  async findByStory(storyId: string): Promise<LikeWithUser[]> {
    const likes = await prisma.like.findMany({
      where: { storyId },
      include: {
        user: { select: { id: true, name: true, image: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return likes.map(like => ({
      id: like.id,
      userId: like.userId,
      storyId: like.storyId,
      createdAt: like.createdAt,
      user: like.user,
    }))
  }

  async create(data: Omit<Like, 'id' | 'createdAt'>): Promise<Like> {
    const like = await prisma.like.create({
      data: {
        userId: data.userId,
        storyId: data.storyId,
      },
    })

    return {
      id: like.id,
      userId: like.userId,
      storyId: like.storyId,
      createdAt: like.createdAt,
    }
  }

  async delete(userId: string, storyId: string): Promise<void> {
    await prisma.like.delete({
      where: { userId_storyId: { userId, storyId } },
    })
  }

  async countByStory(storyId: string): Promise<number> {
    return prisma.like.count({ where: { storyId } })
  }
}

export class PrismaCommentRepository implements CommentRepository {
  async findById(id: string): Promise<Comment | null> {
    const comment = await prisma.comment.findUnique({
      where: { id },
    })

    if (!comment) return null

    return {
      id: comment.id,
      content: comment.content,
      userId: comment.userId,
      storyId: comment.storyId,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    }
  }

  async findByIdWithUser(id: string): Promise<CommentWithUser | null> {
    const comment = await prisma.comment.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, image: true } },
        mentions: {
          include: {
            mentionedUser: { select: { id: true, name: true } },
          },
        },
      },
    })

    if (!comment) return null

    return {
      id: comment.id,
      content: comment.content,
      userId: comment.userId,
      storyId: comment.storyId,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      user: comment.user,
      mentions: comment.mentions.map(m => ({
        id: m.id,
        mentionedUser: m.mentionedUser,
      })),
    }
  }

  async findByStory(storyId: string, limit = 20, offset = 0): Promise<CommentWithUser[]> {
    const comments = await prisma.comment.findMany({
      where: { storyId },
      include: {
        user: { select: { id: true, name: true, image: true } },
        mentions: {
          include: {
            mentionedUser: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    })

    return comments.map(comment => ({
      id: comment.id,
      content: comment.content,
      userId: comment.userId,
      storyId: comment.storyId,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      user: comment.user,
      mentions: comment.mentions.map(m => ({
        id: m.id,
        mentionedUser: m.mentionedUser,
      })),
    }))
  }

  async create(data: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Comment> {
    const comment = await prisma.comment.create({
      data: {
        content: data.content,
        userId: data.userId,
        storyId: data.storyId,
      },
    })

    return {
      id: comment.id,
      content: comment.content,
      userId: comment.userId,
      storyId: comment.storyId,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    }
  }

  async update(id: string, content: string): Promise<Comment> {
    const comment = await prisma.comment.update({
      where: { id },
      data: { content },
    })

    return {
      id: comment.id,
      content: comment.content,
      userId: comment.userId,
      storyId: comment.storyId,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    }
  }

  async delete(id: string): Promise<void> {
    await prisma.comment.delete({ where: { id } })
  }

  async countByStory(storyId: string): Promise<number> {
    return prisma.comment.count({ where: { storyId } })
  }
}

export class PrismaMentionRepository implements MentionRepository {
  async create(data: Omit<Mention, 'id' | 'createdAt'>): Promise<Mention> {
    const mention = await prisma.mention.create({
      data: {
        commentId: data.commentId,
        mentionedUserId: data.mentionedUserId,
      },
    })

    return {
      id: mention.id,
      commentId: mention.commentId,
      mentionedUserId: mention.mentionedUserId,
      createdAt: mention.createdAt,
    }
  }

  async createMany(data: Array<Omit<Mention, 'id' | 'createdAt'>>): Promise<void> {
    await prisma.mention.createMany({
      data: data.map(m => ({
        commentId: m.commentId,
        mentionedUserId: m.mentionedUserId,
      })),
      skipDuplicates: true,
    })
  }

  async deleteByComment(commentId: string): Promise<void> {
    await prisma.mention.deleteMany({ where: { commentId } })
  }

  async findByUser(userId: string, limit = 20, offset = 0): Promise<Mention[]> {
    const mentions = await prisma.mention.findMany({
      where: { mentionedUserId: userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    })

    return mentions.map(m => ({
      id: m.id,
      commentId: m.commentId,
      mentionedUserId: m.mentionedUserId,
      createdAt: m.createdAt,
    }))
  }
}

export class PrismaUserLookupRepository implements UserLookupRepository {
  async findByUsername(username: string): Promise<{ id: string } | null> {
    const user = await prisma.user.findFirst({
      where: { name: { equals: username, mode: 'insensitive' } },
      select: { id: true },
    })
    return user
  }

  async findByUsernames(usernames: string[]): Promise<Array<{ id: string; name: string }>> {
    const users = await prisma.user.findMany({
      where: {
        name: { in: usernames, mode: 'insensitive' },
      },
      select: { id: true, name: true },
    })
    return users.filter((u): u is { id: string; name: string } => u.name !== null)
  }
}
