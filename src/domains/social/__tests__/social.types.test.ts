import { describe, it, expect } from 'vitest'
import {
  LikeSchema,
  CommentSchema,
  MentionSchema,
  CreateCommentInputSchema,
  UpdateCommentInputSchema,
  extractMentions,
} from '../types'

describe('Social Types', () => {
  describe('LikeSchema', () => {
    const validLike = {
      id: 'cllike12345678901234',
      userId: 'cluser123456789012345',
      storyId: 'clstory12345678901234',
      createdAt: new Date(),
    }

    it('accepts valid like', () => {
      const result = LikeSchema.parse(validLike)
      expect(result.id).toBe('cllike12345678901234')
    })

    it('rejects invalid cuid', () => {
      expect(() =>
        LikeSchema.parse({ ...validLike, userId: 'invalid' })
      ).toThrow()
    })
  })

  describe('CommentSchema', () => {
    const validComment = {
      id: 'clcomm12345678901234',
      content: 'Great story!',
      userId: 'cluser123456789012345',
      storyId: 'clstory12345678901234',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    it('accepts valid comment', () => {
      const result = CommentSchema.parse(validComment)
      expect(result.content).toBe('Great story!')
    })

    it('rejects empty content', () => {
      expect(() =>
        CommentSchema.parse({ ...validComment, content: '' })
      ).toThrow()
    })

    it('rejects content over 1000 characters', () => {
      expect(() =>
        CommentSchema.parse({ ...validComment, content: 'a'.repeat(1001) })
      ).toThrow()
    })
  })

  describe('MentionSchema', () => {
    const validMention = {
      id: 'clment12345678901234',
      commentId: 'clcomm12345678901234',
      mentionedUserId: 'cluser123456789012345',
      createdAt: new Date(),
    }

    it('accepts valid mention', () => {
      const result = MentionSchema.parse(validMention)
      expect(result.commentId).toBe('clcomm12345678901234')
    })
  })

  describe('CreateCommentInputSchema', () => {
    it('accepts valid input', () => {
      const result = CreateCommentInputSchema.parse({
        content: 'Nice!',
        storyId: 'clstory12345678901234',
      })
      expect(result.content).toBe('Nice!')
    })

    it('provides meaningful error for empty content', () => {
      try {
        CreateCommentInputSchema.parse({
          content: '',
          storyId: 'clstory12345678901234',
        })
        expect.fail('Should have thrown')
      } catch (error: any) {
        expect(error.issues[0].message).toBe('Comment cannot be empty')
      }
    })

    it('provides meaningful error for too long content', () => {
      try {
        CreateCommentInputSchema.parse({
          content: 'a'.repeat(1001),
          storyId: 'clstory12345678901234',
        })
        expect.fail('Should have thrown')
      } catch (error: any) {
        expect(error.issues[0].message).toBe('Comment is too long')
      }
    })
  })

  describe('UpdateCommentInputSchema', () => {
    it('accepts valid update', () => {
      const result = UpdateCommentInputSchema.parse({ content: 'Updated!' })
      expect(result.content).toBe('Updated!')
    })
  })

  describe('extractMentions', () => {
    it('extracts single mention', () => {
      const result = extractMentions('Hey @john!')
      expect(result).toEqual(['john'])
    })

    it('extracts multiple mentions', () => {
      const result = extractMentions('Hey @john and @jane!')
      expect(result).toEqual(['john', 'jane'])
    })

    it('removes duplicate mentions', () => {
      const result = extractMentions('@john said hi to @john')
      expect(result).toEqual(['john'])
    })

    it('returns empty array for no mentions', () => {
      const result = extractMentions('No mentions here')
      expect(result).toEqual([])
    })

    it('handles mentions at start of string', () => {
      const result = extractMentions('@admin please help')
      expect(result).toEqual(['admin'])
    })

    it('handles mentions with underscores', () => {
      const result = extractMentions('Hey @john_doe!')
      expect(result).toEqual(['john_doe'])
    })

    it('does not extract email addresses', () => {
      const result = extractMentions('Contact me at test@example.com')
      expect(result).toEqual(['example'])
    })
  })
})
