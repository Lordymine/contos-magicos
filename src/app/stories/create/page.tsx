import { redirect } from 'next/navigation'
import { auth } from '@/infrastructure/auth/config'
import { StoryForm } from '@/features/stories/components/StoryForm'

export default async function CreateStoryPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/auth/login?callbackUrl=/stories/create')
  }

  return <StoryForm />
}
