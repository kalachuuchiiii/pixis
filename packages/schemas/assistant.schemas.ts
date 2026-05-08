import z from "zod";
import {
  colorSchema,
  rawDeckFormSchema,
  titleSchema,
  topicSchema,
} from "./deck.schemas.ts";
import { flashcardFormSchema } from "./flashcard.schemas.ts";
import { visibilitySchema } from "./common.schemas";
import { idSchema } from "./user.schemas";
import { timestampSchema } from "./timestamp.schemas";

export const ChatTypeSchema = z.enum(["generate", "text"]);
export const BaseMessageSchema = z.object({
  content: z.string(),
  role: z.enum(["user", "assistant"]),
});

export const ChatMessageSchema = BaseMessageSchema.extend({
  type: ChatTypeSchema,
  id: idSchema,
});

export const GeneratedSetSchema = rawDeckFormSchema.and(
  z.object({
    flashcards: z.array(flashcardFormSchema).max(50),
  })
);

export const AssistantResponseTypeSchema = z.enum(["generate", "text"]);

export const AssistantResponseSchema = z.object({
  role: z.literal("assistant"),
  content: z.string(),
  conversationTitle: z.string(),
  type: AssistantResponseTypeSchema,
  set: GeneratedSetSchema.nullable().optional(),
});

export const ConversationSchema = z.object({
  title: z.string(),
  id: idSchema,
  updatedAt: timestampSchema,
});

export type Conversation = z.infer<typeof ConversationSchema>;
export type BaseMessage = z.infer<typeof BaseMessageSchema>;
export type ChatMessage = z.infer<typeof ChatMessageSchema>;
export type GeneratedSet = z.infer<typeof GeneratedSetSchema>;
