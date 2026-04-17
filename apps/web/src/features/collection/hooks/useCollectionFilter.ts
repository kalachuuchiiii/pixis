import { useQueryParam } from "@/hooks/useQueryParam";
import type {
  CollectionVisibility,
  SortableCollectionField,
  SortingOrder,
} from "@pixis/constants";
import { useCallback, useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";

type SortObject = {
  field: SortableCollectionField;
  order: SortingOrder;
};

type FilterObject = {
  createdAt?: {
    op: "gte" | "btw";
    value: string; //iso
  };
  visibility?: {
    op: "eq";
    value: CollectionVisibility;
  };
};

export const useCollectionFilter = (blacklistedFields: string[] = []) => {
  const [query, setQuery] = useState("");
  const sortForm = useForm<SortObject>({
    defaultValues: {
      field: "createdAt",
      order: "DESC",
    },
  });
  const sort = sortForm.watch();
  const [search, setSearch] = useState<string>("");
  const filterForm = useForm<FilterObject>({
    defaultValues: {},
  });
  const resetFilter = () => {
    sortForm.reset();
    filterForm.reset();
  };
  const filter = filterForm.watch();

  const { update } = useQueryParam(blacklistedFields);

  const onUpdate = () =>
    update((query) => setQuery(query), { filter, sort, search });

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, []);

  const onEnterUpdate = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLButtonElement>
  ) => {
    if (!e.shiftKey && e.key === "Enter") {
      onUpdate();
    }
  };

  return {
    query,
    onUpdate,
    onChange,
    onEnterUpdate,
    setSortValue: sortForm.setValue,
    setFilterValue: filterForm.setValue,
    search,
    blacklistedFields,
    setSearch,
    sort,
    filter,
    resetFilter,
  };
};


export type CollectionFilterHandler = ReturnType<typeof useCollectionFilter>;