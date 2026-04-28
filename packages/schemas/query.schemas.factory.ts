import { SORTING_ORDERS, type SortingOrder } from "@pixis/constants";
import z from "zod";

export const createSortSchema = <T extends readonly string[]>(allowedFields: T) => {
  return z
    .array(
      z.string().transform((d, ctx) => {
        try {
          const [sortBy, sortOrder] = d.split(",") as [
            (typeof allowedFields)[number],
            SortingOrder,
          ];
          if (
            !allowedFields.includes(sortBy) ||
            !SORTING_ORDERS.includes(sortOrder)
          ) {
            ctx.addIssue("Invalid field or sorting order.");
            return z.NEVER;
          }
          return {
            sortBy,
            sortOrder,
          };
        } catch (e) {
          ctx.addIssue("Invalid field or sorting order");
        }
      })
    )
    .max(3);
};
