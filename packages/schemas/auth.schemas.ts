import z from "zod";
import { IDSchema } from "./common.schemas";
import { PASSWORD_MAX, PASSWORD_MIN } from "@pixis/constants";
import { UsernameSchema } from "./user.schemas";

export const PasswordSchema = z
  .string()
  .min(
    PASSWORD_MIN,
    `Password must be at least ${PASSWORD_MIN} characters long`
  )
  .max(PASSWORD_MAX, `Password must not exceed ${PASSWORD_MAX} characters`)
  .regex(/^\S+$/, { message: "Password must not contain spaces" })
  .trim()
  .transform((val) => val.toLowerCase().trim());

export const SignUpFormSchema = z
  .object({
    username: UsernameSchema,
    password: PasswordSchema,
    confirmPassword: PasswordSchema,
    hasAgreedToPrivacyPolicy: z.boolean(),
  })
  .refine(
    (data) => data.confirmPassword === data.password,
    "Passwords do not match."
  )
  .refine(
    (data) => data.hasAgreedToPrivacyPolicy,
    "Please read and agree to the privacy policy first."
  );

export const SignInFormSchema = z.object({
  username: UsernameSchema,
  password: PasswordSchema,
});

export const UpdatePasswordFormSchema = z.object({
  oldPassword: PasswordSchema,
  newPassword: PasswordSchema,
});

export type UpdatePasswordForm = z.infer<typeof UpdatePasswordFormSchema>;
export type SignUpForm = z.infer<typeof SignUpFormSchema>;
export type SignInForm = z.infer<typeof SignInFormSchema>;
