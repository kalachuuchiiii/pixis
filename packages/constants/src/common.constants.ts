export const VISIBILITY_ENUM = ["public", "private"] as const;

export type Visibility = (typeof VISIBILITY_ENUM)[number];
