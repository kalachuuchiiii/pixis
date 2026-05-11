import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInFormSchema, type SignInForm } from "@pixis/schemas";
import { Controller, useForm } from "react-hook-form";
import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

const SignIn = () => {
  const { signIn, isSigningIn } = useAuth();

  const form = useForm<SignInForm>({
    defaultValues: {
      username: "",
      password: "",
    },
    resolver: zodResolver(SignInFormSchema),
  });

  const onSubmit = form.handleSubmit(async (data) => {
    await signIn(data);
  });

  return (
    <div className="space-y-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div>
        <h2 className="text-[26px] font-normal text-zinc-900 heading dark:text-white mb-1">
          Welcome back
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Sign in to continue learning.
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
                placeholder="Your username"
                className="dark:bg-zinc-900 dark:border-zinc-700"
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
                className="dark:bg-zinc-900 dark:border-zinc-700"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Button
          type="submit"
          className="w-full h-11 text-base font-medium"
          disabled={isSigningIn}
        >
          {isSigningIn ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      {/* Footer Link */}
      <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
        Don't have an account?{" "}
        <NavLink
          to="/sign-up"
          className="text-zinc-900 dark:text-white font-medium hover:underline transition-all"
        >
          Create one
        </NavLink>
      </p>
    </div>
  );
};

export default SignIn;
