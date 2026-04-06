import { PixisAvatar } from "@/components/ui/PixisAvatar";
import type { Mode } from "../types/assistant.types";


export const GreetingCard = ({ mode }: { mode: Mode }) => (
  <div className="flex gap-3">
    <PixisAvatar size={28} />
    <div className="flex-1">
      <div className="bg-white border border-stone-200 rounded-2xl rounded-tl-sm px-5 py-4 text-[13.5px] text-stone-800 leading-relaxed">
        <p className="font-semibold text-stone-900 mb-1">
          Hey, I'm Pixis 👋
        </p>
        {mode === 'generate'
          ? "I'm in flashcard mode. Give me a topic, paste your notes, or upload a PDF — I'll turn it into a study-ready deck instantly."
          : "I'm your study companion. Ask me anything — how to study smarter, explain a concept, or help you understand tricky material."}
      </div>
    </div>
  </div>
)