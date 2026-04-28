import z from "zod";

export const timestampSchema = z.coerce.date().refine((d) => d < new Date()).transform((d) => d.toISOString())
