import { Settings2 } from "lucide-react";
import { memo, type ComponentProps, type JSX } from "react";
import type { DeckFilterHandler } from "@/features/deck/hooks/useDeckFilter";
import type { CollectionFilterHandler } from "@/features/collection/hooks/useCollectionFilter";
import type { FlashcardFilterHandler } from "@/features/flashcard/hooks/useFlashcardFilter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Skeleton } from "boneyard-js/react";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import clsx from "clsx";
import { InputGroupButton } from "./ui/input-group";

export type Addon = JSX.Element | undefined;

export const SearchFilterBar = memo(
  ({
    actions,
    filter,
    menus = [],
    ...props
  }: {
    actions: Addon[] | JSX.Element;
    menus?: Addon[];
    filter:
      | DeckFilterHandler
      | CollectionFilterHandler
      | FlashcardFilterHandler;
  } & ComponentProps<"input">) => {
    const { search, handleChangeSearch, updateQueryOnEnter } = filter;

    const { className, ...prop } = props;
    const { data: user } = useAuthUser();
    const isLoading = !user.id;

    return (
      <div className="flex lg:flex-row flex-col items-center rounded-lg w-full relative gap-2  ">
        <Skeleton
          loading={isLoading}
          name="search-bar"
          className="w-full h-full"
        >
          <Input
            value={search}
            onChange={handleChangeSearch}
            type="text"
            className={clsx(" h-full h-8 lg:h-12 min-h-full ", className)}
            {...prop}
            onKeyDown={updateQueryOnEnter}
          />
        </Skeleton>
        <div className="flex items-start w-full gap-2">
          {menus.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Skeleton loading={isLoading} name="button">
                  <Button variant={"outline"} className="my-btn">
                    <Settings2 />
                  </Button>
                </Skeleton>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup className="w-full">
                  {menus?.length &&
                    menus.map(
                      (el) =>
                        el && (
                          <button
                            className="w-full "
                            onClick={(e) => e.preventDefault()}
                          >
                            {el}
                          </button>
                        )
                    )}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {Array.isArray(actions) ? (
            actions.map(
              (el) =>
                el && (
                  <Skeleton loading={isLoading} name="button">
                    <button key={el.key}>{el}</button>
                  </Skeleton>
                )
            )
          ) : (
            <InputGroupButton>{actions}</InputGroupButton>
          )}
        </div>
      </div>
    );
  }
);
