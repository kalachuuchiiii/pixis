import { EXAM_MODE_ENUM, SESSION_STATUS } from "@pixis/constants";
import z from "zod";
import { IDSchema, PercentageSchema } from "./common.schemas";
import { TimestampSchema } from "./common.schemas";

export const ExamModeSchema = z.preprocess(
  (v) => String(v || "").toUpperCase(),
  z.enum(EXAM_MODE_ENUM, "Invalid exam mode")
);

export const SessionStatusSchema = z.enum(
  SESSION_STATUS,
  "Invalid session status"
);

export const SessionSchema = z.object({
  deckId: IDSchema,
  mode: ExamModeSchema,
  startedAt: TimestampSchema,
  id: IDSchema,
  status: SessionStatusSchema,
  stoppedAt: TimestampSchema.nullable(),
  totalPointsGained: z.number().nonnegative(),
  accuracy: PercentageSchema,
  deck: z
    .object({
      id: IDSchema,
      flashcardIds: z.array(IDSchema),
    })
    .nullable()
    .optional(),
});

export type Session = z.infer<typeof SessionSchema>;
