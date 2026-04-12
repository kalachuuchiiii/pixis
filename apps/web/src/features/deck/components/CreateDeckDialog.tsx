import { Input } from "@/components/ui/input";
import { Plus, Tag } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { VISIBILITY_OPTIONS } from "../data/visibilityOptions";
import { QUICK_TOPICS } from "../data/quickTopics";
import { Controller, useForm } from "react-hook-form";
import { rawDeckFormSchema, type RawDeckForm } from "@pixis/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { VisibilityOptionButton } from "@/features/auth/components/ui/VisibilityOptionButton";
import { useDeck } from "../hooks/useDeck";
import { DeckForm } from "./DeckForm";

export const CreateDeckDialog = () => {
  const { createDeck, isCreatingDeck } = useDeck();
  const deckForm = useForm<RawDeckForm>({
    defaultValues: {
      title: "",
      description: "",
      color: "#000000",
      visibility: "public",
      topic: "",
    },
    resolver: zodResolver(rawDeckFormSchema),
  });
  const { handleSubmit } = deckForm;

  const onSubmit = handleSubmit(async (data) => {
    await createDeck(data);
  });

  return (
    <Dialog>
      <DialogTrigger>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button className="my-btn">
              Create <Plus />
            </Button>
          </TooltipTrigger>
          <TooltipContent>New deck</TooltipContent>
        </Tooltip>
      </DialogTrigger>
      <DialogContent className="min-w-8/12">
        <header>
          <h1 className="text-[10px] font-semibold tracking-[0.18em] uppercase text-stone-400 mb-2">
            New deck
          </h1>
          <h1
            className="text-[28px] font-normal text-stone-900 leading-tight"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Create a deck
          </h1>
          <p className="text-[14px] text-stone-400 mt-1.5">
            Fill in the details below, then start adding flashcards.
          </p>
        </header>

        <DeckForm
          deckForm={deckForm}
          onSubmit={onSubmit}
          id="create-deck-form"
        />
        <DialogFooter>
          <DialogClose>
            <Button variant={"outline"} className="my-btn">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            className="w-full my-btn w-10/12"
            form="create-deck-form"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
