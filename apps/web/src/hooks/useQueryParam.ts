import type { SortingOrder } from "@pixis/constants";

export const useQueryParam = (blacklistedFields: string[] = []) => {
  const update = (
    callback: (query: string) => void,
    {
      sort,
      search,
      filter,
    }: {
      sort: { field: string; order: SortingOrder };
      search: string;
      filter: Record<string, { value: string; op: string }>;
    }
  ) => {
    const queries: string[] = [`sortBy=${sort.field}:${sort.order}`];
    if (search.trim()) {
      queries.push(`search=${search}`);
    }
    for (const [field, value] of Object.entries(filter)) {
      if (
        !value ||
        !value.value ||
        !value.op ||
        blacklistedFields.includes(field)
      )
        continue;
      queries.push(`filter.${field}=$${value.op}:${value.value}`);
    }
    callback(queries.join("&"));
  };

  return {
    update,
  };
};
