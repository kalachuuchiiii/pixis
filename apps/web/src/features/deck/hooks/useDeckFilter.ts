import type {
  SortableDeckField,
  FilterableDeckField,
  Visibility,
  SortingOrder,
  DeckFilterOperation,
} from "@pixis/constants";
import { isDate } from "lodash";
import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { useForm } from "react-hook-form";

export type SortObject = {
  field: SortableDeckField;
  order: SortingOrder;
};

export type FilterObject = {
  visibility: {
    op?: "eq";
    value?: Visibility | "all";
  };
  createdAt?: {
    op?: DeckFilterOperation;
    value?: string;
  };
};

export const useDeckFilter = (
  { hideDeckVisibilityOption }: { hideDeckVisibilityOption: boolean } = {
    hideDeckVisibilityOption: false,
  }
) => {
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
    defaultValues: {
      visibility: {
        op: "eq",
        value: "all",
      },
    },
  });
  const resetFilter = () => {
    sortForm.reset();
    filterForm.reset();
  };
  const filter = filterForm.watch();

  const onUpdate = useCallback(() => {
    const queries: string[] = [`sortBy=${sort.field}:${sort.order}`];
    if (search.trim()) {
      queries.push(`search=${search}`);
    }
    for (const [key, value] of Object.entries(filter)) {
      if (
        !value ||
        !value.value ||
        !value.op ||
        value.value === "all" ||
        (key === "visibility" && hideDeckVisibilityOption)
      )
        continue;
      queries.push(`filter.${key}=$${value.op}:${value.value}`);
    }
    setQuery(queries.join("&"));
  }, [filter, sort, search]);

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, []);

  const onEnterUpdate = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement | HTMLButtonElement>) => {
      if (!e.shiftKey && e.key === "Enter") {
        onUpdate();
      }
    },
    [onUpdate]
  );

  return {
    query,
    onUpdate,
    onChange,
    onEnterUpdate,
    setSortValue: sortForm.setValue,
    setFilterValue: filterForm.setValue,
    search,
    hideDeckVisibilityOption,
    setSearch,
    sort,
    filter,
    resetFilter,
  };
};

export type DeckFilterHandlers = ReturnType<typeof useDeckFilter>;
