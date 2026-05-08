import { Filter, Search, Settings2 } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";

export const SearchFilterBar = ({
  actions,
  filter,
  menus = [],
  ...props
}: {
  actions: JSX.Element[] | JSX.Element;
  menus?: JSX.Element[];
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
          className="p-5 lg:p-6"
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
      {menus.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant={"outline"} className="my-btn">
              <Settings2 />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup className="w-full">
              {menus?.length &&
                menus.map((el) => (
                  <DropdownMenuItem
                    className="w-full"
                    onClick={(e) => e.preventDefault()}
                  >
                    {el}
                  </DropdownMenuItem>
                ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};
