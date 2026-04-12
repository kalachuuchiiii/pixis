import z from "zod";

export const createdAtSchema = z.coerce.date().refine((d) => d < new Date()).transform((d) => d.toISOString());
export const updatedAtSchema = z.coerce.date().refine((d) => d < new Date()).transform((d) => d.toISOString());