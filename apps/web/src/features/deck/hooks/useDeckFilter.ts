import type {
  SortableDeckField,
  FilterableDeckField,
  Visibility,
  SortingOrder,
  DeckFilterOperation,
} from "@pixis/constants";
import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

export type SortObject = {
  field: SortableDeckField;
  order: SortingOrder;
};

export type FilterObject = {
  visibility: {
    op: "eq";
    value: Visibility;
  };
  createdAt?: {
    op: DeckFilterOperation;
    value: Date;
  };
  updatedAt?: {
    op: DeckFilterOperation;
    value: Date;
  };
};

export const useDeckFilter = () => {
  const [updatedQuery, setUpdatedQuery] = useState('');
  const sortForm = useForm<SortObject>({
    defaultValues: {
      field: "popularityScore",
      order: "DESC",
    },
  });
  const sort = sortForm.watch();

  const filterForm = useForm<FilterObject>({
    defaultValues: {
      visibility: {
        op: "eq",
        value: "public",
      },
    },
  });
  const filter = filterForm.watch();

  const query = useMemo(() => {
    let baseQuery = `sortBy=${sort.field}:${sort.order}`;
    let filterQuery: string = "";

    for (const [key, value] of Object.entries(filter)) {
      if (!value) continue;
      filterQuery += `filter.${key}=$${value.op}:${value.value}`;
    }
    return `${baseQuery}&${filterQuery}`;
  }, [filter, sort]);

  const onUpdate = useCallback(() => {
    setUpdatedQuery(query);
  }, [query]);

  return {
    query,
    onUpdate,
    updatedQuery,
    setSortValue: sortForm.setValue,
    setFilterValue: filterForm.setValue,
    sort,
    filter,
  };
};

export type DeckFilterHandlers = ReturnType<typeof useDeckFilter>;
