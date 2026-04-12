import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInFormSchema, type SignInForm } from "@pixis/schemas";
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
    resolver: zodResolver(signInFormSchema),
  });

  const { handleSubmit } = form;
  const onSubmit = handleSubmit(async (data) => {
    await signIn(data);
  });

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Heading */}
      <h2
        className="text-[26px] font-normal text-stone-900 mb-1.5"
        style={{ fontFamily: "'DM Serif Display', serif" }}
      >
        Welcome back
      </h2>
      <p className="text-sm text-stone-400 mb-8">
        Sign in to continue learning.
      </p>

      <form onSubmit={onSubmit} className="space-y-3.5">
        {/* Username */}
        <Controller
          control={form.control}
          name="username"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Username</FieldLabel>
              <Input {...field} placeholder="Your username" />
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
              <Input {...field} type="password" placeholder="******" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

   
        {/* Submit */}
        <Button className="my-btn w-full" type="submit" disabled={isSigningIn}>
          Sign in
        </Button>
      </form>

      {/* Footer */}
      <p className="text-center text-[13px] text-stone-400 mt-7">
        Doesn't have an account?{" "}
        <NavLink
          to="/sign-up"
          className="text-stone-800 font-medium hover:text-stone-600 transition-colors"
        >
          Create one
        </NavLink>
      </p>
    </div>
  );
};

export default SignIn;
