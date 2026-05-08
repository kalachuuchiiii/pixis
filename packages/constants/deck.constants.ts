export const TITLE_MIN = 0;
export const TITLE_MAX = 100;

export const TOPIC_MIN = 1;
export const TOPIC_MAX = 100;

export const DESCRIPTION_MIN = 0;
export const DESCRIPTION_MAX = 300;

export const TOTAL_FLASHCARDS_MAX = 100;
export const TOTAL_FLASHCARDS_MIN = 0;
export const SORTABLE_DECK_FIELDS = ["updatedAt", "createdAt"] as const;
export const FILTERABLE_DECK_FIELDS = [
  "visibility",
  "createdAt",
  "updatedAt",
] as const;
export const SEARCHABLE_DECK_FIELDS = ["title"] as const;
export const DECK_FILTER_OPERATIONS = ["btw", "lte", "gte"] as const;

export type DeckFilterOperation = (typeof DECK_FILTER_OPERATIONS)[number];
export type FilterableDeckField = (typeof FILTERABLE_DECK_FIELDS)[number];
export type SortableDeckField = (typeof SORTABLE_DECK_FIELDS)[number];
export type SearchableDeckField = (typeof SEARCHABLE_DECK_FIELDS)[number];
