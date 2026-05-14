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
import { queryClient } from "@/lib/queryClient";

type UpdateUserResponse = Pick<
  User,
  "username" | "nickname" | "lastUsernameUpdate" | "lastNicknameUpdate"
>;

export const useProfile = () => {
  const { data: user, refetch } = useAuthUser();

  const { mutate: unfollow, isPending: isUnfollowing } = useMutation({
    mutationFn: async (followingId: number) => {
      const p = api.post(`/users/${followingId}/unfollow`);
      toast.promise(p, {
        loading: "Unfollowing...",
        success: getSuccessMessage,
        error: getErrorMessage,
      });
      return await p;
    },
    onSuccess: (_, followingId) => {
      queryClient.invalidateQueries({
        queryKey: ["profile", String(followingId)],
      });
    },
  });

  const { mutate: follow, isPending: isFollowing } = useMutation({
    mutationFn: async (followingId: number) => {
      const p = api.post(`/users/${followingId}/follow`);
      toast.promise(p, {
        loading: "Following...",
        success: getSuccessMessage,
        error: getErrorMessage,
      });
      return await p;
    },
    onSuccess: (_, followingId) => {
      queryClient.invalidateQueries({
        queryKey: ["profile", String(followingId)],
      });
    },
  });
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

      toast.promise(promise, {
        loading: "Updating user...",
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

  const { mutate: togglePrivacy, isPending: isTogglingPrivacy } = useMutation({
    mutationFn: async () => {
      const result = await api.patch<{ isPrivate: boolean }>("/users/privacy");
      return result.data;
    },
    onSuccess: () => {
      refetch();
    },
  });

  const { mutate: updateAvatar, isPending: isUpdatingAvatar } = useMutation({
    mutationFn: async ({ file }: { file?: File }) => {
      if (!file) return;
      const formData = new FormData();
      formData.append("avatar", file);
      const promise = api.post(`/users/avatar`, formData);
      toast.promise(promise, {
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
    follow,
    isFollowing,
    updateAvatar,
    isUpdatingAvatar,
    unfollow,
    isUnfollowing,
    isUpdatingUser,
    isTogglingPrivacy,
  };
};
