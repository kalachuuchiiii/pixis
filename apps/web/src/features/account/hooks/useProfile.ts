import { useAppDispatch } from "@/hooks/useReduxHook";
import api from "@/lib/api";
import {
  getErrorMessage,
  getSuccessMessage,
} from "@/utils/message-extractor.utils";
import { type UpdateUserForm, type User } from "@pixis/schemas";
import { useMutation } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import { toast } from "sonner";
import { updateUserState } from "../slice/profileSlice";
import { useProfileDetails } from "./useProfileDetails";

type UpdateUserResponse = Pick<
  User,
  "username" | "nickname" | "lastUsernameUpdate" | "lastNicknameUpdate"
>;

export const useProfile = () => {
  const { data: user, refetch } = useProfileDetails();

  const { mutate: updateUser, isPending: isUpdatingUser } = useMutation({
    mutationFn: async (updateUserForm: UpdateUserForm) => {
      const promise = new Promise<AxiosResponse<UpdateUserResponse>>(
        (resolve, reject) => {
          try {
            resolve(api.patch<UpdateUserResponse>("/users/me", updateUserForm));
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
      const result = await api.patch<{ isPrivate: boolean }>(
        "/users/me/privacy"
      );
      return result.data;
    },
    onSuccess: (data) => {
      refetch();
    },
  });

  return {
    updateUser,
    togglePrivacy,
    isUpdatingUser,
    isTogglingPrivacy,
  };
};
