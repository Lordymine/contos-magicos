import { z } from 'zod'

export const StoryTheme = z.enum([
  'adventure',
  'fantasy',
  'animals',
  'friendship',
  'nature',
  'space',
  'fairytale',
  'mystery',
])

export type StoryTheme = z.infer<typeof StoryTheme>

export const AgeGroup = z.enum(['3-5', '6-8', '9-12'])

export type AgeGroup = z.infer<typeof AgeGroup>

export const StorySchema = z.object({
  id: z.string().cuid(),
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  theme: StoryTheme,
  ageGroup: AgeGroup,
  authorId: z.string().cuid(),
  isPublic: z.boolean().default(false),
  likesCount: z.number().int().min(0).default(0),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Story = z.infer<typeof StorySchema>

export const CreateStoryInputSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  theme: StoryTheme,
  ageGroup: AgeGroup,
  prompt: z.string().min(10, 'Prompt must be at least 10 characters').max(500),
  isPublic: z.boolean().optional().default(false),
})

export type CreateStoryInput = z.infer<typeof CreateStoryInputSchema>

export const UpdateStoryInputSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  isPublic: z.boolean().optional(),
})

export type UpdateStoryInput = z.infer<typeof UpdateStoryInputSchema>

export const GenerateStoryInputSchema = z.object({
  theme: StoryTheme,
  ageGroup: AgeGroup,
  prompt: z.string().min(10).max(500),
  characterName: z.string().min(1).max(50).optional(),
})

export type GenerateStoryInput = z.infer<typeof GenerateStoryInputSchema>

export const StoryFiltersSchema = z.object({
  authorId: z.string().cuid().optional(),
  theme: StoryTheme.optional(),
  ageGroup: AgeGroup.optional(),
  isPublic: z.boolean().optional(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
})

export type StoryFilters = z.infer<typeof StoryFiltersSchema>

export interface StoryWithAuthor extends Story {
  author: {
    id: string
    name: string | null
    image: string | null
  }
}
