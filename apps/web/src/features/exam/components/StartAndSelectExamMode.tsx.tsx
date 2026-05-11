import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useSession } from "../../session/hooks/useSession";
import type { Deck } from "@pixis/schemas";

export const StartAndSelectExamMode = ({ deck }: { deck: Deck }) => {
  const { createNewSession, isCreatingNewSession } = useSession();

  return (
    <Dialog>
      <DialogTrigger disabled={deck.flashcardCount === 0}>
        <Button
          disabled={deck.flashcardCount === 0}
          className="my-btn fixed right-10 bottom-10"
        >
          Start Exam <ChevronRight className="size-5 opacity-80" />
        </Button>
      </DialogTrigger>

      <DialogContent
        onCloseAutoFocus={(e) => e.preventDefault()}
        className="max-w-md rounded-2xl p-6"
      >
        <DialogHeader className="space-y-1 text-center">
          <h2 className="text-xl font-semibold tracking-tight">
            Choose your mode
          </h2>
          <p className="text-sm text-muted-foreground">
            Pick how you want to practice this deck
          </p>
        </DialogHeader>

        <div className="mt-6 grid gap-3">
          <button
            onClick={() =>
              createNewSession({ mode: "NORMAL", deckId: deck.id })
            }
            disabled={isCreatingNewSession}
            className="group w-full rounded-xl border p-4 text-left transition-all hover:bg-muted/50"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Normal</p>
                <p className="text-sm text-muted-foreground">
                  No time pressure, focus on learning
                </p>
              </div>
              <ChevronRight className="size-5 opacity-40 group-hover:translate-x-1 transition" />
            </div>
          </button>

          <button
            onClick={() => createNewSession({ mode: "TIMED", deckId: deck.id })}
            disabled={isCreatingNewSession}
            className="group w-full rounded-xl border p-4 text-left transition-all hover:bg-muted/50"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Timed</p>
                <p className="text-sm text-muted-foreground">
                  Answer under time pressure
                </p>
              </div>
              <ChevronRight className="size-5 opacity-40 group-hover:translate-x-1 transition" />
            </div>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
