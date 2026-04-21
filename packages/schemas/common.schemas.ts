import { VISIBILITY_ENUM } from "@pixis/constants";
import z from "zod";


export const visibilitySchema = z.enum(VISIBILITY_ENUM);
