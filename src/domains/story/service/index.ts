import type {
  Story,
  CreateStoryInput,
  UpdateStoryInput,
  GenerateStoryInput,
  StoryFilters,
  StoryWithAuthor,
} from '../types'
import { CreateStoryInputSchema, UpdateStoryInputSchema, StoryFiltersSchema } from '../types'
import type { StoryRepository } from '../repository'

export interface StoryGenerator {
  generate(input: GenerateStoryInput): Promise<{ title: string; content: string }>
}

export class StoryService {
  constructor(
    private readonly repository: StoryRepository,
    private readonly generator: StoryGenerator
  ) {}

  async getById(id: string): Promise<Story | null> {
    return this.repository.findById(id)
  }

  async getByIdWithAuthor(id: string): Promise<StoryWithAuthor | null> {
    return this.repository.findByIdWithAuthor(id)
  }

  async getAll(filters: StoryFilters): Promise<Story[]> {
    const validatedFilters = StoryFiltersSchema.parse(filters)
    return this.repository.findAll(validatedFilters)
  }

  async getAllWithAuthor(filters: StoryFilters): Promise<StoryWithAuthor[]> {
    const validatedFilters = StoryFiltersSchema.parse(filters)
    return this.repository.findAllWithAuthor(validatedFilters)
  }

  async create(input: CreateStoryInput, authorId: string): Promise<Story> {
    const validated = CreateStoryInputSchema.parse(input)

    const generated = await this.generator.generate({
      theme: validated.theme,
      ageGroup: validated.ageGroup,
      prompt: validated.prompt,
    })

    return this.repository.create({
      title: validated.title || generated.title,
      content: generated.content,
      theme: validated.theme,
      ageGroup: validated.ageGroup,
      authorId,
      isPublic: validated.isPublic ?? false,
    })
  }

  async update(id: string, input: UpdateStoryInput, authorId: string): Promise<Story> {
    const validated = UpdateStoryInputSchema.parse(input)

    const story = await this.repository.findById(id)
    if (!story) {
      throw new Error('Story not found')
    }

    if (story.authorId !== authorId) {
      throw new Error('Unauthorized')
    }

    return this.repository.update(id, validated)
  }

  async delete(id: string, authorId: string): Promise<void> {
    const story = await this.repository.findById(id)
    if (!story) {
      throw new Error('Story not found')
    }

    if (story.authorId !== authorId) {
      throw new Error('Unauthorized')
    }

    await this.repository.delete(id)
  }

  async getPublicStories(filters: Omit<StoryFilters, 'isPublic'>): Promise<StoryWithAuthor[]> {
    return this.repository.findAllWithAuthor({ ...filters, isPublic: true })
  }

  async getUserStories(authorId: string, filters: Omit<StoryFilters, 'authorId'>): Promise<Story[]> {
    return this.repository.findAll({ ...filters, authorId })
  }
}
