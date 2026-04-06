import { Input } from "@/components/ui/input";
import { NavLink } from "react-router-dom";
import { useSignInForm } from "../hooks/useSignInForm";

const SignIn = () => {
  const { handleSubmit, handleChange, formError, isValid, form, isSigningIn } =
    useSignInForm();

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

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Username */}
        <div>
          <label
            htmlFor="username"
            className="block text-[11px] font-medium tracking-[0.06em] uppercase text-stone-400 mb-1.5"
          >
            Username
          </label>
          <Input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            placeholder="e.g. jane_doe"
            value={form.username}
            onChange={handleChange}
            className="h-[42px] rounded-[10px] border-stone-200 bg-stone-50 text-[14px] text-stone-800 placeholder:text-stone-300 focus-visible:ring-0 focus-visible:border-stone-400 focus-visible:bg-white transition-colors"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          />
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-[11px] font-medium tracking-[0.06em] uppercase text-stone-400 mb-1.5"
          >
            Password
          </label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              className="h-[42px] rounded-[10px] border-stone-200 bg-stone-50 text-[14px] text-stone-800 placeholder:text-stone-300 focus-visible:ring-0 focus-visible:border-stone-400 focus-visible:bg-white transition-colors pr-10"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            />
          </div>
        </div>

        {/* Forgot password */}
        <div className="flex justify-end pt-0.5">
          <a
            href="/forgot-password"
            className="text-[12px] text-stone-400 hover:text-stone-700 transition-colors"
          >
            Forgot password?
          </a>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!isValid || isSigningIn}
          className={`w-full py-3 rounded-[10px] text-[13.5px] font-medium tracking-[0.02em] transition-all mt-1 ${
            isValid
              ? "bg-stone-900 text-white hover:opacity-80"
              : "bg-stone-100 text-stone-300 cursor-not-allowed"
          }`}
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Sign in
        </button>
      </form>

      {/* Footer */}
      <p className="text-center text-[13px] text-stone-400 mt-7">
        No account?{" "}
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
