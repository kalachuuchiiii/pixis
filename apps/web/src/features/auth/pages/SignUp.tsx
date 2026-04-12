import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import clsx from "clsx";
import { NavLink } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { signUpFormSchema, type SignUpForm } from "@pixis/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../hooks/useAuth";
import { Field, FieldError, FieldLabel, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

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

  const { handleSubmit } = form;

  const onSubmit = handleSubmit(async (data) => {
    await signUp(data);
  });

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-3.5"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Heading */}
      <h2
        className="text-[26px] font-normal text-stone-900 mb-1.5"
        style={{ fontFamily: "'DM Serif Display', serif" }}
      >
        Create an account
      </h2>
      <p className="text-sm text-stone-400 mb-8">
        Start building your flashcard library today.
      </p>

      {/* Username */}
      <Controller
        control={form.control}
        name="username"
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>Username</FieldLabel>
            <Input {...field} placeholder="e.g. jane_doe" />
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
            <Input {...field} placeholder="********" />
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
            <Input {...field} placeholder="********"  />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Checkbox */}
      <div className="flex items-start gap-3 pt-1">
        <Controller
          control={form.control}
          name="hasAgreedToPrivacyPolicy"
          render={({ field, fieldState }) => (
            <Field orientation={"vertical"} className="flex fle">
              <FieldLabel>Privacy Policy</FieldLabel>
              <div className="flex gap-2">
                <Checkbox
                  className="size-4"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <p className="text-[13px] text-stone-400">
                  I agree to Pixis's{" "}
                  <Dialog>
                    <DialogTrigger asChild>
                      <button
                        type="button"
                        className="text-stone-700 underline font-medium"
                      >
                        Privacy Policy
                      </button>
                    </DialogTrigger>

                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Privacy Policy</DialogTitle>
                      </DialogHeader>
                      <p className="text-sm text-stone-500">
                        Your data is safe. (shortened)
                      </p>
                    </DialogContent>
                  </Dialog>{" "}
                  and Terms of Service.
                </p>
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      {/* Submit */}
      <Button type="submit" className="w-full my-btn" disabled={isSigningUp}>
        Create account
      </Button>
      <p className="text-center text-[13px] text-stone-400 mt-7">
        Already have an account?
        <NavLink
          to="/sign-in"
          className="text-stone-800 font-medium hover:text-stone-600 transition-colors"
        >
          Sign in
        </NavLink>
      </p>
    </form>
  );
};

export default SignUp;
