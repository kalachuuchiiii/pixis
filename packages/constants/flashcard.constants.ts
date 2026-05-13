export const QUESTION_MIN = 1;
export const QUESTION_MAX = 300;

export const ANSWER_MIN = 1;
export const ANSWER_MAX = 150;

export const FLASHCARD_TYPES = ["open_ended", "close_ended"] as const;

export const CHOICES_MIN = 2;
export const CHOICES_MAX = 6;
export const SORTABLE_FLASHCARD_FIELDS = ["createdAt", "updatedAt"] as const;
export const FILTERABLE_FLASHCARD_FIELDS = ["type"] as const;
export const FLASHCARD_FILTER_OPERATORS = ["eq"] as const;
export const SEARCHABLE_FLASHCARD_FIELDS = ["question", "answer"] as const;

export type FlashcardFilterOperator =
  (typeof FLASHCARD_FILTER_OPERATORS)[number];
export type SortableFlashcardField = (typeof SORTABLE_FLASHCARD_FIELDS)[number];
export type FilterableFlashcardField =
  (typeof FILTERABLE_FLASHCARD_FIELDS)[number];
export type SearchableFlashcardField =
  (typeof SEARCHABLE_FLASHCARD_FIELDS)[number];
export type FlashcardType = (typeof FLASHCARD_TYPES)[number];
