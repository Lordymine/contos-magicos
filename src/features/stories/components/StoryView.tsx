'use client'

import { useEffect, useState } from 'react'
import { Heart, MessageCircle, Share2, ArrowLeft, BookOpen, Clock, Send, User } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { useSocial } from '../hooks/useSocial'
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

interface StoryViewProps {
  story: StoryWithAuthor
  isAuthenticated: boolean
}

export function StoryView({ story, isAuthenticated }: StoryViewProps) {
  const {
    likeStatus,
    comments,
    loading,
    fetchLikeStatus,
    toggleLike,
    fetchComments,
    addComment,
  } = useSocial()

  const [newComment, setNewComment] = useState('')

  useEffect(() => {
    fetchLikeStatus(story.id)
    fetchComments(story.id)
  }, [story.id, fetchLikeStatus, fetchComments])

  const handleLike = async () => {
    if (!isAuthenticated) return
    await toggleLike(story.id)
  }

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    const comment = await addComment(story.id, newComment)
    if (comment) {
      setNewComment('')
    }
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: story.title,
        text: `Leia "${story.title}" no Contos Mágicos!`,
        url: window.location.href,
      })
    } catch {
      await navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8">
      {/* Back Link */}
      <Link 
        href="/" 
        className="inline-flex items-center text-sm font-medium text-[#8B7D6B] 
                   hover:text-[#2D5A4A] transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar para histórias
      </Link>

      {/* Story Card */}
      <Card className="border border-[#E8DFD4] rounded-xl overflow-hidden bg-[#FDF8F3] shadow-sm">
        {/* Top accent - Forest green */}
        <div className="h-1 w-full bg-[#2D5A4A]" />
        
        <CardHeader className="px-6 md:px-8 pt-8 pb-4 space-y-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
               <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wide border ${
                 THEME_STYLES[story.theme] || 'bg-[#F5EDE4] text-[#8B7D6B] border-[#E8DFD4]'
               }`}>
                 <BookOpen className="h-3 w-3" />
                 {THEME_LABELS[story.theme] || story.theme}
               </span>
               <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wide bg-[#F5EDE4] text-[#8B7D6B] border border-[#E8DFD4]">
                 {story.ageGroup} anos
               </span>
               {story.isPublic && (
                 <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wide bg-[#E8F3EF] text-[#4A7C59] border border-[#4A7C59]/20">
                   Pública
                 </span>
               )}
            </div>
            
            <h1 className="text-2xl md:text-4xl font-bold text-[#2C2416] leading-tight">
              {story.title}
            </h1>
          </div>
          
          <div className="flex items-center gap-3 text-sm text-[#8B7D6B] border-b border-[#E8DFD4] pb-4">
            <div className="flex items-center gap-2">
               <div className="h-8 w-8 rounded-lg bg-[#E8F3EF] flex items-center justify-center text-[#2D5A4A] font-semibold text-sm">
                  {story.author.name?.charAt(0) || 'A'}
               </div>
               <span className="font-medium">{story.author.name || 'Anônimo'}</span>
            </div>
            <span className="text-[#E8DFD4]">•</span>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>
                {formatDistanceToNow(new Date(story.createdAt), {
                  addSuffix: true,
                  locale: ptBR,
                })}
              </span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="px-6 md:px-8 pb-8">
          <div className="prose prose-lg max-w-none text-[#5C4D3A] leading-relaxed">
            {story.content.split('\n').map((paragraph, i) => (
              <p key={i} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#E8DFD4]">
            <div className="flex gap-2">
                <Button
                  variant={likeStatus?.isLiked ? 'default' : 'outline'}
                  size="sm"
                  onClick={handleLike}
                  disabled={!isAuthenticated}
                  className={`rounded-lg font-medium transition-all ${
                    likeStatus?.isLiked 
                      ? 'bg-[#A94442] hover:bg-[#8B3634] text-[#FDF8F3] border-[#A94442]' 
                      : 'border-[#E8DFD4] hover:bg-[#FBE8E7] hover:text-[#A94442] hover:border-[#A94442]/30'
                  }`}
                >
                  <Heart className={`mr-1.5 h-4 w-4 ${likeStatus?.isLiked ? 'fill-current' : ''}`} />
                  {likeStatus?.count || 0}
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-lg font-medium border-[#E8DFD4] hover:bg-[#E8F3EF] hover:text-[#2D5A4A] hover:border-[#2D5A4A]/30"
                >
                  <MessageCircle className="mr-1.5 h-4 w-4" />
                  {comments.length}
                </Button>
            </div>

            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleShare} 
              className="rounded-lg font-medium text-[#8B7D6B] hover:text-[#2D5A4A] hover:bg-[#E8F3EF]"
            >
              <Share2 className="mr-1.5 h-4 w-4" />
              Compartilhar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Comments Section */}
      <div className="max-w-2xl mx-auto">
        <h2 className="text-xl font-bold text-[#2C2416] mb-6 flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-[#2D5A4A]" />
            Comentários
            <span className="text-sm font-normal text-[#8B7D6B] ml-2">({comments.length})</span>
        </h2>
        
        <div className="space-y-6">
          {isAuthenticated ? (
            <Card className="border border-[#E8DFD4] rounded-xl overflow-hidden shadow-sm">
                <CardContent className="p-4 bg-[#F5EDE4]">
                    <form onSubmit={handleComment} className="flex gap-3">
                      <div className="flex-1">
                          <Textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Escreva um comentário..."
                            rows={2}
                            className="resize-none border-[#E8DFD4] bg-[#FDF8F3] focus:border-[#2D5A4A] focus:ring-[#2D5A4A]/20 text-sm rounded-lg"
                          />
                      </div>
                      <Button 
                        type="submit" 
                        size="icon" 
                        disabled={loading || !newComment.trim()} 
                        className="h-10 w-10 rounded-lg bg-[#2D5A4A] hover:bg-[#1E3D32] self-end"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                </CardContent>
            </Card>
          ) : (
            <div className="bg-[#E8F3EF] rounded-xl p-6 text-center border border-[#2D5A4A]/20">
                <User className="h-8 w-8 text-[#2D5A4A] mx-auto mb-3" />
                <p className="text-[#5C4D3A] font-medium mb-2">Faça login para comentar</p>
                <Button 
                  variant="link" 
                  asChild 
                  className="text-[#2D5A4A] font-semibold hover:text-[#1E3D32]"
                >
                    <Link href="/auth/login">Entrar agora</Link>
                </Button>
            </div>
          )}

          <div className="space-y-3">
            {comments.map((comment) => (
              <div 
                key={comment.id} 
                className="p-4 bg-[#FDF8F3] rounded-xl border border-[#E8DFD4] shadow-sm"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-8 w-8 rounded-lg bg-[#E8F3EF] flex items-center justify-center text-[#2D5A4A] font-semibold text-xs">
                    {comment.user.name?.charAt(0) || 'U'}
                  </div>
                  <div className="flex-1">
                      <div className="font-semibold text-[#2C2416] text-sm">{comment.user.name || 'Anônimo'}</div>
                      <div className="text-xs text-[#A89B8C]">
                        {formatDistanceToNow(new Date(comment.createdAt), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </div>
                  </div>
                </div>
                <p className="text-[#5C4D3A] text-sm leading-relaxed pl-11">{comment.content}</p>
              </div>
            ))}

            {comments.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-[#F5EDE4] rounded-xl h-16 w-16 flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="h-8 w-8 text-[#A89B8C]" />
                </div>
                <p className="text-[#8B7D6B] font-medium">
                  Ainda não há comentários.
                </p>
                <p className="text-sm text-[#A89B8C]">
                  Seja o primeiro a compartilhar sua opinião!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
