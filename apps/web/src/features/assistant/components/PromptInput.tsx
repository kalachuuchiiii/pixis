import {
  InputGroup,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { ArrowUp } from "lucide-react";
import type { UseAssistantChatReturn } from "../hooks/useAssistantChat";

export const PromptInput = ({ ...props }: UseAssistantChatReturn) => {
  const { setPrompt, handleChangePrompt, prompt, sendPrompt, isSendingPrompt } =
    props;
  return (
    <div className="fixed bottom-0 flex flex-col items-center gap-1 my-2">
      <main className="max-w-7xl lg:w-[75vw]  rounded-4xl w-[88vw] space-y-2 mx-auto bg-background  p-1  z-40 ">
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
