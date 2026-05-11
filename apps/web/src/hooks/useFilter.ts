import { useState, type ChangeEvent } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";

export const useFilter = <T extends FieldValues, K extends FieldValues>({
  sortForm,
  filterForm,
  blacklistedFields = [],
}: {
  sortForm: UseFormReturn<T, any, T>;
  filterForm: UseFormReturn<K, any, K>;
  blacklistedFields?: (keyof K)[];
}) => {
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");

  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) =>
    setSearch(e.target.value);

  const resetFilter = () => {
    sortForm.reset();
    filterForm.reset();
  };

  const updateQuery = () => {
    const sort = sortForm.getValues();
    const filter = filterForm.getValues();

    const queries: string[] = [`sortBy=${sort.field}:${sort.order}`];
    if (search.trim()) {
      queries.push(`search=${search}`);
    }
    for (const [field, value] of Object.entries(filter)) {
      if (
        !value ||
        value?.value === "*" ||
        !value?.value ||
        blacklistedFields.includes(field)
      )
        continue;
      queries.push(`filter.${field}=$${value.op}:${value.value}`);
    }
    setQuery(queries.join("&"));
  };

  const updateQueryOnEnter = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLButtonElement>
  ) => {
    if (!e.shiftKey && e.key === "Enter") {
      updateQuery();
    }
  };

  return {
    query,
    search,
    handleChangeSearch,
    resetFilter,
    sortForm,
    filterForm,
    updateQueryOnEnter,
    updateQuery,
    blacklistedFields,
  };
};

export type FilterHandler<
  T extends FieldValues = FieldValues,
  K extends FieldValues = FieldValues,
> = ReturnType<typeof useFilter<T, K>>;
