import { EXAM_MODE_ENUM } from "@pixis/constants";
import z from "zod";
import { idSchema } from "./user.schemas";
import { timestampSchema } from "./timestamp.schemas";

export const examModeSchema = z.preprocess(
  (v) => String(v || "").toUpperCase(),
  z.enum(EXAM_MODE_ENUM)
);

export const sessionSchema = z.object({
  deckId: idSchema,
  mode: examModeSchema,
  createdAt: timestampSchema,
  id: idSchema,
  cancelledAt: timestampSchema.nullable().optional(),
  finishedAt: timestampSchema.nullable().optional(),
  abandonedAt: timestampSchema.nullable().optional(),
  totalPointsGained: z.number().nonnegative(),
  accuracy: z.number().nonnegative(),
  deck: z
    .object({
      id: idSchema,
      flashcardIds: z.array(idSchema).nullable().optional(),
    })
    .nullable()
    .optional(),
});

export type Session = z.infer<typeof sessionSchema>;
