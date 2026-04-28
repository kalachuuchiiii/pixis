import { EXAM_MODE_ENUM } from "@pixis/constants";
import z from "zod";
import { idSchema } from "./user.schemas";
import { timestampSchema } from "./timestamp.schemas";

export const examModeSchema = z.enum(EXAM_MODE_ENUM);

export const sessionSchema = z.object({
  deckId: idSchema,
  mode: examModeSchema,
  userId: idSchema,
  id: idSchema,
  cancelledAt: timestampSchema.nullable().optional(),
  finishedAt: timestampSchema.nullable().optional(),
  deck: z.object({
    id: idSchema,
    flashcardIds: z.array(idSchema).nullable().optional(),
  }),
});

export type Session = z.infer<typeof sessionSchema>;
