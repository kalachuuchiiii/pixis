
const SUGGESTIONS: { label: string; topic: string; emoji: string }[] = [
  { label: 'Cell Biology', topic: 'Generate flashcards about cell biology: organelles, cell cycle, and membrane transport.', emoji: '🧬' },
  { label: 'Algebra',      topic: 'Generate flashcards covering algebra: linear equations, quadratics, and polynomials.', emoji: '📐' },
  { label: 'English Vocab', topic: 'Generate flashcards for advanced English vocabulary with definitions and examples.', emoji: '📖' },
  { label: 'World History', topic: 'Generate flashcards about key events in world history from 1800 to 1950.', emoji: '🌍' },
  { label: 'Chemistry',    topic: 'Generate flashcards for chemistry: periodic table, bonding, and reactions.', emoji: '⚗️' },
  { label: 'Physics',      topic: 'Generate flashcards for physics: Newton\'s laws, thermodynamics, and waves.', emoji: '🔭' },
]

export const SuggestionChips = ({ onSelect }: { onSelect: (topic: string) => void }) => (
  <div className="flex flex-wrap gap-2">
    {SUGGESTIONS.map(s => (
      <button
        key={s.label}
        onClick={() => onSelect(s.topic)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-stone-200 bg-white text-[12.5px] text-stone-600 font-medium hover:border-stone-300 hover:bg-stone-50 hover:text-stone-900 transition-all"
      >
        <span className="text-[13px]">{s.emoji}</span>
        {s.label}
      </button>
    ))}
  </div>
)
