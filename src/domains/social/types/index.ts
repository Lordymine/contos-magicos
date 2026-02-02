import { z } from 'zod'

export const LikeSchema = z.object({
  id: z.string().cuid(),
  userId: z.string().cuid(),
  storyId: z.string().cuid(),
  createdAt: z.date(),
})

export type Like = z.infer<typeof LikeSchema>

export const CommentSchema = z.object({
  id: z.string().cuid(),
  content: z.string().min(1).max(1000),
  userId: z.string().cuid(),
  storyId: z.string().cuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Comment = z.infer<typeof CommentSchema>

export const MentionSchema = z.object({
  id: z.string().cuid(),
  commentId: z.string().cuid(),
  mentionedUserId: z.string().cuid(),
  createdAt: z.date(),
})

export type Mention = z.infer<typeof MentionSchema>

export const CreateCommentInputSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty').max(1000, 'Comment is too long'),
  storyId: z.string().cuid(),
})

export type CreateCommentInput = z.infer<typeof CreateCommentInputSchema>

export const UpdateCommentInputSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty').max(1000, 'Comment is too long'),
})

export type UpdateCommentInput = z.infer<typeof UpdateCommentInputSchema>

export interface CommentWithUser extends Comment {
  user: {
    id: string
    name: string | null
    image: string | null
  }
  mentions: Array<{
    id: string
    mentionedUser: {
      id: string
      name: string | null
    }
  }>
}

export interface LikeWithUser extends Like {
  user: {
    id: string
    name: string | null
    image: string | null
  }
}

export const MENTION_REGEX = /@(\w+)/g

export function extractMentions(content: string): string[] {
  const matches = content.match(MENTION_REGEX)
  if (!matches) return []
  return [...new Set(matches.map(m => m.slice(1)))]
}
