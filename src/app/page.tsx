import Link from 'next/link'
import { StoryList } from '@/features/stories/components/StoryList'
import { Button } from '@/components/ui/button'
import { ArrowRight, Wand2, BookOpen, Shield, Zap, Users, Star } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* 
        HERO SECTION
        Warm, magical, fairy-tale atmosphere
        Cream background with forest green and amber gold accents
      */}
      <section className="relative bg-[#FDF8F3] border-b border-[#E8DFD4]">
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            
            {/* Content */}
            <div className="space-y-8">
              {/* Tag Badge */}
              <div className="inline-flex items-center gap-2 
                              bg-[#FDF6E3] border border-[#C9A227]/20
                              px-4 py-2 rounded-lg">
                <Zap className="h-4 w-4 text-[#C9A227]" />
                <span className="text-sm font-semibold text-[#8B6914]">
                  Magia com Inteligência Artificial
                </span>
              </div>
              
              {/* Headline */}
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#2C2416] leading-tight">
                  Histórias únicas para cada criança
                </h1>
                <p className="text-lg md:text-xl text-[#5C4D3A] max-w-xl leading-relaxed">
                  Crie histórias infantis personalizadas com inteligência artificial. 
                  Conteúdo seguro, educativo e ilimitado para pais e educadores.
                </p>
              </div>
              
              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-start gap-3">
                <Link href="/stories/create">
                  <Button 
                    size="lg" 
                    className="rounded-lg text-base font-semibold h-12 px-8
                               bg-[#2D5A4A] hover:bg-[#1E3D32] text-[#FDF8F3] 
                               transition-all duration-200 hover:shadow-lg hover:shadow-[#2D5A4A]/20"
                  >
                    <Wand2 className="mr-2 h-5 w-5" />
                    Criar História
                  </Button>
                </Link>
                
                <Link href="/about">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="rounded-lg text-base font-semibold h-12 px-8
                               border-[#2D5A4A] text-[#2D5A4A] 
                               hover:bg-[#2D5A4A] hover:text-[#FDF8F3]
                               transition-all duration-200"
                  >
                    <BookOpen className="mr-2 h-5 w-5" />
                    Saiba mais
                  </Button>
                </Link>
              </div>
              
              {/* Trust indicators */}
              <div className="flex flex-wrap items-center gap-6 pt-4">
                <div className="flex items-center gap-2 text-sm text-[#8B7D6B]">
                  <Shield className="h-4 w-4 text-[#4A7C59]" />
                  <span>Conteúdo 100% seguro</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#8B7D6B]">
                  <Users className="h-4 w-4 text-[#C9A227]" />
                  <span>+10 mil histórias criadas</span>
                </div>
              </div>
            </div>
            
            {/* Visual/Illustration Area */}
            <div className="relative hidden md:block">
              <div className="relative bg-[#F5EDE4] rounded-2xl border border-[#E8DFD4] p-8 shadow-sm">
                {/* Decorative corner flourish */}
                <div className="absolute -top-3 -right-3 text-[#C9A227]">
                  <Star className="h-6 w-6 fill-current" />
                </div>
                
                {/* Abstract representation of story cards */}
                <div className="space-y-4">
                  <div className="bg-[#FDF8F3] rounded-xl border border-[#E8DFD4] p-4 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-8 w-8 bg-[#E8F3EF] rounded-lg flex items-center justify-center">
                        <BookOpen className="h-4 w-4 text-[#2D5A4A]" />
                      </div>
                      <div className="flex-1">
                        <div className="h-3 bg-[#E8DFD4] rounded w-3/4 mb-1"></div>
                        <div className="h-2 bg-[#F5EDE4] rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 bg-[#F5EDE4] rounded w-full"></div>
                      <div className="h-2 bg-[#F5EDE4] rounded w-5/6"></div>
                    </div>
                  </div>
                  
                  <div className="bg-[#FDF8F3] rounded-xl border border-[#E8DFD4] p-4 shadow-sm ml-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-8 w-8 bg-[#FDF6E3] rounded-lg flex items-center justify-center">
                        <Star className="h-4 w-4 text-[#C9A227]" />
                      </div>
                      <div className="flex-1">
                        <div className="h-3 bg-[#E8DFD4] rounded w-2/3 mb-1"></div>
                        <div className="h-2 bg-[#F5EDE4] rounded w-1/3"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 bg-[#F5EDE4] rounded w-full"></div>
                    </div>
                  </div>
                  
                  <div className="bg-[#2D5A4A] rounded-xl p-4 text-[#FDF8F3]">
                    <div className="flex items-center gap-3">
                      <Wand2 className="h-5 w-5 text-[#C9A227]" />
                      <span className="font-semibold">IA gerando história...</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 
        STORIES SECTION
        Warm elegant list
      */}
      <section className="py-16 bg-[#F5EDE4]">
        <div className="max-w-6xl mx-auto px-6">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#2C2416] mb-2">
                Histórias Recentes
              </h2>
              <p className="text-[#8B7D6B]">
                Explore histórias criadas pela comunidade
              </p>
            </div>
            
            <Link href="/stories" className="hidden sm:block">
              <Button 
                variant="ghost" 
                className="rounded-lg font-medium text-[#2D5A4A] hover:text-[#1E3D32] hover:bg-[#E8F3EF]"
              >
                Ver todas
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          {/* Stories Container */}
          <div className="bg-[#FDF8F3] rounded-xl border border-[#E8DFD4] p-6 md:p-8 shadow-sm">
            <StoryList />
          </div>
          
          {/* Mobile link */}
          <div className="sm:hidden flex justify-center mt-6">
            <Link href="/stories" className="w-full">
              <Button 
                variant="outline" 
                className="w-full rounded-lg border-[#D4C9BC] text-[#5C4D3A] hover:bg-[#F5EDE4]"
              >
                Ver todas as histórias
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 
        FEATURES SECTION
        Warm value proposition
      */}
      <section className="py-16 bg-[#FDF8F3] border-t border-[#E8DFD4]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#2C2416] mb-3">
              Por que escolher a Contos Mágicos?
            </h2>
            <p className="text-[#8B7D6B] max-w-2xl mx-auto">
              Tecnologia de ponta para criar experiências únicas de leitura
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Zap,
                title: 'Geração Instantânea',
                desc: 'Crie histórias completas em segundos com nossa IA avançada'
              },
              {
                icon: Shield,
                title: 'Conteúdo Seguro',
                desc: 'Todas as histórias são filtradas para garantir segurança infantil'
              },
              {
                icon: Users,
                title: 'Para Toda a Família',
                desc: 'Ideal para pais, educadores e profissionais da educação'
              }
            ].map((feature, i) => (
              <div 
                key={i} 
                className="group bg-[#F5EDE4] rounded-xl border border-[#E8DFD4] 
                           p-6 hover:border-[#2D5A4A]/30 hover:shadow-md
                           transition-all duration-200"
              >
                <div className="h-12 w-12 bg-[#FDF8F3] rounded-xl border border-[#E8DFD4] 
                                flex items-center justify-center mb-4
                                group-hover:border-[#2D5A4A]/20 group-hover:bg-[#E8F3EF]
                                transition-all duration-200">
                  <feature.icon className="h-6 w-6 text-[#2D5A4A]" />
                </div>
                <h3 className="font-bold text-[#2C2416] mb-2">{feature.title}</h3>
                <p className="text-sm text-[#8B7D6B] leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 
        CTA SECTION
        Final call to action
      */}
      <section className="py-16 bg-[#2D5A4A]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#FDF8F3] mb-4">
            Pronto para começar?
          </h2>
          <p className="text-[#A8C4B8] mb-8 max-w-xl mx-auto">
            Crie sua primeira história personalizada agora mesmo. 
            É rápido, fácil e totalmente gratuito.
          </p>
          <Link href="/stories/create">
            <Button 
              size="lg" 
              className="rounded-lg text-base font-semibold h-12 px-8
                         bg-[#C9A227] hover:bg-[#A8841D] text-[#2C2416]
                         transition-all duration-200 hover:shadow-lg hover:shadow-[#C9A227]/25"
            >
              <Wand2 className="mr-2 h-5 w-5" />
              Criar Minha Primeira História
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
