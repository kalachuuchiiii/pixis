import { useState, useEffect, useMemo, type ComponentProps } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { Filter, ChevronRight } from "lucide-react";
import {
  SORTABLE_DECK_FIELDS,
  SORTING_ORDERS,
  VISIBILITY_ENUM,
  type SortableDeckField,
  type SortingOrder,
  type Visibility,
} from "@pixis/constants";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useSearchParams } from "react-router-dom";
import { capitalize } from "lodash";
import type { DeckFilterHandlers } from "@/features/deck/hooks/useDeckFilter";

const sortableFieldsMap: Record<SortableDeckField, string> = {
  createdAt: "Creation Date",
  updatedAt: "Updated Date",
  popularityScore: "Popularity",
  savedCount: "Saved count",
  participantCount: "Participants",
};

const sortOrdersMap: Record<SortingOrder, string> = {
  DESC: "Most / Newest",
  ASC: "Least / Oldest",
};

export const DeckFilter = ({
  deckFilterHandlers,
  ...props
}: { deckFilterHandlers: DeckFilterHandlers } & ComponentProps<"div">) => {
  const { setSortValue, setFilterValue, sort, filter, query, onUpdate } =
    deckFilterHandlers;
  console.log(query);
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="my-btn gap-2">
          <Filter size={18} />
          <span className="hidden sm:inline">{""}</span>
        </Button>
      </SheetTrigger>

      <SheetContent {...props}>
        <SheetHeader>
          <SheetTitle className="text-3xl">Filter & Sort</SheetTitle>
          <SheetDescription>
            Customize how your decks are displayed
          </SheetDescription>
        </SheetHeader>

        <main className="px-7 space-y-8 py-6">
          {/* Sort Section */}
          <div>
            <label className="label mb-3 block">Sort By</label>
            <div className="flex items-center gap-3">
              <Select
                value={sort.field}
                onValueChange={(val: SortableDeckField) =>
                  setSortValue("field", val)
                }
              >
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Fields</SelectLabel>
                    {SORTABLE_DECK_FIELDS.map((field) => (
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

          {/* Visibility */}
          <div>
            <label className="label mb-3 block">Visibility</label>
            <Select
              value={filter.visibility.value}
              onValueChange={(val: Visibility) =>
                setFilterValue("visibility.value", val)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Audience</SelectLabel>
                  {VISIBILITY_ENUM.map((vis) => (
                    <SelectItem key={vis} value={vis}>
                      {capitalize(vis)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </main>

        <SheetFooter className="px-7">
          <SheetClose asChild>
            <Button variant="outline" className="my-btn flex-1">
              Cancel
            </Button>
          </SheetClose>

          <SheetClose asChild>
            <Button onClick={onUpdate} className="my-btn flex-1">Apply Filters</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
