import type { GenerateStoryInput } from '@/domains/story/types'
import type { StoryGenerator } from '@/domains/story/service'

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

const THEME_PROMPTS: Record<string, string> = {
  adventure: 'Uma emocionante aventura cheia de descobertas',
  fantasy: 'Um mundo mágico com criaturas fantásticas',
  animals: 'Uma história com animais falantes e amigáveis',
  friendship: 'Uma história sobre a importância da amizade',
  nature: 'Uma história sobre a natureza e o meio ambiente',
  space: 'Uma aventura espacial entre planetas e estrelas',
  fairytale: 'Um conto de fadas clássico',
  mystery: 'Um mistério divertido para resolver',
}

const AGE_GUIDELINES: Record<string, string> = {
  '3-5': 'Use frases curtas e simples. Vocabulário básico. Muita repetição. Máximo 300 palavras.',
  '6-8': 'Frases um pouco mais complexas. Introduza novas palavras. Máximo 500 palavras.',
  '9-12': 'Linguagem mais elaborada. Pode incluir moral da história. Máximo 800 palavras.',
}

export class OpenRouterStoryGenerator implements StoryGenerator {
  private rateLimitTokens: number[] = []
  private readonly maxRequestsPerMinute = 10

  constructor(private readonly apiKey: string) {
    if (!apiKey) {
      throw new Error('OPENROUTER_API_KEY is required')
    }
  }

  private checkRateLimit(): void {
    const now = Date.now()
    const oneMinuteAgo = now - 60000

    this.rateLimitTokens = this.rateLimitTokens.filter(t => t > oneMinuteAgo)

    if (this.rateLimitTokens.length >= this.maxRequestsPerMinute) {
      throw new Error('Rate limit exceeded. Please try again later.')
    }

    this.rateLimitTokens.push(now)
  }

  async generate(input: GenerateStoryInput): Promise<{ title: string; content: string }> {
    this.checkRateLimit()

    const themeDescription = THEME_PROMPTS[input.theme] || input.theme
    const ageGuideline = AGE_GUIDELINES[input.ageGroup]

    const systemPrompt = `Você é um contador de histórias infantis profissional.
Crie histórias encantadoras, educativas e apropriadas para crianças.
Sempre escreva em português brasileiro.
${ageGuideline}

A história deve ser:
- Positiva e edificante
- Sem violência ou conteúdo assustador
- Com uma lição ou moral sutil
- Envolvente e divertida`

    const userPrompt = `Crie uma história infantil com o tema: ${themeDescription}
${input.characterName ? `O personagem principal se chama: ${input.characterName}` : ''}

Contexto adicional do usuário: ${input.prompt}

Responda EXATAMENTE no seguinte formato JSON (sem markdown):
{"title": "Título da História", "content": "Conteúdo completo da história..."}`

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'Contos Mágicos',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.1-8b-instruct:free',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.8,
        max_tokens: 2000,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`OpenRouter API error: ${error}`)
    }

    const data: OpenRouterResponse = await response.json()
    const content = data.choices[0]?.message?.content

    if (!content) {
      throw new Error('No content returned from OpenRouter')
    }

    try {
      const parsed = JSON.parse(content)
      return {
        title: parsed.title || 'História Mágica',
        content: parsed.content || content,
      }
    } catch {
      const titleMatch = content.match(/^#?\s*(.+?)[\n\r]/)
      return {
        title: titleMatch?.[1] || 'História Mágica',
        content: content,
      }
    }
  }
}
