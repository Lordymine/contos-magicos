import Link from 'next/link'
import { BookOpen } from 'lucide-react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#FDF8F3]">
      {/* Simple Header */}
      <header className="bg-[#FDF8F3] border-b border-[#E8DFD4]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-[#2D5A4A] p-2 rounded-lg transition-all duration-200 group-hover:bg-[#1E3D32]">
              <BookOpen className="h-5 w-5 text-[#FDF8F3]" strokeWidth={2} />
            </div>
            <span className="text-xl font-bold text-[#2C2416]">
              Contos<span className="text-[#2D5A4A]">Mágicos</span>
            </span>
          </Link>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Simple Footer */}
      <footer className="bg-[#FDF8F3] border-t border-[#E8DFD4] py-4">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm text-[#8B7D6B]">
            © {new Date().getFullYear()} Contos Mágicos. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
