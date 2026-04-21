

export const SORTABLE_COLLECTION_FIELDS = ['createdAt', 'updatedAt', 'deckCount'] as const;
export type SortableCollectionField = typeof SORTABLE_COLLECTION_FIELDS[number];