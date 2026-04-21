import { useFilter } from "@/hooks/useFilter";
import { useQueryParam } from "@/hooks/useQueryParam";
import type {
  SortableCollectionField,
  SortingOrder,
  Visibility,
} from "@pixis/constants";
import { useCallback, useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";

type SortObject = {
  field?: SortableCollectionField;
  order?: SortingOrder;
};

type FilterObject = {
  createdAt?: {
    op?: "gte" | "btw";
    value?: string; //iso
  };
  visibility?: {
    op?: "eq";
    value?: Visibility | '*';
  };
};

export const useCollectionFilter = (
  blacklistedFields: (keyof FilterObject)[] = []
) => {
  const sortForm = useForm<SortObject>({
    defaultValues: {
      field: 'createdAt',
      order: 'DESC'
    }
  });
  const filterForm = useForm<FilterObject>();

  const filter = useFilter({ sortForm, filterForm, blacklistedFields });

  return {
    ...filter,
    sortForm,
    filterForm,
  };
};

export type CollectionFilterHandler = ReturnType<typeof useCollectionFilter>;
