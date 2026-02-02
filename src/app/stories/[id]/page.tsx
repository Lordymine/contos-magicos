import { notFound } from 'next/navigation'
import { auth } from '@/infrastructure/auth/config'
import { StoryView } from '@/features/stories/components/StoryView'
import { PrismaStoryRepository } from '@/infrastructure/database/story.repository'

interface StoryPageProps {
  params: Promise<{ id: string }>
}

export default async function StoryPage({ params }: StoryPageProps) {
  const { id } = await params
  const session = await auth()

  const repository = new PrismaStoryRepository()
  const story = await repository.findByIdWithAuthor(id)

  if (!story) {
    notFound()
  }

  if (!story.isPublic && story.authorId !== session?.user?.id) {
    notFound()
  }

  return (
    <div className="max-w-6xl mx-auto px-6">
      <StoryView story={story} isAuthenticated={!!session?.user} />
    </div>
  )
}
