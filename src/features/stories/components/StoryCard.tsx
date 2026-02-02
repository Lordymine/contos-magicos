'use client'

import Link from 'next/link'
import { Heart, User, Clock } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import type { StoryWithAuthor } from '@/domains/story/types'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const THEME_LABELS: Record<string, string> = {
  adventure: 'Aventura',
  fantasy: 'Fantasia',
  animals: 'Animais',
  friendship: 'Amizade',
  nature: 'Natureza',
  space: 'Espaço',
  fairytale: 'Conto de Fadas',
  mystery: 'Mistério',
}

const THEME_STYLES: Record<string, string> = {
  adventure: 'bg-[#FDF0E6] text-[#B8681A] border-[#E8C4A0]',
  fantasy: 'bg-[#F3E8F3] text-[#7C3A7C] border-[#D4B8D4]',
  animals: 'bg-[#E8F3EF] text-[#2D5A4A] border-[#A8D4C0]',
  friendship: 'bg-[#FCE8F0] text-[#A85478] border-[#E8B8D0]',
  nature: 'bg-[#E8F3E8] text-[#4A7C4A] border-[#B8D4B8]',
  space: 'bg-[#E8E8F3] text-[#4A4A7C] border-[#B8B8D4]',
  fairytale: 'bg-[#FDF6E3] text-[#8B6914] border-[#E8D4A0]',
  mystery: 'bg-[#EDE8E4] text-[#5C4D3A] border-[#C9BCB0]',
}

interface StoryCardProps {
  story: StoryWithAuthor
}

export function StoryCard({ story }: StoryCardProps) {
  const timeAgo = formatDistanceToNow(new Date(story.createdAt), {
    addSuffix: true,
    locale: ptBR,
  })

  return (
    <Link href={`/stories/${story.id}`} className="block h-full group">
      <Card className="h-full flex flex-col overflow-hidden 
                       rounded-lg border border-[#E8DFD4]
                       bg-[#FDF8F3] hover:border-[#2D5A4A]/40
                       shadow-sm
                       hover:shadow-md
                       transition-all duration-200">
        
        <CardHeader className="pb-3 pt-5 px-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            {/* Theme tag */}
            <span className={`px-2.5 py-1 text-[11px] uppercase tracking-wide 
                             font-semibold rounded-md border ${
              THEME_STYLES[story.theme] || 'bg-[#F5EDE4] text-[#8B7D6B] border-[#E8DFD4]'
            }`}>
              {THEME_LABELS[story.theme] || story.theme}
            </span>
            
            {/* Public badge */}
            {story.isPublic && (
              <span className="text-[11px] font-semibold text-[#4A7C59] 
                               bg-[#E8F3EF] px-2 py-0.5 rounded-md 
                               border border-[#4A7C59]/20">
                PÚBLICA
              </span>
            )}
          </div>
          
          {/* Title */}
          <CardTitle className="text-base font-bold leading-snug text-[#2C2416] 
                                 group-hover:text-[#2D5A4A] transition-colors line-clamp-2">
            {story.title}
          </CardTitle>
        </CardHeader>
        
        {/* Content preview */}
        <CardContent className="flex-1 pb-4 px-5">
          <p className="text-[#5C4D3A] text-sm leading-relaxed line-clamp-3">
            {story.content.substring(0, 180)}...
          </p>
        </CardContent>
        
        {/* Footer with metadata */}
        <CardFooter className="pt-3 border-t border-[#E8DFD4] 
                               bg-[#F5EDE4] flex items-center justify-between 
                               text-xs text-[#8B7D6B] px-5 py-3">
          <div className="flex items-center gap-3">
            {/* Likes */}
            <div className="flex items-center gap-1.5 
                            text-[#A94442] bg-[#FDF8F3] 
                            px-2 py-1 rounded-md border border-[#E8DFD4]">
              <Heart className="h-3.5 w-3.5 fill-current" />
              <span className="font-semibold">{story.likesCount}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Author */}
            <div className="flex items-center gap-1.5" title={`Autor: ${story.author.name}`}>
              <User className="h-3.5 w-3.5" />
              <span className="max-w-[80px] truncate font-medium">
                {story.author.name || 'Anônimo'}
              </span>
            </div>
            
            {/* Time */}
            <div className="flex items-center gap-1.5" title={timeAgo}>
              <Clock className="h-3.5 w-3.5" />
              <span className="max-w-[70px] truncate">
                {timeAgo.replace('cerca de ', '').replace('aproximadamente ', '')}
              </span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
