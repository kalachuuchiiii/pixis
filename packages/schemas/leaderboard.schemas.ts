import z from "zod";
import { pointSchema, userBadgeSchema, userStatsSchema } from "./user.schemas";

export const deckPointsSchema = z.coerce.number().nonnegative();

export const topDeckUserSchema = userBadgeSchema.and(
  z.object({ deckPoints: z.coerce.number().nonnegative() })
);
export const topGlobalUserSchema = userBadgeSchema.and(userStatsSchema);

export type TopGlobalUser = z.infer<typeof topGlobalUserSchema>;
export type TopDeckUser = z.infer<typeof topDeckUserSchema>;
