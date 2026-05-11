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
import { Filter, ChevronRight } from "lucide-react";
import {
  SORTABLE_COLLECTION_FIELDS,
  SORTABLE_DECK_FIELDS,
  SORTING_ORDERS,
  VISIBILITY_ENUM,
  type SortableCollectionField,
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
} from "@/components/ui/select";
import { capitalize } from "lodash";
import { sortOrdersMap } from "@/data/sort";
import { SearchFilterBar, type Addon } from "@/components/SearchFilterBar";
import { creationDateFilters } from "@/features/deck/data/creationDateFilter";
import type { CollectionFilterHandler } from "../hooks/useCollectionFilter";
import { sortableFieldsMap } from "@/features/deck/components/DeckFilter";
import type { JSX } from "react";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { CollectionCreatorDialog } from "./CollectionCreatorDialog";
import { useParams } from "react-router-dom";

const sortableFilterMap = {
  createdAt: "Creation date",
  updatedAt: "Updated date",
};

export const CollectionFilter = ({
  collectionFilter,
  menus,
  additionalActions,
}: {
  collectionFilter: CollectionFilterHandler;
  menus?: Addon[];
  additionalActions?: Addon[];
}) => {
  const {
    sortForm,
    filterForm,
    resetFilter,
    updateQuery,
    updateQueryOnEnter,
    search,
    blacklistedFields,
  } = collectionFilter;
  const sort = sortForm.watch();
  const filter = filterForm.watch();
  const setFilterValue = filterForm.setValue;
  const setSortValue = sortForm.setValue;
  const { userId = "0" } = useParams();
  const { data: user } = useAuthUser();
  const isMine = String(user.id) === userId;

  return (
    <SearchFilterBar
      filter={collectionFilter}
      className="w-full"
      menus={menus}
      placeholder="Search collections by title"
      actions={[
        <Sheet>
          <SheetTrigger>
            <Button className="my-btn" variant={"outline"}>
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
              {/* Sort Section */}
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
                            setFilterValue("createdAt", { op, value });
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
                    onValueChange={(val: SortableCollectionField) =>
                      setSortValue("field", val)
                    }
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Fields</SelectLabel>
                        {SORTABLE_COLLECTION_FIELDS.map((field) => (
                          <SelectItem key={field} value={field}>
                            {sortableFilterMap[field]}
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
              {!blacklistedFields.includes("visibility") && (
                <div>
                  <label className="label mb-3 block">Visibility</label>
                  <Select
                    value={filter?.visibility?.value}
                    onValueChange={(val: Visibility | "*") =>
                      setFilterValue("visibility.value", val)
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
        ...(additionalActions ?? []),
      ]}
    />
  );
};
