import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useAppSelector } from "@/hooks/useReduxHook";
import type { Flashcard } from "@pixis/schemas";
import { formatDistanceToNow } from "date-fns";
import { capitalize } from "lodash";
import { Dot, MoreVertical } from "lucide-react";
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

export const FlashcardPreviewCard = ({ data }: { data: Flashcard }) => {
  const { user } = useAppSelector((state) => state.profile);
  const flashcardFormHandler = useFlashcardForm(data);

  return (
    <Dialog>
      <DialogTrigger className="cursor-pointer" asChild>
        <Card className="px-4  flex flex-col justify-between">
          <header>
            <p className="description">
              {capitalize(data.type.replaceAll("_", " "))}
            </p>
            <h1 className="text-2xl tracking-light text-zinc-900 line-clamp-2">
              {data.question}
            </h1>
          </header>
          <footer className="flex items-center justify-between">
            <p className="text-xs opacity-50">
              Updated {formatDistanceToNow(new Date(data.updatedAt))} ago
            </p>
          </footer>
        </Card>
      </DialogTrigger>
      <DialogContent>
        <header>
          <p className="description">
            {capitalize(data.type.replaceAll("_", " "))}
          </p>
          <h1 className="text-2xl tracking-light text-zinc-900">
            {data.question}
          </h1>
        </header>
        {data.type === "close_ended" && (
          <ul className=" grid  grid-cols-2 my-2">
            {data.choices.map((c) => (
              <li
                className="line-clamp-2 flex items-center justify-start flex-wrap w-full"
                key={c}
              >
                {" "}
                <Dot /> {c}
              </li>
            ))}
          </ul>
        )}

        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="my-btn w-8/10">Reveal answer</Button>
            </DialogTrigger>
            <DialogContent className="h-50 w-70">
              <main className="w-full h-full flex flex-col items-center justify-center">
                <label className="description">The answer is: </label>
                <h1 className="text-3xl">{data.answer}</h1>
              </main>
            </DialogContent>
          </Dialog>
          {data.userId === user.id && (
            <div className="flex">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button variant={"outline"} className="my-btn">
                    <MoreVertical />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="min-w-fit">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Options</DropdownMenuLabel>
                    <UpdateFlashcardDialog
                      flashcardFormHandler={flashcardFormHandler}
                      flashcardId={data.id}
                    />
                    <DeleteFlashcardDialog
                      flashcardId={data.id}
                      deckId={data.deckId}
                    />
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        <footer className="flex items-center justify-between">
          <p className="text-xs opacity-50">
            Updated {formatDistanceToNow(new Date(data.updatedAt))} ago
          </p>
        </footer>
      </DialogContent>
    </Dialog>
  );
};
