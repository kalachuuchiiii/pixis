import z from "zod";
import {
  NICKNAME_MAX,
  NICKNAME_MIN,
  USERNAME_MAX,
  USERNAME_MIN,
} from "@pixis/constants";
import { IDSchema, TimestampSchema } from "./common.schemas";

export const UsernameSchema = z
  .string("Username is required")
  .min(USERNAME_MIN, `Username must be at least ${USERNAME_MIN} characters`)
  .max(USERNAME_MAX, `Username must be at most ${USERNAME_MAX} characters`)
  .regex(/^[a-zA-Z0-9]+$/, "Username must be alphanumeric with no spaces")
  .trim()
  .toLowerCase();

export const NicknameSchema = z
  .string()
  .min(NICKNAME_MIN, `Nickname must be at least ${NICKNAME_MIN} characters`)
  .max(NICKNAME_MAX, `Nickname must be at most ${NICKNAME_MAX} characters`)
  .regex(
    /^(?:$|(?=[^ ]*(?: [^ ]*){0,2}$)[a-zA-Z0-9_ ]+)$/,
    "Nickname can only contain letters, numbers, underscore, and at most one space (no emojis)"
  )
  .trim();

export const AvatarUrlSchema = z
  .string("Avatar must be a string")
  .min(1, "Avatar ID cannot be empty")
  .nullable()
  .optional();

export const PointSchema = z.object({
  id: IDSchema,
  currentPoints: z
    .int("Current points must be an integer")
    .nonnegative("Current points cannot be negative"),
  highestPoints: z
    .int("Highest points must be an integer")
    .nonnegative("Highest points cannot be negative"),
});

export const UserStatsSchema = z.object({
  deckStudiedCount: z.number().nonnegative(),
  averageAccuracy: z.float64().nonnegative(),
  rank: z.coerce.number().nonnegative().positive(),
  flashcardAnsweredCount: z.number().nonnegative(),
});

export const streakSchema = z.object({
  id: IDSchema,
  currentStreak: z
    .int("Current streak must be an integer")
    .nonnegative("Current streak cannot be negative"),
  highestStreak: z
    .int("Highest streak must be an integer")
    .nonnegative("Highest streak cannot be negative"),
  lastActionTimestamp: TimestampSchema,
});

const FollowStatSchema = z.object({
  followerCount: z.coerce.number().nonnegative(),
  followingCount: z.coerce.number().nonnegative(),
});

export const UserSchema = z
  .object({
    id: IDSchema,
    username: UsernameSchema,
    nickname: NicknameSchema,

    avatarUrl: AvatarUrlSchema,
    lastUsernameUpdate: TimestampSchema,
    isPrivate: z.boolean(),
    isFollowing: z.coerce.boolean<boolean>().catch(false),
    lastNicknameUpdate: TimestampSchema,
    createdAt: TimestampSchema,
    point: PointSchema,
    streak: streakSchema,
  })
  .and(FollowStatSchema);

export const UpdateUserFormSchema = z.object({
  username: UsernameSchema,
  nickname: NicknameSchema,
});

export const UserBadgeSchema = z.object({
  username: UsernameSchema,
  nickname: NicknameSchema,
  avatarUrl: AvatarUrlSchema,
  id: IDSchema,
});

export const UserBadgeWithFollowStatsSchema =
  UserBadgeSchema.and(FollowStatSchema);

export const UserWithStatsSchema = UserSchema.and(UserStatsSchema);

export type UserWithStats = z.infer<typeof UserWithStatsSchema>;
export type Id = z.infer<typeof IDSchema>;
export type Username = z.infer<typeof UsernameSchema>;
export type Nickname = z.infer<typeof NicknameSchema>;
export type AvatarUrl = z.infer<typeof AvatarUrlSchema>;
export type UserBadge = z.infer<typeof UserBadgeSchema>;
export type UserBadgeWithFollowStats = z.infer<
  typeof UserBadgeWithFollowStatsSchema
>;
export type Point = z.infer<typeof PointSchema>;
export type Streak = z.infer<typeof streakSchema>;
export type User = z.infer<typeof UserSchema>;
export type UpdateUserForm = z.infer<typeof UpdateUserFormSchema>;
