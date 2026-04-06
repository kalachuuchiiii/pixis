import { Button } from "@/components/ui/button";
import { ChevronLeft, CreditCard } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CloseEndedFlashcardForm } from "./CloseEndedFlashcardForm";
import { OpenEndedFlashcardForm } from "./OpenEndedFlashcardForm";

import { useState } from "react";
import type { Flashcard } from "@pixis/schemas";
import { useParams } from "react-router-dom";


export const CreateFlashcard = () => {
  const [type, setType] = useState<Flashcard["type"] | "">("");
  const { deckId = 0 } = useParams();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="p-6">New Flashcard</Button>
      </DialogTrigger>

      <DialogContent className="min-w-3xl px-8">
        {type !== "" ? (
          <div className="space-y-4">
            <Button  onClick={() => setType('')} variant={'outline'}>
               <ChevronLeft />
            </Button>
            {type === "close_ended" ? (
              <CloseEndedFlashcardForm deckId = {Number(deckId)} />
            ) : (
              <OpenEndedFlashcardForm  />
            )}
          </div>
        ) : (
          <>
            {" "}
            <DialogHeader>
              <DialogTitle>New Flashcard</DialogTitle>
              <DialogDescription>
                Choose the type of flashcard you want to create
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-3 pt-4">
              <Button
                onClick={() => setType("open_ended")}
                variant="outline"
                className="h-28 flex flex-col gap-2"
              >
                <CreditCard className="w-6 h-6" />
                <div>
                  <p className="font-medium">Open Ended</p>
                  <p className="text-xs text-muted-foreground">Free response</p>
                </div>
              </Button>

              <Button
                onClick={() => setType("close_ended")}
                variant="outline"
                className="h-28 flex flex-col gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 01-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="font-medium">Multiple Choice</p>
                  <p className="text-xs text-muted-foreground">Options</p>
                </div>
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
