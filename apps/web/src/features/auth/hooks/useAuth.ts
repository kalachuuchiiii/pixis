import api from "@/lib/api";
import {
  getErrorMessage,
  getSuccessMessage,
} from "@/utils/message-extractor.utils";
import {
  SignInFormSchema,
  SignUpFormSchema,
  UpdatePasswordFormSchema,
  type SignInForm,
  type SignUpForm,
  type UpdatePasswordForm,
} from "@pixis/schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useAuth = () => {
  const nav = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: signUp, isPending: isSigningUp } = useMutation({
    mutationFn: async (form: SignUpForm) => {
      const promise = new Promise((resolve, reject) => {
        try {
          const validatedForm = SignUpFormSchema.parse(form);
          return resolve(api.post("/auth/signup", validatedForm));
        } catch (e) {
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
      const promise = new Promise<{ user: { username: string; id: number } }>(
        (resolve, reject) => {
          try {
            const validatedForm = SignInFormSchema.parse(form);
            resolve(api.post("/auth/signin", validatedForm));
          } catch (e) {
            reject(e);
          }
        }
      );

      await toast.promise(promise, {
        loading: "Signing you in...",
        success: getSuccessMessage,
        error: getErrorMessage,
      });
      return await promise;
    },
    onSuccess: (result) => {
      console.log(result);
      queryClient.invalidateQueries();
      setTimeout(() => {
        nav(`/app/profile/${result.user.id}/stats`);
      }, 100);
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

      const result = await promise;
      return result;
    },
    onSuccess: async () => {
      setTimeout(() => window.location.replace("/"), 0);
    },
  });

  const { mutate: updatePassword, isPending: isUpdatingPassword } = useMutation(
    {
      mutationFn: async (form: UpdatePasswordForm) => {
        const promise = new Promise((resolve, reject) => {
          try {
            const cleanForm = UpdatePasswordFormSchema.parse(form);
            return resolve(api.patch("/auth/password", cleanForm));
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
