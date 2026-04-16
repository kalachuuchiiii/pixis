import { LoadingDisplay } from "@/components/ui/LoadingDisplay";
import _ from "lodash";
import { CloseEndedForm } from "../components/CloseEndedForm";
import { OpenEndedForm } from "../components/OpenEndedForm";
import type {
  CreateCloseEndedForm as UpdateCloseEndedForm,
  CreateOpenEndedForm as UpdateOpenEndedForm,
} from "../hooks/useCreateFlashcard";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import { useFlashcardManager } from "../hooks/useFlashcardManager";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const FlashcardManager = () => {
  const {
    handleChangeType,
    onSubmit,
    flashcard,
    flashcardFormValues,
    flashcardForm,
    disabled,
    deleteFlashcard,
    isDeletingFlashcard,
    hasNoChanges,
  } = useFlashcardManager();

  if (disabled || !flashcard) {
    return <LoadingDisplay />;
  }

  return (
    <div className="animate-fade-in-right page-container ">
      <div className="w-full">
        <header>
          <h1 className="description">Manage your existing flashcard</h1>
        </header>
        <main className="mx-auto">
          {flashcardFormValues?.type === "close_ended" ? (
            <CloseEndedForm
              onSubmit={onSubmit}
              aria-disabled = {disabled}
              id="close-ended-form/manage"
              closeEndedForm={flashcardForm as UpdateCloseEndedForm}
            />
          ) : (
            <OpenEndedForm
              onSubmit={onSubmit}
              aria-disabled = {disabled}
              id="open-ended-form/manage"
              openEndedForm={flashcardForm as UpdateOpenEndedForm}
            />
          )}
        </main>
      </div>
      <footer className="flex items-center w-full gap-2 h-11">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant={"destructive"} className="h-full my-btn">
              <Trash />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Flashcard</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this flashcard? This can't be undone!
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  disabled={disabled}
                  onClick={() =>
                    deleteFlashcard({
                      deckId: flashcard.deckId,
                      flashcardId: flashcard.id,
                    })
                  }
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogContent>
        </AlertDialog>
        <Select
          onValueChange={handleChangeType}
          defaultValue={flashcardFormValues.type}
        >
          <SelectTrigger className="my-btn space-x-2 ">
            <Pencil /> <SelectValue defaultValue={flashcardFormValues.type} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Types</SelectLabel>
              <SelectItem defaultChecked value="open_ended">
                Open Ended
              </SelectItem>
              <SelectItem value="close_ended">Close ended</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {flashcardFormValues.type === "open_ended" ? (
          <Button
            type="submit"
            className="grow-1 my-btn"
            disabled={disabled || hasNoChanges}
            form="open-ended-form/manage"
          >
            Update
          </Button>
        ) : (
          <Button
            type="submit"
            className="grow-1 my-btn"
            disabled={disabled || hasNoChanges || flashcardFormValues.choices.length < 2} 
            form="close-ended-form/manage"
          >
            Update
          </Button>
        )}
      </footer>
    </div>
  );
};

export default FlashcardManager;
