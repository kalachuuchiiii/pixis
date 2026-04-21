



export const VISIBILITY_ENUM = ['public', 'private', 'unlisted'] as const;

export type Visibility = typeof VISIBILITY_ENUM[number];