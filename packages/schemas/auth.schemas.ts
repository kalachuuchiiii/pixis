import z from "zod";
import { usernameSchema } from "./user.schemas";
import { PASSWORD_MAX, PASSWORD_MIN } from "@pixis/constants";

export const passwordSchema = z
  .string()
  .min(PASSWORD_MIN, { message: `Password must be at least ${PASSWORD_MIN} characters long` })
  .max(PASSWORD_MAX, { message: `Password must not exceed ${PASSWORD_MAX} characters` })
  .regex(/^\S+$/, { message: "Password must not contain spaces" })
  .trim()
  .transform((val) => val.toLowerCase());

export const signUpFormSchema = z
  .object({
    username: usernameSchema,
    password: passwordSchema,
    confirmPassword: passwordSchema,
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

export const signInFormSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
});

export const authPayloadSchema = z.object({
  username: usernameSchema,
  id: z.number()
})

export const updatePasswordFormSchema = z.object({
  oldPassword: passwordSchema,
  newPassword: passwordSchema
})

export type UpdatePasswordForm = z.infer<typeof updatePasswordFormSchema>;
export type SignUpForm = z.infer<typeof signUpFormSchema>;
export type SignInForm = z.infer<typeof signInFormSchema>;
