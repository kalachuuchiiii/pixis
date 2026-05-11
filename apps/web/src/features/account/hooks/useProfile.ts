import api from "@/lib/api";
import {
  getErrorMessage,
  getSuccessMessage,
} from "@/utils/message-extractor.utils";
import { type UpdateUserForm, type User } from "@pixis/schemas";
import { useMutation } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import { toast } from "sonner";
import { useProfileDetails } from "./useProfileDetails";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";

type UpdateUserResponse = Pick<
  User,
  "username" | "nickname" | "lastUsernameUpdate" | "lastNicknameUpdate"
>;

export const useProfile = () => {
  const { data: user, refetch } = useAuthUser();

  const { mutate: updateUser, isPending: isUpdatingUser } = useMutation({
    mutationFn: async (updateUserForm: UpdateUserForm) => {
      const promise = new Promise<AxiosResponse<UpdateUserResponse>>(
        (resolve, reject) => {
          try {
            resolve(api.patch<UpdateUserResponse>("/users", updateUserForm));
          } catch (e) {
            return reject(e);
          }
        }
      );

      await toast.promise(promise, {
        loading: "Updating user...",
        success: getSuccessMessage,
        error: getErrorMessage,
      });
      const result = await promise;
      return result.data;
    },
    onSuccess: (data) => {
      refetch();
    },
  });

  const { mutate: togglePrivacy, isPending: isTogglingPrivacy } = useMutation({
    mutationFn: async () => {
      const result = await api.patch<{ isPrivate: boolean }>("/users/privacy");
      return result.data;
    },
    onSuccess: (data) => {
      refetch();
    },
  });

  const { mutate: updateAvatar, isPending: isUpdatingAvatar } = useMutation({
    mutationFn: async ({ file }: { file?: File }) => {
      if (!file) return;
      const formData = new FormData();
      formData.append("avatar", file);
      const promise = api.post(`/users/avatar`, formData);
      await toast.promise(promise, {
        loading: "Updating avatar...",
        success: getSuccessMessage,
        error: getErrorMessage,
      });
      const result = await promise;

      return result.data;
    },
    onSuccess: () => {
      refetch();
    },
  });

  return {
    updateUser,
    togglePrivacy,
    updateAvatar,
    isUpdatingAvatar,
    isUpdatingUser,
    isTogglingPrivacy,
  };
};
