import z from "zod";
import { TimestampSchema, VisibilitySchema } from "./common.schemas";
import { IDSchema } from "./common.schemas";
import {
  CONVERSATION_TITLE_MAX,
  CONVERSATION_TITLE_MIN,
  GENERATED_FLASHCARD_MAX,
  MESSAGE_CONTENT_MAX,
  MESSAGE_CONTENT_MIN,
  MESSAGE_ROLES,
  MESSAGE_TYPES,
  TOTAL_FLASHCARDS_MAX,
  TOTAL_FLASHCARDS_MIN,
} from "@pixis/constants";
import { FlashcardFormSchema } from "./flashcard.schemas";
import { DeckFormSchema } from "./deck.schemas";

export const MessageTypeSchema = z.enum(MESSAGE_TYPES);
export const MessageRoleSchema = z.enum(MESSAGE_ROLES);
export const MessageContentSchema = z.string().min(0).max(MESSAGE_CONTENT_MAX);

export const BaseMessageSchema = z.object({
  content: MessageContentSchema,
  role: MessageRoleSchema,
});

export const MessageSchema = BaseMessageSchema.extend({
  type: MessageTypeSchema,
  id: IDSchema,
});

export const GeneratedSetFlashcardsSchema = z
  .array(FlashcardFormSchema)
  .min(TOTAL_FLASHCARDS_MIN, `Generated flashcard is not enough...`)
  .max(GENERATED_FLASHCARD_MAX, `Generated flashcard exceeded the limit...`);

export const GeneratedSetSchema = DeckFormSchema.extend({
  flashcards: GeneratedSetFlashcardsSchema,
  visibility: VisibilitySchema.catch("public"),
});

export const ConversationTitleSchema = z
  .string()
  .min(
    CONVERSATION_TITLE_MIN,
    `Conversation title must contain at least ${CONVERSATION_TITLE_MIN} character`
  )
  .max(
    CONVERSATION_TITLE_MAX,
    `Conversation title must contain at most ${CONVERSATION_TITLE_MAX} characters`
  );

export const GenerateTypeResponseSchema = z.object({
  role: z.literal("assistant"),
  content: MessageContentSchema,
  conversationTitle: ConversationTitleSchema,
  type: z.literal("generate"),
  set: GeneratedSetSchema,
});

export const TextTypeResponseSchema = z.object({
  role: z.literal("assistant"),
  content: MessageContentSchema,
  conversationTitle: ConversationTitleSchema,
  type: z.literal("text"),
  set: z.null().optional(),
});

export const AssistantResponseSchema = z.discriminatedUnion("type", [
  GenerateTypeResponseSchema,
  TextTypeResponseSchema,
]);

export const ConversationSchema = z.object({
  title: ConversationTitleSchema,
  id: IDSchema,
  updatedAt: TimestampSchema,
});

export type GenerateTypeResponse = z.infer<typeof GenerateTypeResponseSchema>;
export type TextTypeResponse = z.infer<typeof TextTypeResponseSchema>;
export type AssistantResponse = z.infer<typeof AssistantResponseSchema>;
export type Conversation = z.infer<typeof ConversationSchema>;
export type BaseMessage = z.infer<typeof BaseMessageSchema>;
export type Message = z.infer<typeof MessageSchema>;
export type GeneratedSet = z.infer<typeof GeneratedSetSchema>;
