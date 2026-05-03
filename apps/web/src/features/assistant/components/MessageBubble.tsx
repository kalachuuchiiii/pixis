import { PixisAvatar } from "@/components/ui/PixisAvatar";
import { FileText } from "lucide-react";
import type { Message } from "../types/assistant.types";
import { FlashcardPreview } from "./FlashcardPreview";
import clsx from "clsx";

export const MessageBubble = ({ msg }: { msg: Message }) => {
  const isUser = msg.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {!isUser && <PixisAvatar size={28} />}

      <div
        className={`max-w-[78%] ${isUser ? "items-end" : "items-start"} flex flex-col gap-1`}
      >
        {msg.attachment && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-zinc-200 bg-zinc-50 text-[12px] text-zinc-600 max-w-fit">
            <FileText size={13} className="text-zinc-400" />
            <span className="font-medium truncate max-w-[160px]">
              {msg.attachment}
            </span>
          </div>
        )}
        {msg.content && (
          <div
            className={clsx(
              `px-4 py-3 rounded-2xl text-[13.5px] leading-relaxed`,
              isUser
                ? "bg-zinc-900 text-white rounded-tr-sm"
                : "bg-white border border-zinc-200 text-zinc-800 rounded-tl-sm"
            )}
          >
            {msg.content}
          </div>
        )}
        {msg.cards && <FlashcardPreview cards={msg.cards} />}
      </div>
    </div>
  );
};
