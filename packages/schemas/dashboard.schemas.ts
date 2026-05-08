import z from "zod";
import { idSchema } from "./user.schemas";
import { timestampSchema } from "./timestamp.schemas";

export const deckAccuracySchema = z.object({
  deckId: idSchema,
  title: z.string(),
  averageAccuracy: z.float64().min(0).max(100),
  totalAttempts: z.number().int().nonnegative(),
});

export const progressTrendSchema = z.object({
  date: timestampSchema, // YYYY-MM-DD
  averageAccuracy: z.float64().min(0).max(100),
});

export const dashboardSchema = z.object({
  deckAccuracies: z.array(deckAccuracySchema),
  retentionRate: z.float64().min(0).max(100),
  progressTrends: z.array(progressTrendSchema),
  totalSessions: z.number().int().nonnegative(),
  totalFlashcardsReviewed: z.number().int().nonnegative(),
});

export type Dashboard = z.infer<typeof dashboardSchema>;
export type DeckAccuracy = z.infer<typeof deckAccuracySchema>;
export type ProgressTrend = z.infer<typeof progressTrendSchema>;
