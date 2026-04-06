import { useState, useRef, useEffect } from 'react'
import {
  Layers,
  MessageCircle,
  Paperclip,
  Send,
  X,
  FileText,
  ChevronDown,
  Sparkles,
  ArrowRight,
} from 'lucide-react'
import { ModeToggle } from '../components/ModeToggle'
import { PixisAvatar } from '@/components/ui/PixisAvatar';
import type { Message, Mode } from '../types/assistant.types';
import { MessageBubble } from '../components/MessageBubble';
import { GenerateFlashcardAssistant } from '../components/GenerateFlashcardAssistant';
import { GreetingCard } from '../components/GreetingCard';
import { Textarea } from '@/components/ui/textarea';

// ── Bolt icon ──────────────────────────────────────────────────────────────
const BoltIcon = ({ size = 13, color = 'white' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
)
// ── Greeting card ──────────────────────────────────────────────────────────


// ── Mode toggle ────────────────────────────────────────────────────────────


// ── Suggestion chips ───────────────────────────────────────────────────────

// ── Chat Assistant Component (standalone) ──────────────────────────────────
const ChatAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [hasStarted, setHasStarted] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])


  const handleSend = (text?: string) => {
    const content = text ?? input.trim()
    if (!content) return

    const userMsg: Message = {
      id: Date.now(),
      role: 'user',
      content,
    }

    setMessages(prev => [...prev, userMsg])
    setInput('')
    setHasStarted(true)

    // TODO: Integrate real AI backend here
    // Example: fetch AI response and do setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: aiReply }])
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const canSend = input.trim().length > 0

  return (
    <>
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-5">
        {/* Greeting */}
        <GreetingCard mode="chat" />

        {/* Quick-start suggestions — only before first message */}
        {!hasStarted && (
          <div className="ml-[40px]">
            <p className="text-[12px] text-stone-400 flex items-center gap-1.5">
              <Sparkles size={12} />
              Things you can ask Pixis
            </p>
            <div className="mt-2 flex flex-col gap-2">
              {[
                'Explain the difference between active and passive recall',
                "What's the best way to study for a math exam?",
                'Break down the water cycle for me',
              ].map(q => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="flex items-center gap-2 text-left px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-[12.5px] text-stone-600 hover:border-stone-300 hover:bg-stone-50 hover:text-stone-900 transition-all group max-w-md"
                >
                  <span className="flex-1">{q}</span>
                  <ArrowRight size={12} className="text-stone-300 group-hover:text-stone-500 flex-shrink-0 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Conversation messages */}
        {messages.map(msg => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="flex-shrink-0 border-t border-stone-100 bg-white px-4 sm:px-8 py-4">
        <div className="flex items-end gap-2 bg-stone-50 border border-stone-200 rounded-2xl px-4 py-3 focus-within:border-stone-400 focus-within:bg-white transition-colors">
          <Textarea
            rows={1}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Pixis anything…"
            className="flex-1 bg-transparent resize-none text-[13.5px] text-stone-800 placeholder:text-stone-400 outline-none leading-relaxed max-h-[140px] overflow-y-auto"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          />

          {/* Mode badge */}
          <div className="flex-shrink-0 self-end mb-0.5 flex items-center gap-1 px-2 py-1 rounded-lg text-[10.5px] font-semibold hidden sm:flex bg-sky-50 text-sky-600">
            <MessageCircle size={11} />
            Chat
          </div>

          <button
            onClick={() => handleSend()}
            disabled={!canSend}
            className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center self-end mb-0.5 transition-all ${
              canSend
                ? 'bg-stone-900 text-white hover:opacity-80'
                : 'bg-stone-100 text-stone-300 cursor-not-allowed'
            }`}
          >
            <Send size={14} strokeWidth={2} />
          </button>
        </div>

        <p className="text-center text-[11px] text-stone-300 mt-2.5">
          Pixis may make mistakes. Verify important information.
        </p>
      </div>
    </>
  )
}

// ── Generate Flashcard Assistant Component (standalone) ────────────────────

// ── Main page (mode switcher) ──────────────────────────────────────────────
const AssistantPage = () => {
  const [mode, setMode] = useState<Mode>('generate')

  return (
    <div
      className="flex flex-col h-[calc(100vh-60px)] bg-white"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-stone-100 bg-white flex-shrink-0 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-stone-900 flex items-center justify-center">
            <BoltIcon size={14} />
          </div>
          <div>
            <p className="text-[14px] font-semibold text-stone-900 leading-tight">Pixis AI</p>
            <p className="text-[11px] text-stone-400 leading-tight">Your study companion</p>
          </div>
        </div>
        <ModeToggle mode={mode} onChange={setMode} />
      </div>

      {/* Render the correct mode component (each has its own isolated state) */}
      {mode === 'generate' ? <GenerateFlashcardAssistant /> : <ChatAssistant />}
    </div>
  )
}

export default AssistantPage