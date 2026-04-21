import { Filter, Search } from "lucide-react";
import type { ComponentProps, JSX, ReactNode } from "react";
import { SheetTrigger, Sheet } from "./ui/sheet";
import {
  InputGroup,
  InputGroupButton,
  InputGroupInput,
} from "./ui/input-group";
import { Separator } from "./ui/separator";
import type { DeckFilterHandler } from "@/features/deck/hooks/useDeckFilter";
import type { CollectionFilterHandler } from "@/features/collection/hooks/useCollectionFilter";
import type { FlashcardFilterHandler } from "@/features/flashcard/hooks/useFlashcardFilter";

export const SearchFilterBar = ({
  actions,
  filter,
  ...props
}: {
  actions: JSX.Element[] | JSX.Element;
  filter: DeckFilterHandler | CollectionFilterHandler | FlashcardFilterHandler;
} & ComponentProps<"input">) => {
  const { search, handleChangeSearch, updateQueryOnEnter, updateQuery } =
    filter;
  return (
    <div className="flex items-center w-full relative gap-2  ">
      <InputGroup className="flex items-center  w-full h-12 h-full">
        <InputGroupInput
          value={search}
          onChange={handleChangeSearch}
          type="text"
          className="h-full w-full"
          {...props}
          onKeyDown={updateQueryOnEnter}
        />

        <InputGroupButton
          onClick={updateQuery}
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
