



export const TITLE_MIN = 0;
export const TITLE_MAX = 60;

export const DESCRIPTION_MIN = 0;
export const DESCRIPTION_MAX = 250;

export const TOTAL_FLASHCARDS_MAX = 100;
export const TOTAL_FLASHCARDS_MIN = 0;

export const VISIBILITY_ENUM = ['public', 'private', 'unlisted'] as const;

export const SORT_BY_ENUM = ['updatedAt', 'createdAt'] as const;

export type SortBy = typeof SORT_BY_ENUM[number];
export type Visibility = typeof VISIBILITY_ENUM[number];