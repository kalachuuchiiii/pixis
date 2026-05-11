import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../../components/ui/sheet";
import { Button } from "../../../components/ui/button";
import { Filter, ChevronRight, Link2 } from "lucide-react";
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
} from "../../../components/ui/select";
import { capitalize } from "lodash";
import type { DeckFilterHandler } from "@/features/deck/hooks/useDeckFilter";
import { creationDateFilters } from "../data/creationDateFilter";
import { sortOrdersMap } from "@/data/sort";
import { SearchFilterBar } from "@/components/SearchFilterBar";
import type { JSX } from "react";
import { useParams } from "react-router-dom";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { DeckCreatorDialog } from "./DeckCreatorDialog";
import { copy } from "@/utils/copy";

export const sortableFieldsMap: Record<SortableDeckField, string> = {
  createdAt: "Creation Date",
  updatedAt: "Updated Date",
};

export const DeckFilter = ({
  deckFilter,
  menus = [],
  additionalActions,
}: {
  deckFilter: DeckFilterHandler;
  menus?: (JSX.Element | undefined)[];
  additionalActions?: (JSX.Element | undefined)[];
}) => {
  const { filterForm, sortForm, resetFilter, updateQuery, blacklistedFields } =
    deckFilter;

  const sort = sortForm.watch();
  const filter = filterForm.watch();
  const { userId = "0" } = useParams();
  const { data: user } = useAuthUser();
  const isMine = String(user.id) === userId;

  return (
    <SearchFilterBar
      filter={deckFilter}
      className="w-full"
      placeholder="Search decks by title, description, or keywords"
      menus={menus}
      actions={[
        <Sheet>
          <SheetTrigger asChild className="my-btn">
            <Button variant={"outline"} className="my-btn">
              <Filter />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader className="mt-4">
              <SheetTitle className="text-4xl heading">
                Filter & Sort
              </SheetTitle>
              <SheetDescription className="description">
                Customize how your decks are displayed
              </SheetDescription>
            </SheetHeader>

            <main className="px-7 space-y-8 py-6">
              <div>
                <label className="label mb-3 block">Creation Date</label>
                <div className="flex flex-wrap gap-2">
                  {creationDateFilters.map(
                    ({ op, value, key, description }) => {
                      return (
                        <Button
                          key={key}
                          variant={
                            value === filter.createdAt?.value
                              ? "default"
                              : "outline"
                          }
                          onClick={() => {
                            if (key === "ALL_TIME") {
                              filterForm.setValue("createdAt", undefined);
                              return;
                            }
                            filterForm.setValue("createdAt", { op, value });
                          }}
                        >
                          {description}
                        </Button>
                      );
                    }
                  )}
                </div>
              </div>
              <div>
                <label className="label mb-3 block">Sort By</label>
                <div className="flex items-center gap-3">
                  <Select
                    value={sort.field}
                    onValueChange={(val: SortableDeckField) =>
                      sortForm.setValue("field", val)
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
                      sortForm.setValue("order", val)
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

              {!blacklistedFields.includes("visibility") && (
                <div>
                  <label className="label mb-3 block">Visibility</label>
                  <Select
                    value={filter?.visibility?.value}
                    onValueChange={(val: Visibility | "*") =>
                      filterForm.setValue("visibility.value", val)
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
                        {VISIBILITY_ENUM.map((vis) => (
                          <SelectItem key={vis} value={vis}>
                            {capitalize(vis)}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              )}
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
        <Button
          className="my-btn"
          variant={"outline"}
          onClick={() => copy(window.location.href)}
        >
          <Link2 />
        </Button>,
        ...(additionalActions ?? []),
      ]}
    />
  );
};
