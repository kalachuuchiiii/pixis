import {
  InputGroup,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { ArrowUp, Astroid } from "lucide-react";
import loading from "/loading.gif";
import type { UseAssistantChatReturn } from "../hooks/useAssistantChat";
import { PixisAvatar } from "@/components/ui/PixisAvatar";

export const PromptInput = ({ ...props }: UseAssistantChatReturn) => {
  const { setPrompt, handleChangePrompt, prompt, sendPrompt, isSendingPrompt } =
    props;
  return (
    <div className="fixed bottom-0 flex flex-col items-start  my-2">
      {isSendingPrompt && (
        <div className="flex items-start bg-zinc-950 w-fit px-6 py-2 rounded-t-4xl gap-2 ">
          <img src={loading} />{" "}
          <p className="font-medium opacity-75 animate-pulse">
            pixis is thinking...
          </p>
        </div>
      )}
      <main className="max-w-7xl lg:w-[75vw] rounded-r-4xl rounded-bl-4xl  w-[88vw] space-y-2 mx-auto bg-zinc-950  p-1  z-40 ">
        <InputGroup className="flex  items-end gap-2 border  border-border/60 rounded-3xl p-2 shadow-xl shadow-black/5 transition-all focus-within:border-primary/30 focus-within:shadow-2xl focus-within:-translate-y-0.5">
          <InputGroupTextarea
            onChange={handleChangePrompt}
            value={prompt}
            rows={1}
            onKeyDown={(e) => {
              if (!e.shiftKey && e.key === "Enter" && prompt.trim()) {
                e.preventDefault();
                if (!isSendingPrompt) sendPrompt();
              }
            }}
            className=" border-0 focus-visible:ring-0  focus-visible:ring-offset-0 text-lg placeholder:text-muted-foreground/70 min-h-[58px] max-h-[180px] resize-y py-4 px-5"
            placeholder="Paste ideas, and generate sets, or talk with pixis"
          />

          <InputGroupButton
            onClick={() => !isSendingPrompt && sendPrompt()}
            disabled={isSendingPrompt || !prompt.trim()}
            className="h-12 w-12 rounded-2xl bg-primary hover:bg-primary/90 shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowUp className="h-6 w-6 text-primary-foreground" />
          </InputGroupButton>
        </InputGroup>
      </main>

      <p className="text-sm opacity-25 hidden lg:block w-full text-center ">
        pixis is a firefly, so low iq - she might hallucinate!
      </p>
    </div>
  );
};
