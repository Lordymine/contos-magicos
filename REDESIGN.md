# Redesign CSS - Contos Mágicos

## Objetivo
Refazer TODO o CSS do projeto com design system consistente baseado em floresta encantada e pergaminho mágico.

## Design System

### Paleta de Cores
- **Background/Pergaminho:** `#FDF8F3` (warm cream)
- **Foreground/Texto:** `#2C2416` (dark wood/coffee)
- **Primary (Botões principais):** `#2D5A4A` (forest green)
- **Primary Hover:** `#1E3D32` (darker forest green)
- **Primary Foreground:** `#FDF8F3` (cream text on green)
- **Secondary:** `#C9A227` (golden amber)
- **Secondary Hover:** `#A8841D` (darker gold)
- **Accent/Soft:** `#E8F3EF` (soft mint green)
- **Border:** `#E8DFD4` (warm beige)
- **Border Strong:** `#D4C9BC` (stronger beige)
- **Muted:** `#F5EDE4` (parchment)
- **Muted Foreground:** `#8B7D6B` (warm gray-brown)
- **Destructive:** `#A94442` (earth red)
- **Destructive Soft:** `#FBE8E7` (soft red background)
- **Success:** `#4A7C59` (soft green)

### Tipografia
- Fonte: Inter (já configurada no projeto)
- Headings: Bold, cor `#2C2416`
- Body: Regular, cor `#2C2416`
- Muted: `#8B7D6B`

### Spacing & Radius
- Base unit: 4px
- Card padding: `p-6` ou `p-8`
- Input/Button height: `h-12` (48px) ou `h-14` (56px)
- Radius inputs/buttons: `rounded-xl` (12px) ou `rounded-2xl` (16px)
- Radius cards: `rounded-2xl` (16px)

### Sombras (Layered Shadows Strategy)
- Card default: `shadow-sm`
- Card hover: `shadow-md` ou `shadow-lg`
- Botão: `shadow-sm` que cresce no hover
- NUNCA sombras dramáticas

### Bordas (Soft Borders Strategy)
- Sempre sutis: `border-[#E8DFD4]`
- Cards: `border border-[#E8DFD4]`
- Inputs: `border-2 border-[#D4C9BC]` foco em `#2D5A4A`
- NUNCA bordas pretas ou duras

## Arquivos para Atualizar

### 1. src/app/globals.css
- Definir todas as CSS variables
- Configurar tema completo
- Remover cores antigas (azul #2563EB, cinza #FAFAFA)

### 2. src/components/ui/button.tsx
- Variant default: bg-[#2D5A4A], text-[#FDF8F3]
- Variant outline: border-[#D4C9BC], hover:bg-[#F5EDE4]
- Variant ghost: hover:bg-[#F5EDE4]
- Variant destructive: bg-[#A94442]
- Size lg: h-12 ou h-14
- Radius: rounded-xl

### 3. src/components/ui/input.tsx
- Height: h-12
- Border: border-2 border-[#D4C9BC]
- Focus: focus:border-[#2D5A4A] focus:ring-[#2D5A4A]/20
- Background: bg-[#FDF8F3]
- Text: text-[#2C2416]
- Placeholder: placeholder:text-[#A89B8C]

### 4. src/components/ui/card.tsx
- Background: bg-[#FDF8F3]
- Border: border border-[#E8DFD4]
- Radius: rounded-2xl
- Shadow: shadow-sm

### 5. src/components/ui/textarea.tsx
- Similar ao input
- Resize: resize-none
- Rows padrão: 4

### 6. Páginas para refatorar:
- src/app/auth/login/page.tsx
- src/app/auth/register/page.tsx
- src/app/profile/page.tsx
- src/app/notifications/page.tsx
- src/app/page.tsx

### 7. Componentes de história:
- src/features/stories/components/StoryCard.tsx
- src/features/stories/components/StoryList.tsx
- src/features/stories/components/StoryView.tsx
- src/features/stories/components/StoryForm.tsx

## Regras Importantes
1. NUNCA usar azul #2563EB
2. NUNCA usar fundo cinza #FAFAFA
3. TODAS as cores devem vir do design system acima
4. Bordas sempre sutis (#E8DFD4 ou #D4C9BC)
5. Sombras em camadas sutis
6. Manter acessibilidade (contraste adequado)
7. Estados de hover sempre suaves (transition-all duration-200)

## Comando para executar
Execute todos os arquivos acima, aplicando o design system consistentemente.
