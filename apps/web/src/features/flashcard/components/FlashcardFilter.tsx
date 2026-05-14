import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { FlashcardFilterHandler } from "../hooks/useFlashcardFilter";
import { ChevronRight, Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  SelectContent,
  Select,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SORTABLE_FLASHCARD_FIELDS,
  SORTING_ORDERS,
  FLASHCARD_TYPES,
  type FlashcardType,
  type SortableFlashcardField,
  type SortingOrder,
} from "@pixis/constants";
import { sortableFieldsMap } from "@/features/deck/components/DeckFilter";
import { sortOrdersMap } from "@/data/sort";
import { capitalize } from "lodash";
import { SearchFilterBar } from "@/components/SearchFilterBar";
import type { Deck } from "@pixis/schemas";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { FlashcardCreator } from "./FlashcardCreator";

export const FlashcardFilter = ({
  flashcardFilter,
  deck,
}: {
  flashcardFilter: FlashcardFilterHandler;
  deck: Deck;
}) => {
  const { sortForm, filterForm, updateQuery, resetFilter } = flashcardFilter;
  const sort = sortForm.watch();
  const filter = filterForm.watch();
  const setFilterValue = filterForm.setValue;
  const setSortValue = sortForm.setValue;
  const { data: user } = useAuthUser();

  const isMine = user.id === deck.userId;

  return (
    <SearchFilterBar
      filter={flashcardFilter}
      placeholder="Search flashcard by question or answer"
      actions={[
        <Sheet>
          <SheetTrigger asChild>
            <Button variant={"outline"} className="my-btn h-full">
              <Filter />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader className="mt-4">
              <SheetTitle className="text-3xl   lg:text-4xl heading">
                Filter & Sort
              </SheetTitle>
              <SheetDescription>
                Customize how your flashcards are displayed
              </SheetDescription>
            </SheetHeader>
            <main className="sheet-container">
              <div>
                <label className="label mb-3 block">Sort By</label>
                <div className="flex items-center flex-wrap gap-3">
                  <Select
                    value={sort.field}
                    onValueChange={(val: SortableFlashcardField) =>
                      setSortValue("field", val)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Fields</SelectLabel>
                        {SORTABLE_FLASHCARD_FIELDS.map((field) => (
                          <SelectItem key={field} value={field}>
                            {sortableFieldsMap[field]}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  <ChevronRight className="text-muted-foreground" />

                  <Select
                    value={sort.order}
                    onValueChange={(val: SortingOrder) =>
                      setSortValue("order", val)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Order</SelectLabel>
                        {SORTING_ORDERS.map((order) => (
                          <SelectItem key={order} value={order}>
                            {sortOrdersMap[order]}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="label mb-3 block">Type</label>
                <Select
                  value={filter?.type?.value}
                  onValueChange={(val: FlashcardType) =>
                    setFilterValue("type.value", val)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Audience</SelectLabel>
                      <SelectItem key={"*"} value={"*"}>
                        All
                      </SelectItem>
                      {FLASHCARD_TYPES.map((t: FlashcardType) => (
                        <SelectItem key={t} value={t}>
                          {capitalize(t).replaceAll("_", " ")}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </main>
            <SheetFooter className="px-7 py-6">
              <SheetClose asChild>
                <Button variant="ghost" className="my-btn ">
                  Cancel
                </Button>
              </SheetClose>

              <Button
                variant={"secondary"}
                onClick={resetFilter}
                className="my-btn "
              >
                Reset Fllters
              </Button>
              <SheetClose asChild>
                <Button onClick={updateQuery} className="my-btn ">
                  Apply Filters
                </Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>,
        isMine ? (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="my-btn h-full">
                {" "}
                <Plus /> <p className="lg:block hidden"> New Flashcard</p>
              </Button>
            </DialogTrigger>
            <DialogContent
              className="min-w-4/10 w-full"
              onCloseAutoFocus={(e) => e.preventDefault()}
            >
              <FlashcardCreator />
            </DialogContent>
          </Dialog>
        ) : undefined,
      ]}
    ></SearchFilterBar>
  );
};
