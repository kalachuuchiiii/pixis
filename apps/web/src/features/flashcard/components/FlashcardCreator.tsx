import { Button } from "@/components/ui/button";
import { ChevronLeft, CreditCard, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { CloseEndedForm } from "./CloseEndedForm";
import { useCreateFlashcard } from "../hooks/useCreateFlashcard";
import { OpenEndedForm } from "./OpenEndedForm";

export const FlashcardCreator = () => {
  const {
    type,
    closeEndedForm,
    openEndedForm,
    onSubmitCloseEnded,
    onSubmitOpenEnded,
    isCreatingFlashcard,
    setType,
  } = useCreateFlashcard();

  return (
    <div className="w-full p-2">
      {type !== "" ? (
        <div className="space-y-4 ">
          <Button onClick={() => setType("")} variant={"outline"}>
            <ChevronLeft />
          </Button>
          <header>
            <h1 className="label text-[10px] description">New Flashcard</h1>
          </header>
          {type === "close_ended" ? (
            <div>
              <CloseEndedForm
                closeEndedForm={closeEndedForm}
                id="close-ended-form"
              />
              <Button
                disabled={
                  isCreatingFlashcard ||
                  closeEndedForm.watch("choices").length < 2
                }
                onClick={onSubmitCloseEnded}
                className="my-btn w-full"
                type="submit"
              >
                Create
              </Button>
            </div>
          ) : (
            <div>
              <OpenEndedForm
                className="space-y-2"
                openEndedForm={openEndedForm}
              />
              <Button
                onClick={onSubmitOpenEnded}
                disabled={isCreatingFlashcard}
                className="my-btn w-full"
              >
                Create
              </Button>
            </div>
          )}
        </div>
      ) : (
        <>
          {" "}
          <header>
            <p className="description">
              Choose the type of flashcard you want to create
            </p>
            <h1 className="heading text-4xl">New Flashcard</h1>
          </header>
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
    </div>
  );
};
