



export const TITLE_MIN = 0;
export const TITLE_MAX = 60;

export const DESCRIPTION_MIN = 0;
export const DESCRIPTION_MAX = 250;

export const TOTAL_FLASHCARDS_MAX = 100;
export const TOTAL_FLASHCARDS_MIN = 0;

export const VISIBILITY_ENUM = ['public', 'private', 'unlisted'] as const;

export const SORTABLE_DECK_FIELDS = ['updatedAt', 'createdAt', 'popularityScore', 'savedCount', 'participantCount'] as const;
export const FILTERABLE_DECK_FIELDS = ['visibility', 'createdAt', 'updatedAt'] as const;
export const DECK_FILTER_OPERATIONS = ['eq', 'lte', 'gte'] as const;

export type DeckFilterOperation = typeof DECK_FILTER_OPERATIONS[number];
export type FilterableDeckField = typeof FILTERABLE_DECK_FIELDS[number]
export type SortableDeckField = typeof SORTABLE_DECK_FIELDS[number];
export type Visibility = typeof VISIBILITY_ENUM[number];