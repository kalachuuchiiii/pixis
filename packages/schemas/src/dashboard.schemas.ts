import z from "zod";
import { PercentageSchema, IDSchema } from "./common.schemas";
import { TimestampSchema } from "./common.schemas";
import { DeckTitleSchema } from "./deck.schemas";

export const DeckProgressSchema = z.object({
  deckId: IDSchema,
  title: DeckTitleSchema,
  averageAccuracy: PercentageSchema,
  totalAttempts: z.number().nonnegative(),
});

export const ProgressTrendSchema = z.object({
  date: TimestampSchema, // YYYY-MM-DD
  averageAccuracy: PercentageSchema,
});

export const DashboardSchema = z.object({
  deckAccuracies: z.array(DeckProgressSchema),
  retentionRate: PercentageSchema,
  progressTrends: z.array(ProgressTrendSchema),
  totalSessions: z.number().nonnegative(),
  totalFlashcardsReviewed: z.number().nonnegative(),
});

export type Dashboard = z.infer<typeof DashboardSchema>;
export type DeckAccuracy = z.infer<typeof DeckProgressSchema>;
export type ProgressTrend = z.infer<typeof ProgressTrendSchema>;
