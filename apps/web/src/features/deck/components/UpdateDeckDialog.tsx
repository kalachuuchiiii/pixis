import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil } from "lucide-react";
import { DeckForm } from "./DeckForm";
import { useForm } from "react-hook-form";
import { DeckFormSchema, type Deck, type DeckForm as DF } from "@pixis/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDeck } from "../hooks/useDeck";
import { isEqual } from "lodash";
import { memo } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const UpdateDeckDialog = memo(({ deck }: { deck: Deck | Deck }) => {
  const { title, color, visibility, topic } = deck;
  const deckForm = useForm<DF>({
    defaultValues: {
      title,
      color,
      visibility,
      topic,
    },
    resolver: zodResolver(DeckFormSchema),
  });
  const values = deckForm.watch();
  const { updateDeck, isUpdatingDeck } = useDeck();
  const hasNoChanges = isEqual(values, {
    title,
    color,
    visibility,
    topic,
  });

  return (
    <Dialog>
      <DialogTrigger>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button className="my-btn" variant={"outline"}>
              <Pencil />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Update deck</TooltipContent>
        </Tooltip>
      </DialogTrigger>
      <DialogContent
        className={`min-w-6/12 h-[84vh] overflow-y-auto  px-10 py-5  rounded-xl`}
      >
        <DeckForm
          deckForm={deckForm}
          header={
            <header>
              <h1 className="text-4xl heading">Update deck</h1>
              <p className="text-sm description">Update your deck</p>
            </header>
          }
          footer={
            <footer className="flex gap-2 flex-wrap items-center justify-end">
              <DialogClose>
                <Button className="my-btn" variant={"ghost"}>
                  Cancel
                </Button>
              </DialogClose>
              <Button
                disabled={hasNoChanges}
                className="my-btn"
                onClick={() => deckForm.reset()}
                variant={"outline"}
              >
                Reset Changes
              </Button>
              <DialogClose>
                <Button
                  disabled={isUpdatingDeck || hasNoChanges}
                  onClick={() =>
                    updateDeck({
                      deckForm: values,
                      deckId: Number(deck?.id ?? 0),
                    })
                  }
                  className="my-btn"
                >
                  Update
                </Button>
              </DialogClose>
            </footer>
          }
        />
      </DialogContent>
    </Dialog>
  );
});
