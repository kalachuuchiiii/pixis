export const ALLOWED_SORTING_FIELDS = [
  "createdAt",
  "updatedAt",
  "deletedAt",
] as const;
export const SORTING_ORDERS = ["ASC", "DESC"] as const;
export type AllowedSortingFields = (typeof ALLOWED_SORTING_FIELDS)[number];
export type SortingOrder = (typeof SORTING_ORDERS)[number];
