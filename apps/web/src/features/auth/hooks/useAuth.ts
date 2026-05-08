import api from "@/lib/api";
import {
  getErrorMessage,
  getSuccessMessage,
} from "@/utils/message-extractor.utils";
import {
  signInFormSchema,
  signUpFormSchema,
  updatePasswordFormSchema,
  type SignInForm,
  type SignUpForm,
  type UpdatePasswordForm,
} from "@pixis/schemas";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useAuth = () => {
  const nav = useNavigate();

  const { mutate: signUp, isPending: isSigningUp } = useMutation({
    mutationFn: async (form: SignUpForm) => {
      const promise = new Promise((resolve, reject) => {
        try {
          const validatedForm = signUpFormSchema.parse(form);
          return resolve(api.post("/auth/signup", validatedForm));
        } catch (e) {
          console.dir(e, { depth: 1 });
          return reject(e);
        }
      });

      await toast.promise(promise, {
        loading: "Creating your account.",
        success: getSuccessMessage,
        error: getErrorMessage,
      });
      return await promise;
    },
    onSuccess: () => {
      nav("/sign-in");
    },
  });

  const { mutate: signIn, isPending: isSigningIn } = useMutation({
    mutationFn: async (form: SignInForm) => {
      const promise = new Promise((resolve, reject) => {
        try {
          const validatedForm = signInFormSchema.parse(form);
          resolve(api.post("/auth/signin", validatedForm));
        } catch (e) {
          reject(e);
        }
      });

      await toast.promise(promise, {
        loading: "Signing you in...",
        success: getSuccessMessage,
        error: getErrorMessage,
      });
      return await promise;
    },
    onSuccess: () => {
      nav("/app/chat");
    },
  });

  const { mutate: signOut, isPending: isSigningOut } = useMutation({
    mutationFn: async () => {
      const promise = api.post("/auth/signout");
      await toast.promise(promise, {
        loading: "Signing you out...",
        success: getSuccessMessage,
        error: getErrorMessage,
      });
      return await promise;
    },
    onSuccess: () => {
      nav("/sign-in");
    },
  });

  const { mutate: updatePassword, isPending: isUpdatingPassword } = useMutation(
    {
      mutationFn: async (form: UpdatePasswordForm) => {
        const promise = new Promise((resolve, reject) => {
          try {
            const cleanForm = updatePasswordFormSchema.parse(form);
            return resolve(api.patch("/auth/me/password", cleanForm));
          } catch (e) {
            return reject(e);
          }
        });
        await toast.promise(promise, {
          loading: "Updating password...",
          success: getSuccessMessage,
          error: getErrorMessage,
        });
        return await promise;
      },
    }
  );

  return {
    signUp,
    signIn,
    signOut,
    updatePassword,
    isUpdatingPassword,
    isSigningOut,
    isSigningUp,
    isSigningIn,
  };
};
