import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useAppSelector } from "@/hooks/useReduxHook";
import type { Flashcard } from "@pixis/schemas";
import { formatDistanceToNow } from "date-fns";
import { capitalize } from "lodash";
import { Dot, MoreVertical, Eye } from "lucide-react";
import { UpdateFlashcardDialog } from "../UpdateFlashcardDialog";
import { DeleteFlashcardDialog } from "../DeleteFlashcardDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFlashcardForm } from "../../hooks/useFlashcardForm";
import clsx from "clsx";

export const FlashcardPreviewCard = ({ flashcard, color }: { color?: string; flashcard: Flashcard }) => {
  const { user } = useAppSelector((state) => state.profile);
  const flashcardFormHandler = useFlashcardForm(flashcard);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className={clsx("group h-full flex flex-col justify-between p-6 hover:shadow-md transition-all cursor-pointer bg-white dark:bg-stone-900 outline-1 outline-stone-500 dark:outline-stone-700 ", `border-l-10 border-l-[${color}]`)}>
          <div className="space-y-4">
            <div className="inline-flex items-center text-stone-500 gap-1.5 text-xs font-medium">
              {capitalize(flashcard.type.replaceAll("_", " "))}
            </div>
            <h3 className="text-xl font-medium leading-snug text-stone-900 dark:text-white line-clamp-3 min-h-[3.5em]">
              {flashcard.question}
            </h3>
          </div>
          <div className="pt-4 mt-auto border-t border-stone-100 dark:border-stone-800">
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Updated {formatDistanceToNow(new Date(flashcard.updatedAt))} ago
            </p>
          </div>
        </Card>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <div className="space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500 mb-3">
              {capitalize(flashcard.type.replaceAll("_", " "))}
            </div>
            <h2 className="text-2xl font-medium text-stone-900 dark:text-white leading-tight">
              {flashcard.question}
            </h2>
          </div>
          {flashcard.type === "close_ended" && flashcard.choices && (
            <div className="bg-stone-50 dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-2xl p-5">
              <p className="text-sm font-medium text-stone-500 dark:text-stone-400 mb-3">
                Choices
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {flashcard.choices.map((choice, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-stone-700 dark:text-stone-300"
                  >
                    <Dot className="mt-1.5 flex-shrink-0 text-stone-400" />
                    {choice}
                  </li>
                ))}
              </ul>
            </div>
          )}
        <div className="flex flex-col sm:flex-row gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex-1 h-11 text-base font-medium gap-2">
                  <Eye className="w-5 h-5" />
                  Reveal Answer
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-md">
                <div className="py-8 text-center">
                  <p className="text-sm text-stone-500 dark:text-stone-400 mb-2">
                    The answer is
                  </p>
                  <p className="text-3xl font-medium text-stone-900 dark:text-white leading-tight">
                    {flashcard.answer}
                  </p>
                </div>
              </DialogContent>
            </Dialog>
            {flashcard.userId === user?.id && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-11 w-11">
                    <MoreVertical className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-30">
                  <DropdownMenuGroup className="flex flex-col">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <UpdateFlashcardDialog
                      flashcardFormHandler={flashcardFormHandler}
                      flashcardId={flashcard.id}
                    />
                    <DeleteFlashcardDialog
                      flashcardId={flashcard.id}
                      deckId={flashcard.deckId}
                    />
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          <p className="text-center text-xs text-stone-400 dark:text-stone-500">
            Updated {formatDistanceToNow(new Date(flashcard.updatedAt))} ago
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
