import z from "zod";


export const pageSchema = z.coerce.number().positive().catch(1);
export const limitSchema = z.coerce.number().positive().catch(10);
export const searchSchema = z.string().optional().default('').catch('');

export const querySchema = z.object({
    page: pageSchema,
    limit: limitSchema,
    search: searchSchema
}).transform((d) => ({...d, skip: (d.page - 1) * d.limit}));

export type Query = z.infer<typeof querySchema>;