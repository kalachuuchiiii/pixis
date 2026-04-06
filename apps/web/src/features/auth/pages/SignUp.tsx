
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import clsx from "clsx";
import { NavLink } from "react-router-dom";
import {
  PASSWORD_MAX,
  PASSWORD_MIN,
  USERNAME_MAX,
  USERNAME_MIN,
} from "@pixis/constants";
import { useSignUpForm } from "../hooks/useSignUpForm";

const SignUp = () => {
  const {
    form,
    handleTogglePrivacyPolicy,
    handleChange,
    handleSubmit,
    formError,
    isValid,
    isFormEmpty,
    isSigningUp
  } = useSignUpForm();

  return (
    <form
      onSubmit={handleSubmit}
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
      <div>
        <label className="block text-[11px] font-medium tracking-[0.06em] uppercase text-stone-400 mb-1.5">
          Username
        </label>
        <input
          maxLength={USERNAME_MAX}
          minLength={USERNAME_MIN}
          value={form.username}
          onChange={handleChange}
          name="username"
          type="text"
          placeholder="e.g. jane_doe"
          className="w-full px-3.5 py-[11px] rounded-[10px] border border-stone-200 bg-stone-50 text-[14px]"
        />
      </div>

      {/* Password (shadcn style = just controlled, no manual toggle needed) */}
      <div>
        <label className="block text-[11px] font-medium tracking-[0.06em] uppercase text-stone-400 mb-1.5">
          Password
        </label>
        <input
          minLength={PASSWORD_MIN}
          maxLength={PASSWORD_MAX}
          value={form.password}
          onChange={handleChange}
          name="password"
          type="password"
          placeholder="••••••••"
          className="w-full px-3.5 py-[11px] rounded-[10px] border border-stone-200 bg-stone-50 text-[14px]"
        />
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-[11px] font-medium tracking-[0.06em] uppercase text-stone-400 mb-1.5">
          Confirm Password
        </label>
        <input
          value={form.confirmPassword}
          onChange={handleChange}
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          className="w-full px-3.5 py-[11px] rounded-[10px] border border-stone-200 bg-stone-50 text-[14px]"
        />
      </div>

      {/* Checkbox */}
      <div className="flex items-start gap-3 pt-1">
        <button
          type="button"
          onClick={handleTogglePrivacyPolicy}
          className={`mt-0.5 w-4 h-4 rounded-[4px] border flex items-center justify-center ${
            form.hasAgreedToPrivacyPolicy
              ? "bg-stone-900 border-stone-900"
              : "border-stone-300"
          }`}
        >
          {form.hasAgreedToPrivacyPolicy && (
            <span className="text-white text-[10px]">✓</span>
          )}
        </button>

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

      {formError && !isFormEmpty && (
        <p className="text-xs text-red-400">{formError.issues[0].message}</p>
      )}
      {/* Submit */}
      <button
        type="submit"
        disabled={!form.hasAgreedToPrivacyPolicy || isSigningUp}
        className={clsx(
          `w-full mt-6 py-3 rounded-[10px]`,
          isValid
            ? "bg-stone-900 text-white"
            : "bg-stone-100 text-stone-300 cursor-not-allowed"
        )}
      >
        Create account
      </button>
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
