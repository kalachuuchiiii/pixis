import { useAppSelector } from "@/hooks/useReduxHook";
import { updateUserFormSchema, type UpdateUserForm } from "@pixis/schemas";
import { useMemo, useState, type ChangeEvent } from "react";
import { useProfile } from "./useProfile";

export const useNameManager = () => {
  const { user } = useAppSelector((state) => state.profile);
  const [form, setForm] = useState<UpdateUserForm>({
    username: user.username ?? "",
    nickname: user.nickname ?? '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const { updateUser, isUpdatingUser } = useProfile();

  const formError = useMemo(
    () => updateUserFormSchema.safeParse(form).error?.issues[0].message ?? null,
    [form]
  );
  const isFormValid = useMemo(() => !formError, [formError]);

  return {
    user,
    form,
    handleChange,
    updateUser,
    isUpdatingUser,
    isFormValid,
    formError,
  };
};
