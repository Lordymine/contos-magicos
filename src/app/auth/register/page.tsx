import Link from "next/link"
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
import { Chrome, ArrowLeft, User, Mail, Lock, Shield, Zap, Heart } from "lucide-react"

export default function RegisterPage() {
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
            <User className="h-6 w-6 text-[#2D5A4A]" />
          </div>
          <CardTitle className="text-2xl font-bold text-[#2C2416]">
            Crie sua conta
          </CardTitle>
          <CardDescription className="text-[#8B7D6B]">
            Comece a criar histórias personalizadas hoje
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Google Sign Up */}
          <Button 
            variant="outline" 
            className="w-full h-12 rounded-lg border-[#D4C9BC] 
                       text-[#2C2416] hover:bg-[#F5EDE4] font-semibold
                       transition-all duration-200"
          >
            <Chrome className="mr-2 h-5 w-5 text-[#2D5A4A]" />
            Registrar com Google
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
          <form className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-[#2C2416] font-semibold text-sm">
                Nome
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A89B8C]" />
                <Input 
                  id="name" 
                  type="text" 
                  placeholder="Seu nome completo" 
                  className="h-12 rounded-lg bg-[#FDF8F3] border-[#D4C9BC] pl-10
                             focus:border-[#2D5A4A] focus:ring-[#2D5A4A]/20
                             text-[#2C2416] placeholder:text-[#A89B8C]
                             transition-all" 
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[#2C2416] font-semibold text-sm">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A89B8C]" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="voce@exemplo.com" 
                  className="h-12 rounded-lg bg-[#FDF8F3] border-[#D4C9BC] pl-10
                             focus:border-[#2D5A4A] focus:ring-[#2D5A4A]/20
                             text-[#2C2416] placeholder:text-[#A89B8C]
                             transition-all" 
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-[#2C2416] font-semibold text-sm">
                Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A89B8C]" />
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Crie uma senha forte"
                  className="h-12 rounded-lg bg-[#FDF8F3] border-[#D4C9BC] pl-10
                             focus:border-[#2D5A4A] focus:ring-[#2D5A4A]/20
                             text-[#2C2416] placeholder:text-[#A89B8C]
                             transition-all" 
                />
              </div>
            </div>
          </form>
          
          {/* Benefits */}
          <div className="flex items-center justify-center gap-4 pt-2 text-xs text-[#8B7D6B]">
            <div className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-[#C9A227]" />
              <span>Gratuito</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-[#4A7C59]" />
              <span>Seguro</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Heart className="h-3.5 w-3.5 text-[#A94442]" />
              <span>Sem anúncios</span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-4 pb-8">
          <Button 
            className="w-full h-12 rounded-lg font-semibold
                       bg-[#2D5A4A] hover:bg-[#1E3D32] text-[#FDF8F3]
                       shadow-sm
                       transition-all duration-200 hover:shadow-md"
          >
            Criar conta
          </Button>
          
          <p className="text-center text-sm text-[#8B7D6B]">
            Já tem uma conta?{" "}
            <Link 
              href="/auth/login" 
              className="font-semibold text-[#2D5A4A] hover:text-[#1E3D32]"
            >
              Entrar
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
