import z from "zod";
import { UserBadgeSchema } from "./user.schemas";
import { PercentageSchema } from "./common.schemas";

export const TopUserSchema = UserBadgeSchema.extend({
  points: z.number().nonnegative(),
  averageAccuracy: PercentageSchema,
  rank: z.number().nonnegative(),
});

export type TopUser = z.infer<typeof TopUserSchema>;
