export const COLLECTION_NAME_MIN = 0;
export const COLLECTION_NAME_MAX = 30;
export const SORTABLE_COLLECTION_FIELDS = ["createdAt", "updatedAt"] as const;
export type SortableCollectionField =
  (typeof SORTABLE_COLLECTION_FIELDS)[number];
