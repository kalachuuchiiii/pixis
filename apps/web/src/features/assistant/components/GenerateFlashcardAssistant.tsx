import { FileText, Layers, Paperclip, Send, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MessageBubble } from "./MessageBubble";
import { SuggestionChips } from "./SuggestionChips";
import { GreetingCard } from "./GreetingCard";
import { Textarea } from "@/components/ui/textarea";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  attachment?: string;
  cards?: { q: string; a: string }[];
}

export const GenerateFlashcardAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [attachment, setAttachment] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (text?: string) => {
    const content = text ?? input.trim();
    if (!content && !attachment) return;

    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      content: content || "",
      attachment: attachment ?? undefined,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setAttachment(null);
    setHasStarted(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAttachment(file.name);
    e.target.value = "";
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = input.trim().length > 0 || !!attachment;

  return (
    <>
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-5">
        {/* Greeting */}
        <GreetingCard mode="generate" />

        {/* Quick-start suggestions — only before first message */}
        {!hasStarted && (
          <div className="flex flex-col gap-3 ml-[40px]">
            <p className="text-[12px] text-stone-400 flex items-center gap-1.5">
              <Sparkles size={12} />
              Quick start — pick a topic
            </p>
            <SuggestionChips onSelect={(t) => handleSend(t)} />
          </div>
        )}

        {/* Conversation messages */}
        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}

        <div ref={bottomRef} />
      </div>

      {/* Input area (Generate mode only) */}
      <div className="flex-shrink-0 border-t border-stone-100 bg-white px-4 sm:px-8 py-4">
        {/* Attachment preview */}
        {attachment && (
          <div className="mb-2 flex items-center gap-2 px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 w-fit max-w-full">
            <FileText size={13} className="text-stone-400 flex-shrink-0" />
            <span className="text-[12.5px] text-stone-600 font-medium truncate max-w-[200px]">
              {attachment}
            </span>
            <button
              onClick={() => setAttachment(null)}
              className="text-stone-300 hover:text-stone-600 transition-colors ml-1 flex-shrink-0"
            >
              <X size={13} />
            </button>
          </div>
        )}

        <div className="flex items-end gap-2 bg-stone-50 border border-stone-200 rounded-2xl px-4 py-3 focus-within:border-stone-400 focus-within:bg-white transition-colors">
          {/* PDF upload button */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors self-end mb-0.5"
            title="Upload PDF"
          >
            <Paperclip size={15} strokeWidth={1.8} />
          </button>

          <Textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter a topic, paste notes, or upload a PDF…"
            className="flex-1 bg-transparent resize-none text-[13.5px] text-stone-800 placeholder:text-stone-400 outline-none leading-relaxed max-h-[140px] overflow-y-auto"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          />

          {/* Mode badge */}
          <div className="flex-shrink-0 self-end mb-0.5 flex items-center gap-1 px-2 py-1 rounded-lg text-[10.5px] font-semibold hidden sm:flex bg-amber-50 text-amber-600">
            <Layers size={11} />
            Generate
          </div>

          <button
            onClick={() => handleSend()}
            disabled={!canSend}
            className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center self-end mb-0.5 transition-all ${
              canSend
                ? "bg-stone-900 text-white hover:opacity-80"
                : "bg-stone-100 text-stone-300 cursor-not-allowed"
            }`}
          >
            <Send size={14} strokeWidth={2} />
          </button>
        </div>

        <p className="text-center text-[11px] text-stone-300 mt-2.5">
          Pixis can generate up to 20 cards per deck · PDF up to 10MB
        </p>
      </div>
    </>
  );
};
