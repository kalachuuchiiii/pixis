import { useFilter } from "@/hooks/useFilter";
import {
  type FlashcardFilterOperator,
  type SortableFlashcardField,
  type SortingOrder,
} from "@pixis/constants";

import { useForm } from "react-hook-form";

type FilterForm = {
  type?: {
    value: string | "*";
    op: FlashcardFilterOperator;
  };
};

export const useFlashcardFilter = (
  blacklistedFields: (keyof FilterForm)[] = []
) => {
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
        value: "*",
        op: "eq",
      },
    },
  });

  const filter = useFilter({ sortForm, filterForm, blacklistedFields });

  return {
    ...filter,
    sortForm,
    filterForm,
  };
};

export type FlashcardFilterHandler = ReturnType<typeof useFlashcardFilter>;
