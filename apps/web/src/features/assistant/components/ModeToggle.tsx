import { Layers, MessageCircle } from "lucide-react";

type Mode = 'chat' | 'generate'

export const ModeToggle = ({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) => (
  <div className="inline-flex items-center p-1 bg-stone-100 rounded-xl gap-1">
    <button
      onClick={() => onChange('generate')}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12.5px] font-medium transition-all ${
        mode === 'generate'
          ? 'bg-white text-stone-900 shadow-sm border border-stone-200'
          : 'text-stone-500 hover:text-stone-700'
      }`}
    >
      <Layers size={13} strokeWidth={mode === 'generate' ? 2.2 : 1.8} />
      Generate flashcards
    </button>
    <button
      onClick={() => onChange('chat')}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12.5px] font-medium transition-all ${
        mode === 'chat'
          ? 'bg-white text-stone-900 shadow-sm border border-stone-200'
          : 'text-stone-500 hover:text-stone-700'
      }`}
    >
      <MessageCircle size={13} strokeWidth={mode === 'chat' ? 2.2 : 1.8} />
      Talk to Pixis
    </button>
  </div>
)