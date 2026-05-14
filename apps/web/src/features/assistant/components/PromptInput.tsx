import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { ArrowUp, Astroid, PaperclipIcon, X } from "lucide-react";
import loading from "/loading.gif";
import type { UseAssistantChatReturn } from "../hooks/useAssistantChat";
import { PixisAvatar } from "@/components/ui/PixisAvatar";
import { memo, useRef } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const PromptInput = memo(({ ...props }: UseAssistantChatReturn) => {
  const {
    handleChangePrompt,
    prompt,
    handleChangePdf,
    sendPrompt,
    pdf,
    clearPdf,
    isSendingPrompt,
  } = props;

  const pdfInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="fixed max-w-7xl w-full bottom-0 left-0 lg:left-auto flex flex-col items-start  my-2">
      {isSendingPrompt && (
        <div className="flex items-start  bg-white dark:bg-zinc-950 w-fit px-6 py-2 rounded-t-4xl gap-2 ">
          <img src={loading} />{" "}
          <p className="font-medium opacity-75 animate-pulse">
            pixis is thinking...
          </p>
        </div>
      )}

      <main className="max-w-7xl  w-full  lg:w-[75vw] rounded-r-4xl rounded-bl-4xl shrink-0  space-y-2 w-11/12 mx bg-white dark:bg-zinc-950  p-1  z-40 ">
        <InputGroup className="flex w-full flex-col h-full  items-start gap-2 border  border-border/60 rounded-3xl p-2 shadow-xl shadow-black/5 transition-all focus-within:border-primary/30 focus-within:shadow-2xl focus-within:-translate-y-0.5">
          {!!pdf && (
            <InputGroupAddon>
              <p>{pdf.name}</p>{" "}
              <button onClick={clearPdf}>
                {" "}
                <X className="lg:size-4 size-2" />{" "}
              </button>
            </InputGroupAddon>
          )}
          <div className="flex items-end w-full">
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
              className=" border-0 grow-1 w-full focus-visible:ring-0   focus-visible:ring-offset-0 text-lg placeholder:text-muted-foreground/70 min-h-[58px] max-h-[180px] resize-none "
              placeholder="Generate sets, or talk with pixis"
            />
            <input
              hidden
              ref={pdfInputRef}
              onChange={handleChangePdf}
              type="file"
              onAbortCapture={(e) => e.preventDefault()}
              accept="application/pdf"
            />
            <div className="flex items-end lg:gap-1 gap-2">
              <Tooltip>
                <TooltipTrigger>
                  <InputGroupButton
                    variant="secondary"
                    onClick={() => pdfInputRef.current?.click()}
                    disabled={isSendingPrompt}
                    className="my-btn"
                  >
                    <PaperclipIcon />
                  </InputGroupButton>
                </TooltipTrigger>
                <TooltipContent>
                  PDF import (Can read up to 3 pages only){" "}
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <InputGroupButton
                    variant="default"
                    className="my-btn"
                    onClick={() => !isSendingPrompt && sendPrompt()}
                    disabled={isSendingPrompt || !prompt.trim()}
                  >
                    <ArrowUp className=" text-primary-foreground" />
                  </InputGroupButton>
                </TooltipTrigger>
                <TooltipContent>Send prompt</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </InputGroup>
      </main>
    </div>
  );
});
