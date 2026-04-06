import {
  ANSWER_MAX,
  ANSWER_MIN,
  CHOICES_MAX,
  CHOICES_MIN,
  QUESTION_MAX,
  QUESTION_MIN,
  TYPE_ENUM,
} from "@pixis/constants";
import z from "zod";
import { idSchema } from "./user.schemas";

export const questionSchema = z.string().min(QUESTION_MIN).max(QUESTION_MAX);
export const answerSchema = z.string().min(ANSWER_MIN).max(ANSWER_MAX);
export const choicesSchema = z
  .array(answerSchema)
  .min(CHOICES_MIN)
  .max(CHOICES_MAX);

export const typeSchema = z.enum(TYPE_ENUM);

export const openEndedFlashcardSchema = z.object({
    type: z.literal('open_ended'),
    question: questionSchema,
    deckId: idSchema,
    answer: answerSchema,
    choices: z.null().catch(null),
})

export const closeEndedFlashcardSchema = z.object({
    type: z.literal('close_ended'),
    question: questionSchema,
    deckId: idSchema,
    answer: answerSchema,
    choices: choicesSchema
}).refine((data) => data.choices.includes(data.answer));

export const flashcardSchema = z.discriminatedUnion('type', [openEndedFlashcardSchema, closeEndedFlashcardSchema]);

export type Flashcard = z.infer<typeof flashcardSchema>;
