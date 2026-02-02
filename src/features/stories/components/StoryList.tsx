'use client'

import { useStories } from '../hooks/useStories'
import { StoryCard } from './StoryCard'
import { Button } from '@/components/ui/button'
import { Loader2, BookX, Wand2 } from 'lucide-react'
import Link from 'next/link'

export function StoryList() {
  const { stories, loading, error } = useStories()

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="h-10 w-10 text-[#2D5A4A] animate-spin" />
        <p className="mt-4 text-[#8B7D6B] font-medium">
          Carregando histórias...
        </p>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        {/* Error icon */}
        <div className="bg-[#FBE8E7] p-4 rounded-xl mb-4 border border-[#A94442]/20">
          <BookX className="h-10 w-10 text-[#A94442]" />
        </div>
        
        <h3 className="text-lg font-bold text-[#2C2416] mb-2">
          Ops! Algo deu errado
        </h3>
        <p className="text-[#5C4D3A] mb-4 max-w-md">
          {error}
        </p>
        
        <Button 
          onClick={() => window.location.reload()}
          variant="outline"
          className="rounded-lg border-[#E8DFD4] hover:bg-[#F5EDE4]"
        >
          Tentar novamente
        </Button>
      </div>
    )
  }

  // Empty state
  if (!stories || stories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        {/* Empty state illustration */}
        <div className="bg-[#F5EDE4] p-6 rounded-xl border border-[#E8DFD4] mb-6">
          <BookX className="h-12 w-12 text-[#A89B8C]" />
        </div>
        
        <h3 className="text-xl font-bold text-[#2C2416] mb-2">
          Nenhuma história ainda
        </h3>
        <p className="text-[#5C4D3A] mb-6 max-w-md">
          Seja o primeiro a criar uma história personalizada com nossa IA.
        </p>
        
        <Link href="/stories/create">
          <Button className="rounded-lg font-semibold bg-[#2D5A4A] hover:bg-[#1E3D32] 
                             text-[#FDF8F3] shadow-sm
                             transition-all duration-200 hover:shadow-md">
            <Wand2 className="mr-2 h-5 w-5" />
            Criar Primeira História
          </Button>
        </Link>
      </div>
    )
  }

  // Stories grid
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {stories.map((story) => (
        <StoryCard key={story.id} story={story} />
      ))}
    </div>
  )
}
