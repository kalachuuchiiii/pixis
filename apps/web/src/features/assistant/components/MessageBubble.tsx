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
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 text-[12px] text-stone-600 max-w-fit">
            <FileText size={13} className="text-stone-400" />
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
                ? "bg-stone-900 text-white rounded-tr-sm"
                : "bg-white border border-stone-200 text-stone-800 rounded-tl-sm"
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
