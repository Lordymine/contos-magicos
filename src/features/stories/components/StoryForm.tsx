'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useStories } from '../hooks/useStories'
import { Loader2, Wand2, Globe, Lock, BookOpen, Star, Lightbulb } from 'lucide-react'

const THEME_OPTIONS = [
  { value: 'adventure', label: 'Aventura' },
  { value: 'fantasy', label: 'Fantasia' },
  { value: 'animals', label: 'Animais' },
  { value: 'friendship', label: 'Amizade' },
  { value: 'nature', label: 'Natureza' },
  { value: 'space', label: 'Espaço' },
  { value: 'fairytale', label: 'Conto de Fadas' },
  { value: 'mystery', label: 'Mistério' },
]

const AGE_OPTIONS = [
  { value: '3-5', label: '3-5 anos' },
  { value: '6-8', label: '6-8 anos' },
  { value: '9-12', label: '9-12 anos' },
]

export function StoryForm() {
  const router = useRouter()
  const { createStory, loading, error } = useStories()
  const [formData, setFormData] = useState({
    title: '',
    theme: 'adventure',
    ageGroup: '6-8',
    prompt: '',
    isPublic: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const story = await createStory({
      title: formData.title,
      theme: formData.theme as any,
      ageGroup: formData.ageGroup as any,
      prompt: formData.prompt,
      isPublic: formData.isPublic,
    })

    if (story) {
      router.push(`/stories/${story.id}`)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="max-w-2xl mx-auto">
        <Card className="border border-[#E8DFD4] bg-[#FDF8F3] rounded-xl shadow-sm overflow-hidden">
          
          {/* Header */}
          <CardHeader className="text-center pb-6 pt-8 border-b border-[#E8DFD4]">
            <div className="mx-auto bg-[#E8F3EF] p-3 rounded-xl w-fit mb-4">
              <Wand2 className="h-6 w-6 text-[#2D5A4A]" />
            </div>
            <CardTitle className="text-2xl font-bold text-[#2C2416]">
              Criar Nova História
            </CardTitle>
            <CardDescription className="text-[#8B7D6B]">
              Personalize sua história com nossa inteligência artificial
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Title Input */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-[#2C2416] font-semibold flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-[#2D5A4A]" />
                  Título da História
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: A Aventura do Pequeno Dragão"
                  required
                  className="rounded-lg h-12 bg-[#FDF8F3] border-[#E8DFD4] 
                             focus:border-[#2D5A4A] focus:ring-[#2D5A4A]/20
                             text-[#2C2416] placeholder:text-[#A89B8C]
                             transition-all"
                />
              </div>

              {/* Theme & Age row */}
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Theme */}
                <div className="space-y-2">
                  <Label htmlFor="theme" className="text-[#2C2416] font-semibold flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-[#2D5A4A]" />
                    Tema
                  </Label>
                  <div className="relative">
                    <select
                      id="theme"
                      value={formData.theme}
                      onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                      className="w-full h-12 rounded-lg bg-[#FDF8F3] border border-[#E8DFD4]
                                 px-3 pr-10 text-[#2C2416] appearance-none cursor-pointer
                                 focus:border-[#2D5A4A] focus:ring-1 focus:ring-[#2D5A4A]/20
                                 [&>option]:bg-[#FDF8F3] transition-all"
                    >
                      {THEME_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    {/* Custom dropdown arrow */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-[#A89B8C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Age Group */}
                <div className="space-y-2">
                  <Label htmlFor="ageGroup" className="text-[#2C2416] font-semibold flex items-center gap-2">
                    <Star className="h-4 w-4 text-[#2D5A4A]" />
                    Faixa Etária
                  </Label>
                  <div className="relative">
                    <select
                      id="ageGroup"
                      value={formData.ageGroup}
                      onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value })}
                      className="w-full h-12 rounded-lg bg-[#FDF8F3] border border-[#E8DFD4]
                                 px-3 pr-10 text-[#2C2416] appearance-none cursor-pointer
                                 focus:border-[#2D5A4A] focus:ring-1 focus:ring-[#2D5A4A]/20
                                 [&>option]:bg-[#FDF8F3] transition-all"
                    >
                      {AGE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    {/* Custom dropdown arrow */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-[#A89B8C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Prompt Textarea */}
              <div className="space-y-2">
                <Label htmlFor="prompt" className="text-[#2C2416] font-semibold">
                  Ideia Principal
                </Label>
                <Textarea
                  id="prompt"
                  value={formData.prompt}
                  onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                  placeholder="Descreva a história que você gostaria de criar. Quanto mais detalhes, melhor o resultado."
                  rows={4}
                  className="rounded-lg bg-[#FDF8F3] border-[#E8DFD4] 
                             focus:border-[#2D5A4A] focus:ring-[#2D5A4A]/20
                             text-[#2C2416] placeholder:text-[#A89B8C] resize-none
                             transition-all"
                />
                <p className="text-xs text-[#A89B8C]">
                  Opcional. A IA usará seu tema e faixa etária como base.
                </p>
              </div>

              {/* Visibility Toggle */}
              <div className="space-y-3">
                <Label className="text-[#2C2416] font-semibold">
                  Visibilidade
                </Label>
                <div className="flex gap-3">
                  {/* Private option */}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isPublic: false })}
                    className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg 
                               border transition-all duration-200
                               ${!formData.isPublic 
                                 ? 'border-[#2D5A4A] bg-[#E8F3EF] text-[#2D5A4A] shadow-sm' 
                                 : 'border-[#E8DFD4] bg-[#FDF8F3] text-[#5C4D3A] hover:border-[#2D5A4A]/30'}`}
                  >
                    <Lock className="h-4 w-4" />
                    <span className="font-semibold">Privada</span>
                  </button>
                  
                  {/* Public option */}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isPublic: true })}
                    className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg 
                               border transition-all duration-200
                               ${formData.isPublic 
                                 ? 'border-[#2D5A4A] bg-[#E8F3EF] text-[#2D5A4A] shadow-sm' 
                                 : 'border-[#E8DFD4] bg-[#FDF8F3] text-[#5C4D3A] hover:border-[#2D5A4A]/30'}`}
                  >
                    <Globe className="h-4 w-4" />
                    <span className="font-semibold">Pública</span>
                  </button>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="p-4 rounded-lg bg-[#FBE8E7] border border-[#A94442]/20 text-[#A94442] text-sm font-medium">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-lg text-base font-semibold
                           bg-[#2D5A4A] hover:bg-[#1E3D32] text-[#FDF8F3]
                           shadow-sm
                           transition-all duration-200 hover:shadow-md
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Gerando história...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-5 w-5" />
                    Criar História
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
