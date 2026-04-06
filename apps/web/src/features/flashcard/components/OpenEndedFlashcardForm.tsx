import type { Flashcard } from "@pixis/schemas";
import { useState, type ChangeEvent } from "react";
import { Edit3, CheckCircle } from "lucide-react"; // optional but recommended

export const OpenEndedFlashcardForm = () => {
  const [flashcard, setFlashcard] = useState<
    Flashcard & { type: "open_ended" }
  >({
    question: "",
    answer: "",
    choices: null,
    type: "open_ended",
  });

  const handleQuestionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setFlashcard((prev) => ({ ...prev, question: e.target.value }));
  };

  const handleAnswerChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setFlashcard((prev) => ({ ...prev, answer: e.target.value }));
  };

  return (
    <div className="bg-white  w-full  mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-10">
           <div className="py-2">
         <h1 className="text-[10px] font-semibold tracking-[0.18em] uppercase text-stone-400 mb-2">
          New Flashcard
        </h1>
        <h1
          className="text-[28px] font-normal text-stone-900 leading-tight"
          style={{ fontFamily: "'DM Serif Display', serif" }}
        >
          Open-Ended
        </h1>
       </div>
      </div>

      {/* Question */}
      <div className="mb-10">
        <label className="block text-xs font-semibold tracking-widest uppercase text-stone-500 mb-3 flex items-center gap-2">
          <Edit3 size={16} className="text-sky-600" />
          QUESTION
        </label>
        <textarea
          value={flashcard.question}
          onChange={handleQuestionChange}
          placeholder="What is the capital of France? Or explain the process of photosynthesis..."
          rows={4}
          className="w-full resize-y min-h-[120px] bg-stone-50 border border-stone-200 focus:border-sky-400 rounded-2xl px-6 py-5 text-[15px] focus:outline-none transition-colors leading-relaxed"
        />
      </div>

      {/* Answer */}
      <div>
        <label className="block text-xs font-semibold tracking-widest uppercase text-stone-500 mb-3 flex items-center gap-2">
          <CheckCircle size={16} className="text-emerald-600" />
          ACCEPTED ANSWER
        </label>
        <textarea
          value={flashcard.answer}
          onChange={handleAnswerChange}
          placeholder="Enter the correct answer or explanation..."
          rows={1}
          className="w-full resize-y min-h-[100px] bg-stone-50 border border-stone-200 focus:border-sky-400 rounded-2xl px-6 py-5 text-[15px] focus:outline-none transition-colors leading-relaxed"
        />

        <p className="mt-3 text-xs text-stone-400 flex items-start gap-2">
          💡 Tip: Be specific and clear. Students can write their answers in their own words.
        </p>
      </div>
    </div>
  );
};