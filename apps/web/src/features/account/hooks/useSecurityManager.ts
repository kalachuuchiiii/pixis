import api from "@/lib/api";
import {
  getErrorMessage,
  getSuccessMessage,
} from "@/utils/message-extractor.utils";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const useSecurityManager = () => {
  const nav = useNavigate();

  const { mutate: deleteAccount, isPending: isDeletingAccount } = useMutation({
    mutationFn: async () => {
      const promise = api.delete("/users/me");
      await toast.promise(promise, {
        loading: "Deleting your account...",
        success: getSuccessMessage,
        error: getErrorMessage,
      });
      return await promise;
    },
    onSuccess: () => {
      nav("/sign-up");
    },
  });

  return {
    deleteAccount,
    isDeletingAccount,
  };
};
