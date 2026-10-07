export const MESSAGE_ROLES = ["user", "assistant"] as const;
export const MESSAGE_TYPES = ["generate", "text"] as const;

export const MESSAGE_CONTENT_MIN = 1 as const;
export const MESSAGE_CONTENT_MAX = 10000 as const;

export const GENERATED_FLASHCARD_MAX = 30;

export const CONVERSATION_TITLE_MIN = 1 as const;
export const CONVERSATION_TITLE_MAX = 50 as const;

export type MessageRole = (typeof MESSAGE_ROLES)[number];
export type MessageType = (typeof MESSAGE_TYPES)[number];
