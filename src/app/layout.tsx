import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { BookOpen, PlusCircle, Bell, User } from 'lucide-react'
import { auth } from '@/infrastructure/auth/config'
import './globals.css'
import { Button } from '@/components/ui/button'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Contos Mágicos - Histórias Infantis com IA',
  description: 'Crie histórias infantis personalizadas com inteligência artificial. Plataforma mágica para pais e educadores.',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} font-sans antialiased min-h-screen flex flex-col bg-[#FDF8F3]`}>
        {/* 
          ELEGANT NAVIGATION
          Warm, magical, fairy-tale atmosphere
        */}
        <header className="sticky top-0 z-50 bg-[#FDF8F3]/95 backdrop-blur-sm border-b border-[#E8DFD4]">
          <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 h-16 md:h-18">
            
            {/* Logo: Warm and magical */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
              <div className="bg-[#2D5A4A] p-2 rounded-lg transition-all duration-200 group-hover:bg-[#1E3D32]">
                <BookOpen className="h-5 w-5 text-[#FDF8F3]" strokeWidth={2} />
              </div>
              <span className="text-lg sm:text-xl font-bold text-[#2C2416]">
                Contos<span className="text-[#2D5A4A]">Mágicos</span>
              </span>
            </Link>

            {/* Navigation Actions - Fixed for mobile */}
            <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
              {session?.user ? (
                <>
                  {/* Create Story Button - Desktop */}
                  <Link href="/stories/create" className="hidden sm:block">
                    <Button 
                      size="sm" 
                      className="rounded-lg font-medium bg-[#2D5A4A] hover:bg-[#1E3D32] text-[#FDF8F3]
                                 transition-all duration-200 hover:shadow-md"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Nova História
                    </Button>
                  </Link>
                  
                  {/* Create Story Button - Mobile */}
                  <Link href="/stories/create" className="sm:hidden">
                    <Button 
                      size="icon" 
                      className="rounded-lg bg-[#2D5A4A] hover:bg-[#1E3D32] text-[#FDF8F3] h-10 w-10"
                    >
                      <PlusCircle className="h-5 w-5" />
                    </Button>
                  </Link>

                  {/* Divider */}
                  <div className="w-px h-6 bg-[#E8DFD4] mx-1 hidden sm:block" />

                  {/* Notifications */}
                  <Link href="/notifications">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="rounded-lg text-[#8B7D6B] hover:text-[#2D5A4A] hover:bg-[#E8F3EF] h-10 w-10"
                    >
                      <Bell className="h-5 w-5" />
                    </Button>
                  </Link>
                  
                  {/* Profile */}
                  <Link href="/profile">
                    <Button 
                      variant="ghost" 
                      className="rounded-lg text-[#5C4D3A] hover:text-[#2C2416] hover:bg-[#F5EDE4]
                                 font-medium gap-2 pl-2 pr-3 h-10"
                    >
                      <div className="h-7 w-7 rounded-lg bg-[#E8F3EF] 
                                      flex items-center justify-center text-[#2D5A4A]">
                        {session.user.image ? (
                          <img 
                            src={session.user.image} 
                            alt={session.user.name || 'User'} 
                            className="h-full w-full rounded-lg object-cover" 
                          />
                        ) : (
                          <User className="h-4 w-4" />
                        )}
                      </div>
                      <span className="hidden sm:inline text-sm">
                        {session.user.name?.split(' ')[0] || 'Perfil'}
                      </span>
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  {/* Login Button */}
                  <Link href="/auth/login" className="hidden sm:block">
                    <Button 
                      variant="ghost" 
                      className="rounded-lg font-medium text-[#5C4D3A] hover:text-[#2C2416] hover:bg-[#F5EDE4]"
                    >
                      Entrar
                    </Button>
                  </Link>
                  
                  {/* Mobile: Icon only for login */}
                  <Link href="/auth/login" className="sm:hidden">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="rounded-lg text-[#5C4D3A] hover:text-[#2C2416] hover:bg-[#F5EDE4] h-10 w-10"
                    >
                      <User className="h-5 w-5" />
                    </Button>
                  </Link>
                  
                  {/* Register Button - Fixed for mobile */}
                  <Link href="/auth/register">
                    <Button 
                      size="sm"
                      className="rounded-lg font-semibold bg-[#C9A227] hover:bg-[#A8841D] text-[#2C2416]
                                 transition-all duration-200 hover:shadow-md px-3 sm:px-4 h-10"
                    >
                      <span className="hidden sm:inline">Começar</span>
                      <span className="sm:hidden">Início</span>
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </header>

        {/* Main Content Area */}
        <main className="flex-1">
          {children}
        </main>

        {/* Elegant Footer */}
        <footer className="border-t border-[#E8DFD4] bg-[#F5EDE4] mt-auto">
          <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Logo */}
              <div className="flex items-center gap-2">
                <div className="bg-[#2D5A4A] p-1.5 rounded-md">
                  <BookOpen className="h-4 w-4 text-[#FDF8F3]" />
                </div>
                <span className="font-bold text-[#2C2416]">Contos Mágicos</span>
              </div>
              
              {/* Links */}
              <div className="flex items-center gap-6 text-sm text-[#8B7D6B]">
                <Link href="/about" className="hover:text-[#2D5A4A] transition-colors">Sobre</Link>
                <Link href="/privacy" className="hover:text-[#2D5A4A] transition-colors">Privacidade</Link>
                <Link href="/terms" className="hover:text-[#2D5A4A] transition-colors">Termos</Link>
              </div>
              
              {/* Copyright */}
              <p className="text-sm text-[#A89B8C]">
                © {new Date().getFullYear()} Contos Mágicos
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
