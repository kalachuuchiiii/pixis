import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, ArrowRight } from "lucide-react";
import { ModeToggle } from "../components/ModeToggle";
import { Pixis, PixisAvatar } from "@/components/ui/PixisAvatar";
import type { Message, Mode } from "../types/assistant.types";
import { MessageBubble } from "../components/MessageBubble";
import { GenerateFlashcardAssistant } from "../components/GenerateFlashcardAssistant";
import { GreetingCard } from "../components/GreetingCard";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const ChatAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [hasStarted, setHasStarted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (text?: string) => {
    const content = text ?? input.trim();
    if (!content) return;

    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      content,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setHasStarted(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = input.trim().length > 0;

  return (
    <>
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-5">
        {/* Greeting */}

        {/* Quick-start suggestions — only before first message */}
        {!hasStarted && (
          <div className="ml-[40px]">
            <p className="text-[12px] text-zinc-400 flex items-center gap-1.5">
              <Sparkles size={12} />
              Things you can ask Pixis
            </p>
            <div className="mt-2 flex flex-col gap-2">
              {[
                "Explain the difference between active and passive recall",
                "What's the best way to study for a math exam?",
                "Break down the water cycle for me",
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="flex items-center gap-2 text-left  px-3.5 py-2.5 rounded-xl border border-zinc-200 bg-white text-[12.5px] text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900 transition-all group max-w-md"
                >
                  <span className="flex-1">{q}</span>
                  <ArrowRight
                    size={12}
                    className="text-zinc-300 group-hover:text-zinc-500 flex-shrink-0 transition-colors"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        <main className="max-h-[80vh] p-2 space-y-2">
          <GreetingCard mode="chat" />
          {/* Conversation messages */}
          {messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} />
          ))}
        </main>
        <div ref={bottomRef} />
      </div>
      <div className="flex-shrink-0  px-4 sm:px-8 py-4">
        <div className="flex items-end gap-2    rounded-2xl px-4 py-3 focus-within:border-zinc-400  transition-colors">
          <Textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Pixis anything…"
            className="flex-1 bg-transparent dark:text-white resize-none text-[13.5px] text-zinc-800 placeholder:text-zinc-400 outline-none leading-relaxed max-h-[140px] overflow-y-auto"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          />

          <Button
            type="button"
            onClick={() => handleSend()}
            disabled={!canSend}
            size="icon"
            className={`h-10 w-10 rounded-xl transition-all ${
              canSend
                ? "bg-zinc-900 hover:bg-zinc-950 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 shadow-sm"
                : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed"
            }`}
          >
            <Send size={14} strokeWidth={2} />
          </Button>
        </div>

        <p className="text-center text-[11px] text-zinc-300 mt-2.5">
          Pixis may make mistakes. Verify important information.
        </p>
      </div>
    </>
  );
};

const AssistantPage = () => {
  const [mode, setMode] = useState<Mode>("generate");

  return (
    <div
      className="flex flex-col  h-[84.5vh]"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b dark:border-zinc-800 border-zinc-100  flex-shrink-0 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center">
            <PixisAvatar />
          </div>
          <div>
            <Pixis />
            <p className="text-[11px] text-zinc-400 leading-tight">
              Your study companion
            </p>
          </div>
        </div>
        <ModeToggle mode={mode} onChange={setMode} />
      </div>

      {mode === "generate" ? <GenerateFlashcardAssistant /> : <ChatAssistant />}
    </div>
  );
};

export default AssistantPage;
