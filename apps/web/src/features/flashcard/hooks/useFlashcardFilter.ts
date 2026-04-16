import {
  SORTABLE_FLASHCARD_FIELDS,
  SORTING_ORDERS,
  type FilterableFlashcardField,
  type FlashcardFilterOperator,
  type SortableFlashcardField,
  type SortingOrder,
} from "@pixis/constants";
import {
  useCallback,
  useMemo,
  useState,
  type ChangeEvent,
  type ComponentProps,
  type KeyboardEvent,
} from "react";
import { useForm } from "react-hook-form";

type FilterForm = {
  type: {
    value: string;
    op: FlashcardFilterOperator;
  };
};

export const useFlashcardFilter = () => {
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");

  const sortForm = useForm<{
    field: SortableFlashcardField;
    order: SortingOrder;
  }>({
    defaultValues: {
      field: "createdAt",
      order: "DESC",
    },
  });

  const filterForm = useForm<FilterForm>({
    defaultValues: {
      type: {
        value: 'all_type',
        op: 'eq'
      }
    },
  });

  const sort = sortForm.watch();
  const filter = filterForm.watch();

  const onUpdate = useCallback(() => {
    const queries: string[] = [`sortBy=${sort.field}:${sort.order}`];
    if (search.trim()) {
      queries.push(`search=${search}`);
    }
    for (const [key, value] of Object.entries(filter)) {
      if (!value || value.value === 'all_type') continue;
      queries.push(`filter.${key}=$${value.op}:${value.value}`);
    }
    setQuery(queries.join("&"));
  }, [search, filter, sort]);

  const onEnterUpdate = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (!e.shiftKey && e.key === "Enter") {
        onUpdate();
      }
    },
    [onUpdate]
  );

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value),
    []
  );

  const resetFilter = useCallback(() => {
    filterForm.reset();
    sortForm.reset();
  }, [])

  return {
    onEnterUpdate,
    onUpdate,
    resetFilter,
    onChange,
    query,
    sort,
    filter,
    setFilterValue: filterForm.setValue,
    setSortValue: sortForm.setValue,
    search,
  };
};

export type FlashcardFilterHandlers = ReturnType<typeof useFlashcardFilter>;
