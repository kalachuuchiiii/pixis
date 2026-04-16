import z from "zod";

export const timeSchema = z.coerce.date().refine((d) => d < new Date()).transform((d) => d.toISOString())
export const createdAtSchema = timeSchema;
export const updatedAtSchema = timeSchema;