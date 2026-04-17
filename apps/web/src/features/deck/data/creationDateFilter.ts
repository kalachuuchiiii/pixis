import type { DeckFilterOperation } from "@pixis/constants";
import { endOfDay, startOfDay } from "date-fns";

const today = new Date(Date.now());
today.setHours(0, 0, 0, 0);
export type CreationDateFilter =
  | {
      description: string;
      value: string; //ISO
      op:  'gte' | 'btw'
      key: "TODAY" | "LAST_7_DAYS" | "LAST_30_DAYS";
    }
  | {
      description: string;
      value?: undefined; //ISO
      op?: undefined;
      key: "ALL_TIME";
    };
const start = startOfDay(today).toISOString();
const end = endOfDay(today).toISOString();

export const creationDateFilters: CreationDateFilter[] = [
  {
    key: "ALL_TIME",
    description: "All time",
  },
  {
    key: "TODAY",
    description: "Today",
    value: `${start},${end}`,
    op: "btw",
  },
  {
    key: "LAST_7_DAYS",
    description: "Last 7 Days",
    value: new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 7
    ).toISOString(),
    op: "gte",
  },
  {
    description: "Last 30 Days",
    key: "LAST_30_DAYS",
    value: new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 30
    ).toDateString(),
    op: "gte",
  },
];
