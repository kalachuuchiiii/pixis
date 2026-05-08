import z from "zod";
import {
  NICKNAME_MAX,
  NICKNAME_MIN,
  USERNAME_MAX,
  USERNAME_MIN,
} from "@pixis/constants";
import { timestampSchema } from "./timestamp.schemas";

export const idSchema = z.coerce
  .number("ID must be a number")
  .int("ID must be an integer")
  .positive("ID must be a positive number");

export const usernameSchema = z
  .string("Username is required")
  .min(USERNAME_MIN, `Username must be at least ${USERNAME_MIN} characters`)
  .max(USERNAME_MAX, `Username must be at most ${USERNAME_MAX} characters`)
  .regex(/^[a-zA-Z0-9]+$/, "Username must be alphanumeric with no spaces")
  .trim()
  .toLowerCase();

export const nicknameSchema = z
  .string("Nickname is required")
  .min(NICKNAME_MIN, `Nickname must be at least ${NICKNAME_MIN} characters`)
  .max(NICKNAME_MAX, `Nickname must be at most ${NICKNAME_MAX} characters`)
  .regex(
    /^(?:$|(?=[^ ]*(?: [^ ]*){0,2}$)[a-zA-Z0-9_ ]+)$/,
    "Nickname can only contain letters, numbers, underscore, and at most one space (no emojis)"
  )
  .trim();

export const avatarPublicUrlSchema = z
  .string("Avatar must be a string")
  .min(1, "Avatar ID cannot be empty")
  .regex(/^[a-zA-Z0-9/_-]+$/, "Invalid Cloudinary public_id format")
  .nullable()
  .optional();

export const lastUsernameUpdateSchema = z.coerce
  .date()
  .refine((d) => d < new Date(), {
    message: "Last username update cannot be in the future",
    path: ["lastUsernameUpdate"],
  })
  .transform((d) => d.toISOString());

export const lastNicknameUpdateSchema = z.coerce
  .date()
  .refine((d) => d < new Date(), {
    message: "Last nickname update cannot be in the future",
    path: ["lastNicknameUpdate"],
  })
  .transform((d) => d.toISOString());

export const plainUserSchema = z.object({
  id: idSchema,
  username: usernameSchema,
  nickname: nicknameSchema,
  avatarPublicUrl: avatarPublicUrlSchema,
  lastUsernameUpdate: lastUsernameUpdateSchema,
  isPrivate: z.boolean(),
  lastNicknameUpdate: lastNicknameUpdateSchema,
  createdAt: timestampSchema,
});

export const pointSchema = z.object({
  id: idSchema,
  user: plainUserSchema.optional().nullable(),
  currentPoints: z
    .int("Current points must be an integer")
    .nonnegative("Current points cannot be negative"),
  highestPoints: z
    .int("Highest points must be an integer")
    .nonnegative("Highest points cannot be negative"),
});

export const lastActionTimestampSchema = z.coerce
  .date()
  .refine(
    (d) => d < new Date(),
    "Last action timestamp cannot be in the future"
  )
  .transform((d) => d.toISOString());

export const userStatsSchema = z.object({
  deckStudiedCount: z.number().nonnegative(),

  averageAccuracy: z.float64().nonnegative(),
  rank: z.coerce.number().nonnegative().positive(),
  flashcardAnsweredCount: z.number().nonnegative(),
});

export const streakSchema = z.object({
  id: idSchema,
  user: plainUserSchema.optional().nullable(),
  currentStreak: z
    .int("Current streak must be an integer")
    .nonnegative("Current streak cannot be negative"),
  highestStreak: z
    .int("Highest streak must be an integer")
    .nonnegative("Highest streak cannot be negative"),
  totalStreak: z
    .int("Total streak must be an integer")
    .nonnegative("Total streak cannot be negative"),
  lastActionTimestamp: lastActionTimestampSchema,
});

export const userSchema = plainUserSchema.extend({
  point: pointSchema,
  streak: streakSchema,
});

export const updateUserFormSchema = z.object({
  username: usernameSchema,
  nickname: nicknameSchema,
});

export const userBadgeSchema = z.object({
  username: usernameSchema,
  nickname: nicknameSchema,
  avatarPublicUrl: avatarPublicUrlSchema,
});

export const userWithStatsSchema = userSchema.and(userStatsSchema);

export type UserWithStats = z.infer<typeof userWithStatsSchema>;
export type Id = z.infer<typeof idSchema>;
export type Username = z.infer<typeof usernameSchema>;
export type Nickname = z.infer<typeof nicknameSchema>;
export type AvatarPublicUrl = z.infer<typeof avatarPublicUrlSchema>;
export type UserBadge = z.infer<typeof userBadgeSchema>;

export type PlainUser = z.infer<typeof plainUserSchema>;
export type Point = z.infer<typeof pointSchema>;
export type Streak = z.infer<typeof streakSchema>;
export type User = z.infer<typeof userSchema>;
export type UpdateUserForm = z.infer<typeof updateUserFormSchema>;
