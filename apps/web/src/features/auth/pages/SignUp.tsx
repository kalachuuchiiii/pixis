import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Controller, useForm } from "react-hook-form";
import { signUpFormSchema, type SignUpForm } from "@pixis/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../hooks/useAuth";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";

const SignUp = () => {
  const { signUp, isSigningUp } = useAuth();

  const form = useForm<SignUpForm>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      hasAgreedToPrivacyPolicy: false,
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    await signUp(data);
  });

  return (
    <div className="space-y-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div>
        <h2
          className="text-[26px] font-normal text-stone-900 dark:text-white mb-1"
          style={{ fontFamily: "'DM Serif Display', serif" }}
        >
          Create an account
        </h2>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          Start building your flashcard library today.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-5">
        <Controller
          control={form.control}
          name="username"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Username</FieldLabel>
              <Input
                {...field}
                placeholder="e.g. jane_doe"
                className="dark:bg-stone-900 dark:border-stone-700"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Password</FieldLabel>
              <Input
                {...field}
                type="password"
                placeholder="••••••••"
                className="dark:bg-stone-900 dark:border-stone-700"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="confirmPassword"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Confirm Password</FieldLabel>
              <Input
                {...field}
                type="password"
                placeholder="••••••••"
                className="dark:bg-stone-900 dark:border-stone-700"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Privacy Checkbox */}
        <Controller
          control={form.control}
          name="hasAgreedToPrivacyPolicy"
          render={({ field, fieldState }) => (
            <Field>
              <div className="flex items-start gap-3">
                <Checkbox
                  className="size-4 mt-0.5 dark:bg-stone-900"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <div className="text-[13px] text-stone-500 dark:text-stone-400 leading-relaxed">
                  I agree to Pixis's{" "}
                  <Dialog>
                    <DialogTrigger asChild>
                      <button
                        type="button"
                        className="text-stone-900 dark:text-white underline hover:text-stone-700 dark:hover:text-stone-300 font-medium transition-colors"
                      >
                        Privacy Policy
                      </button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Privacy Policy</DialogTitle>
                      </DialogHeader>
                      <p className="text-sm text-stone-500 dark:text-stone-400">
                        Your data is safe. (shortened version for demo)
                      </p>
                    </DialogContent>
                  </Dialog>{" "}
                  and Terms of Service.
                </div>
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-11 text-base font-medium"
          disabled={isSigningUp}
        >
          {isSigningUp ? "Creating account..." : "Create account"}
        </Button>
      </form>

      {/* Footer Link */}
      <p className="text-center text-sm text-stone-500 dark:text-stone-400">
        Already have an account?{" "}
        <NavLink
          to="/sign-in"
          className="text-stone-900 dark:text-white font-medium hover:underline transition-all"
        >
          Sign in
        </NavLink>
      </p>
    </div>
  );
};

export default SignUp;