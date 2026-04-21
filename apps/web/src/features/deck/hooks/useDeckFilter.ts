import { useFilter } from "@/hooks/useFilter";
import type {
  DeckFilterOperation,
  SortableDeckField,
  SortingOrder,
  Visibility,
} from "@pixis/constants";
import { useForm } from "react-hook-form";

export type SortObject = {
  field?: SortableDeckField;
  order?: SortingOrder;
};

export type FilterObject = {
  visibility?: {
    op: "eq";
    value: Visibility | "*";
  };
  createdAt?: {
    op: DeckFilterOperation;
    value: string | '*';
  };
};

export const useDeckFilter = () => {
  const sortForm = useForm<SortObject>({
    defaultValues: {
      field: 'createdAt',
      order: 'DESC'
    }
  });
  const filterForm = useForm<FilterObject>({
    defaultValues: {
      visibility: {
        value: '*',
        op: 'eq'
      }
    }
  });

  const deckFilter = useFilter({ sortForm, filterForm });
  return deckFilter;
};

export type DeckFilterHandler = ReturnType<typeof useDeckFilter>;
