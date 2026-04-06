import { useState, useMemo, type ChangeEvent } from "react";
import { useAuth } from "./useAuth";
import { signUpFormSchema } from "@pixis/schemas";

export type SignUpForm = {
  username: string;
  password: string;
  confirmPassword: string;
  hasAgreedToPrivacyPolicy: boolean;
};

export const useSignUpForm = () => {
  const [form, setForm] = useState<SignUpForm>({
    username: "",
    password: "",
    confirmPassword: "",
    hasAgreedToPrivacyPolicy: false,
  });

  const { signUp, isSigningUp } = useAuth();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signUp(form);
  };

  const handleTogglePrivacyPolicy = () => {
    setForm((prev) => ({
      ...prev, 
      hasAgreedToPrivacyPolicy: !prev.hasAgreedToPrivacyPolicy
    }))
  }

  const formError = useMemo(
    () => signUpFormSchema.safeParse(form).error,
    [form]
  );

  const isValid = useMemo(() => !formError, [formError]);
  const isFormEmpty = !form.username || !form.password || !form.confirmPassword;

  return {
    form,
    setForm,
    handleChange,
    handleSubmit,
    formError,
    handleTogglePrivacyPolicy,
    isValid,
    isFormEmpty,
    isSigningUp
  };
};
