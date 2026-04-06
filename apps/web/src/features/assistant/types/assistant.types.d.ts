export interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
  attachment?: string
  cards?: { q: string; a: string }[]
}

export type Mode = 'chat' | 'generate'

