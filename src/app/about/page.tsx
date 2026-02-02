import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Zap, Wand2, Shield, Users, ArrowRight } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="flex flex-col bg-[#FDF8F3]">
      {/* Hero Section */}
      <section className="bg-[#FDF8F3] border-b border-[#E8DFD4]">
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 rounded-lg bg-[#E8F3EF] px-4 py-2 text-sm font-semibold text-[#2D5A4A] border border-[#2D5A4A]/10">
              <Zap className="h-4 w-4 text-[#C9A227]" />
              <span>Sobre a Plataforma</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold text-[#2C2416] leading-tight">
              Tecnologia inteligente para histórias únicas
            </h1>
            
            <p className="text-lg text-[#5C4D3A] leading-relaxed max-w-2xl mx-auto">
              A Contos Mágicos utiliza inteligência artificial avançada para criar histórias 
              personalizadas, seguras e educativas para crianças de todas as idades.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-[#F5EDE4]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#FDF8F3] p-6 rounded-2xl border border-[#E8DFD4] shadow-sm">
              <div className="w-12 h-12 bg-[#E8F3EF] rounded-xl flex items-center justify-center mb-4">
                <Wand2 className="h-6 w-6 text-[#2D5A4A]" />
              </div>
              <h3 className="text-lg font-bold text-[#2C2416] mb-2">Geração Instantânea</h3>
              <p className="text-[#8B7D6B] text-sm leading-relaxed">
                Crie histórias completas em segundos. Basta escolher um tema e nossa IA 
                gera uma narrativa única e envolvente.
              </p>
            </div>

            <div className="bg-[#FDF8F3] p-6 rounded-2xl border border-[#E8DFD4] shadow-sm">
              <div className="w-12 h-12 bg-[#E8F3EF] rounded-xl flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-[#4A7C59]" />
              </div>
              <h3 className="text-lg font-bold text-[#2C2416] mb-2">Conteúdo Seguro</h3>
              <p className="text-[#8B7D6B] text-sm leading-relaxed">
                Todas as histórias passam por filtros de segurança para garantir 
                conteúdo apropriado e positivo para todas as idades.
              </p>
            </div>

            <div className="bg-[#FDF8F3] p-6 rounded-2xl border border-[#E8DFD4] shadow-sm">
              <div className="w-12 h-12 bg-[#FDF6E3] rounded-xl flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-[#C9A227]" />
              </div>
              <h3 className="text-lg font-bold text-[#2C2416] mb-2">Para Famílias</h3>
              <p className="text-[#8B7D6B] text-sm leading-relaxed">
                Pensado para pais e educadores criarem momentos especiais de leitura 
                com as crianças.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Section */}
      <section className="py-16 bg-[#FDF8F3] border-t border-[#E8DFD4]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="w-16 h-16 bg-[#E8F3EF] rounded-2xl flex items-center justify-center mx-auto">
              <Shield className="h-8 w-8 text-[#4A7C59]" />
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold text-[#2C2416]">
              Segurança em Primeiro Lugar
            </h2>
            
            <p className="text-[#5C4D3A] leading-relaxed">
              Sabemos que a segurança online é fundamental. Por isso, todas as histórias 
              geradas passam por rigorosos filtros de conteúdo para garantir que sejam 
              apropriadas, positivas e livres de temas sensíveis.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <div className="flex items-center gap-2 text-sm font-medium text-[#5C4D3A] bg-[#F5EDE4] px-4 py-2 rounded-lg border border-[#E8DFD4]">
                <div className="h-2 w-2 rounded-full bg-[#4A7C59]"></div>
                Conteúdo monitorado por IA
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-[#5C4D3A] bg-[#F5EDE4] px-4 py-2 rounded-lg border border-[#E8DFD4]">
                <div className="h-2 w-2 rounded-full bg-[#4A7C59]"></div>
                Opções de privacidade
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-[#5C4D3A] bg-[#F5EDE4] px-4 py-2 rounded-lg border border-[#E8DFD4]">
                <div className="h-2 w-2 rounded-full bg-[#4A7C59]"></div>
                Comunidade moderada
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#2D5A4A]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#FDF8F3] mb-4">
            Pronto para começar?
          </h2>
          <p className="text-[#A8C4B8] mb-8 max-w-xl mx-auto">
            Crie sua primeira história personalizada agora mesmo. 
            É rápido, fácil e totalmente gratuito.
          </p>
          <Link href="/stories/create">
            <Button 
              size="lg" 
              className="rounded-xl font-semibold bg-[#C9A227] hover:bg-[#A8841D] text-[#2C2416]
                         transition-all duration-200 hover:shadow-lg hover:shadow-[#C9A227]/25"
            >
              <Wand2 className="mr-2 h-5 w-5" />
              Criar Minha Primeira História
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
