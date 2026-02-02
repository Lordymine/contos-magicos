# Contos Mágicos 🪄

**Contos Mágicos** é uma plataforma encantadora que utiliza inteligência artificial para criar histórias infantis personalizadas, únicas e educativas. Projetada para despertar a imaginação e promover momentos mágicos de leitura entre pais e filhos.

![Magic Book Interface](public/file.svg) <!-- Placeholder for a screenshot if we had one -->

## ✨ Funcionalidades

-   **Criação de Histórias com IA:** Gere contos personalizados escolhendo tema, faixa etária e ideias principais.
-   **Design Infantil Amigável:** Interface "Flat Design 2.0" com cores vibrantes (Coral, Teal, Amarelo), tipografia arredondada (`Nunito`) e estética de livro de histórias.
-   **Biblioteca de Histórias:** Explore histórias criadas pela comunidade.
-   **Interação Social:** Curta e comente nas suas histórias favoritas.
-   **Perfil do Autor:** Gerencie suas histórias criadas em uma área dedicada (`/profile`).
-   **Notificações:** Fique por dentro de interações em suas histórias.
-   **Página Sobre:** Conheça nossa missão e valores (`/about`).

## 🛠️ Tecnologias

-   **Framework:** [Next.js 16.1.6](https://nextjs.org/) (App Router)
-   **Linguagem:** TypeScript
-   **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/)
-   **Componentes:** Shadcn/ui (customizados)
-   **Fonte:** Nunito (via `next/font`)
-   **Testes:** Vitest (Unit) & Playwright (E2E)

## 🚀 Como Rodar

1.  Clone o repositório:
    ```bash
    git clone https://github.com/seu-usuario/contos-magicos.git
    cd contos-magicos
    ```

2.  Instale as dependências:
    ```bash
    npm install
    ```

3.  Configure as variáveis de ambiente (`.env`):
    ```env
    DATABASE_URL="postgresql://..."
    AUTH_SECRET="..."
    # Adicione outras chaves necessárias (OpenAI, etc.)
    ```

4.  Rode as migrações do banco de dados:
    ```bash
    npm run db:migrate
    ```

5.  Inicie o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```

Acesse [http://localhost:3000](http://localhost:3000) para ver a magia acontecer!

## 🧪 Testes

-   **Unitários:** `npm run test`
-   **E2E:** `npm run test:e2e`

## 🎨 Design System

O projeto utiliza um sistema de design focado em crianças:
-   **Paleta:** Cores quentes e acolhedoras (#FF6B6B Coral, #4ECDC4 Teal, #FFD93D Gold).
-   **Formas:** Bordas arredondadas (Rounded-2xl/3xl) para segurança e amabilidade.
-   **Tipografia:** Nunito - altamente legível e com personalidade arredondada.

---

Feito com ❤️ para pequenos leitores e grandes sonhadores.
