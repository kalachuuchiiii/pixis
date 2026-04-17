

export const COLLECTION_VISIBILITY_ENUM = ['public', 'private'] as const;
export const SORTABLE_COLLECTION_FIELDS = ['createdAt', 'updatedAt', 'deckCount'] as const;

export type CollectionVisibility = typeof COLLECTION_VISIBILITY_ENUM[number];
export type SortableCollectionField = typeof SORTABLE_COLLECTION_FIELDS[number];