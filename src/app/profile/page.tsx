'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { User, BookOpen, LogOut, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useStories } from '@/features/stories/hooks/useStories'
import { StoryCard } from '@/features/stories/components/StoryCard'
import Link from 'next/link'
import { Loader2, PlusCircle } from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()
  const { stories, loading, fetchMyStories } = useStories()
  
  useEffect(() => {
    fetchMyStories()
  }, [fetchMyStories])

  const handleLogout = async () => {
    await signOut({ redirect: false })
    window.location.href = '/'
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 bg-[#FDF8F3] min-h-[calc(100vh-4rem)]">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Header */}
        <div className="bg-[#FDF8F3] rounded-xl p-6 md:p-8 border border-[#E8DFD4] shadow-sm 
                        flex flex-col md:flex-row items-center gap-6">
          <div className="h-20 w-20 rounded-xl bg-[#E8F3EF] flex items-center justify-center border border-[#2D5A4A]/20">
             <User className="h-10 w-10 text-[#2D5A4A]" />
          </div>
          
          <div className="flex-1 text-center md:text-left space-y-3">
             <div>
                <h1 className="text-2xl font-bold text-[#2C2416]">Meu Perfil</h1>
                <p className="text-[#8B7D6B] text-sm">Gerencie suas histórias e configurações</p>
             </div>
             
             <div className="flex flex-wrap justify-center md:justify-start gap-2">
                <Button 
                  variant="outline" 
                  className="rounded-lg border-[#D4C9BC] hover:bg-[#F5EDE4] text-[#5C4D3A]" 
                  disabled
                >
                   <Settings className="mr-2 h-4 w-4" />
                   Configurações
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleLogout}
                  className="rounded-lg border-[#A94442]/30 text-[#A94442] hover:bg-[#FBE8E7]"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                </Button>
             </div>
          </div>
          
          <div className="bg-[#F5EDE4] p-5 rounded-xl min-w-[160px] text-center border border-[#E8DFD4]">
             <div className="text-3xl font-bold text-[#2D5A4A] mb-1">{stories.length}</div>
             <div className="text-xs font-semibold text-[#8B7D6B] uppercase tracking-wide">Histórias</div>
          </div>
        </div>

        {/* My Stories Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#2C2416] flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-[#2D5A4A]" />
                  Minhas Histórias
              </h2>
              <Link href="/stories/create">
                  <Button 
                    size="sm" 
                    className="rounded-lg font-medium bg-[#2D5A4A] hover:bg-[#1E3D32] text-[#FDF8F3]"
                  >
                     <PlusCircle className="mr-2 h-4 w-4" />
                     Nova História
                  </Button>
              </Link>
          </div>
          
          {loading ? (
               <div className="flex flex-col items-center justify-center py-16 gap-4">
                  <Loader2 className="h-10 w-10 text-[#2D5A4A] animate-spin" />
                  <p className="text-[#8B7D6B] font-medium">Carregando suas histórias...</p>
               </div>
          ) : stories.length === 0 ? (
              <Card className="border border-dashed border-[#E8DFD4] bg-[#F5EDE4] rounded-xl py-12">
                  <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
                      <div className="bg-[#FDF8F3] p-5 rounded-xl border border-[#E8DFD4] mb-6">
                          <BookOpen className="h-8 w-8 text-[#A89B8C]" />
                      </div>
                      <h3 className="text-lg font-bold text-[#2C2416] mb-2">Nenhuma história ainda</h3>
                      <p className="text-[#8B7D6B] mb-6 text-sm">
                        Você ainda não criou nenhuma história. Comece sua primeira aventura agora!
                      </p>
                      <Link href="/stories/create">
                        <Button 
                          className="rounded-lg font-semibold bg-[#2D5A4A] hover:bg-[#1E3D32] text-[#FDF8F3]"
                        >
                            Criar Primeira História
                        </Button>
                      </Link>
                  </div>
              </Card>
          ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {stories.map((story) => (
                      <StoryCard key={story.id} story={story} />
                  ))}
              </div>
          )}
        </div>
      </div>
    </div>
  )
}
