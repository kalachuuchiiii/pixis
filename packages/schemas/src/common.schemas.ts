import { VISIBILITY_ENUM } from "@pixis/constants";
import z from "zod";

export const VisibilitySchema = z.enum(VISIBILITY_ENUM);
export const TimestampSchema = z.coerce
  .date()
  .refine((d) => d < new Date(), "Date cannot be in the future")
  .transform((d) => d.toISOString());

export const DatesSchema = z.object({
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});

export const IDSchema = z.coerce
  .number("ID must be a number")
  .int("ID must be an integer")
  .positive("ID must be a positive number");

export const PercentageSchema = z
  .float64()
  .min(0, {
    message: "% must be at least 0",
  })
  .max(100, {
    message: "% must not exceed 100",
  });

export const ColorSchema = z
  .string()
  .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Color must be hex");
