import {
  InputGroup,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
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
import type { FlashcardFilterHandlers } from "../hooks/useFlashcardFilter";
import { ChevronRight, Filter, Search } from "lucide-react";
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
  TYPE_ENUM,
  type FlashcardType,
  type SortableFlashcardField,
  type SortingOrder,
} from "@pixis/constants";
import { sortableFieldsMap } from "@/features/deck/components/DeckFilter";
import { sortOrdersMap } from "@/data/sort";
import { capitalize } from "lodash";
import { SearchFilterBar } from "@/components/SearchFilterBar";

export const FlashcardFilter = ({
  flashcardFilterHandlers,
}: {
  flashcardFilterHandlers: FlashcardFilterHandlers;
}) => {
  const { onUpdate, sort, filter, setFilterValue, setSortValue, resetFilter } =
    flashcardFilterHandlers;
  return (
    <SearchFilterBar
      handlers={flashcardFilterHandlers}
      placeholder="Search flashcard by question or answer"
      actions={
        <Sheet>
          <SheetTrigger>
            <InputGroupButton className="my-btn h-full">
              <Filter />
            </InputGroupButton>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader className="mt-4">
              <SheetTitle className="text-4xl title">Filter & Sort</SheetTitle>
              <SheetDescription className="label">
                Customize how your flashcards are displayed
              </SheetDescription>
            </SheetHeader>
            <main className="px-7 space-y-8 py-6">
              <div>
                <label className="label mb-3 block">Sort By</label>
                <div className="flex items-center gap-3">
                  <Select
                    value={sort.field}
                    onValueChange={(val: SortableFlashcardField) =>
                      setSortValue("field", val)
                    }
                  >
                    <SelectTrigger className="flex-1">
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
                    <SelectTrigger className="w-48">
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
                  value={filter.type.value}
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
                      {TYPE_ENUM.map((t: FlashcardType) => (
                        <SelectItem key={t} value={t}>
                          {capitalize(t).replaceAll("_", " ")}
                        </SelectItem>
                      ))}
                      <SelectItem value="all_type">All</SelectItem>
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
                <Button onClick={onUpdate} className="my-btn ">
                  Apply Filters
                </Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      }
    ></SearchFilterBar>
  );
};
