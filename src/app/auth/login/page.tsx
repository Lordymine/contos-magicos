'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Chrome, ArrowLeft, Mail, Lock, Loader2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Email ou senha incorretos")
        setLoading(false)
        return
      }

      router.push("/profile")
      router.refresh()
    } catch {
      setError("Ocorreu um erro. Tente novamente.")
      setLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/profile" })
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center py-12 px-4 bg-[#FDF8F3]">
      
      {/* Back link */}
      <Link 
        href="/" 
        className="absolute top-4 left-4 flex items-center gap-2 text-[#8B7D6B] 
                   hover:text-[#2D5A4A] transition-colors text-sm font-medium"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Link>

      <Card className="w-full max-w-md border border-[#E8DFD4] bg-[#FDF8F3] rounded-xl shadow-sm overflow-hidden">
        
        {/* Header */}
        <CardHeader className="space-y-1 text-center pb-6 pt-8">
          <div className="mx-auto bg-[#E8F3EF] p-3 rounded-xl w-fit mb-3">
            <Mail className="h-6 w-6 text-[#2D5A4A]" />
          </div>
          <CardTitle className="text-2xl font-bold text-[#2C2416]">
            Bem-vindo de volta
          </CardTitle>
          <CardDescription className="text-[#8B7D6B]">
            Entre na sua conta para continuar
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Google Sign In */}
          <Button 
            variant="outline" 
            onClick={handleGoogleSignIn}
            className="w-full h-12 rounded-lg border-[#D4C9BC] 
                       text-[#2C2416] hover:bg-[#F5EDE4] font-semibold
                       transition-all duration-200"
          >
            <Chrome className="mr-2 h-5 w-5 text-[#2D5A4A]" />
            Entrar com Google
          </Button>
          
          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[#E8DFD4]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#FDF8F3] px-3 text-[#A89B8C] font-medium">
                ou continue com email
              </span>
            </div>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {error && (
              <div className="p-3 rounded-lg bg-[#FBE8E7] border border-[#A94442]/20 text-[#A94442] text-sm text-center">
                {error}
              </div>
            )}
            
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[#2C2416] font-semibold text-sm">
                Email
              </Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="voce@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 rounded-lg bg-[#FDF8F3] border-[#D4C9BC]
                           focus:border-[#2D5A4A] focus:ring-[#2D5A4A]/20
                           text-[#2C2416] placeholder:text-[#A89B8C]
                           transition-all" 
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-[#2C2416] font-semibold text-sm">
                  Senha
                </Label>
                <Link 
                  href="/auth/forgot-password" 
                  className="text-xs text-[#2D5A4A] hover:text-[#1E3D32] font-medium"
                >
                  Esqueceu?
                </Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 rounded-lg bg-[#FDF8F3] border-[#D4C9BC]
                           focus:border-[#2D5A4A] focus:ring-[#2D5A4A]/20
                           text-[#2C2416] placeholder:text-[#A89B8C]
                           transition-all" 
              />
            </div>
            
            <CardFooter className="flex flex-col gap-4 pb-0 px-0 pt-2">
              <Button 
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-lg font-semibold
                           bg-[#2D5A4A] hover:bg-[#1E3D32] text-[#FDF8F3]
                           shadow-sm
                           transition-all duration-200 hover:shadow-md
                           disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  "Entrar"
                )}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-4 pb-8 pt-0">
          <p className="text-center text-sm text-[#8B7D6B]">
            Não tem uma conta?{" "}
            <Link 
              href="/auth/register" 
              className="font-semibold text-[#2D5A4A] hover:text-[#1E3D32]"
            >
              Criar agora
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
