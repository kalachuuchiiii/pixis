import { Filter, Search } from "lucide-react";
import type { ComponentProps, JSX, ReactNode } from "react";
import { SheetTrigger, Sheet } from "./ui/sheet";
import {
  InputGroup,
  InputGroupButton,
  InputGroupInput,
} from "./ui/input-group";
import type { DeckFilterHandlers } from "@/features/deck/hooks/useDeckFilter";
import type { FlashcardFilterHandlers } from "@/features/flashcard/hooks/useFlashcardFilter";
import { Separator } from "./ui/separator";
import type { CollectionFilterHandler } from "@/features/collection/hooks/useCollectionFilter";

export const SearchFilterBar = ({
  actions,
  handlers,
  ...props
}: {
  actions: JSX.Element[] | JSX.Element;
  handlers: DeckFilterHandlers | FlashcardFilterHandlers | CollectionFilterHandler;
} & ComponentProps<"input">) => {
  const { search, onChange, onEnterUpdate, onUpdate } = handlers;
  return (

     <div className="flex items-center w-full relative gap-2  ">
      <InputGroup className="flex items-center  w-full h-12 h-full">
        <InputGroupInput
          value={search}
          onChange={onChange}
          type="text"
          className="h-full w-full"   
          {...props}
          onKeyDown={onEnterUpdate}
        />

        <InputGroupButton
          onClick={onUpdate}
          disabled={!search.trim()}
          variant={"ghost"}
          className="my-btn"
        >
          <Search className="size-5" />
        </InputGroupButton>
        <Separator orientation="vertical" className="bg-black/25" />
        <div className="flex items-center gap-1">
          {Array.isArray(actions) ? (
            actions.map((el) => (
              <InputGroupButton key={el.key}>{el}</InputGroupButton>
            ))
          ) : (
            <InputGroupButton>{actions}</InputGroupButton>
          )}
        </div>
      </InputGroup>
    </div>

  );
};
