import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { updateUserFormSchema, type UpdateUserForm } from "@pixis/schemas";

import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useProfileDetails } from "../hooks/useProfileDetails";
import { useProfile } from "../hooks/useProfile";
import { SidebarGroupLabel } from "@/components/ui/sidebar";
import { UserBadge } from "./ui/UserBadge";

export const NameManager = () => {
  const { data: user } = useProfileDetails();

  const form = useForm<UpdateUserForm>({
    resolver: zodResolver(updateUserFormSchema),
    defaultValues: {
      username: user.username || "",
      nickname: user.nickname || "",
    },
  });
  const { handleSubmit } = form;
  const { updateUser, isUpdatingUser } = useProfile();

  const onSubmit = handleSubmit(async (data) => {
    await updateUser(data);
  });

  return (
    <div>
      <p className="opacity-75 my-8 text-sm">Profile Information</p>
      <div className="  border-zinc-100 rounded-3xl">
        <div className="flex flex-col sm:flex-row gap-8">
          {/* Avatar */}

          <div className="flex flex-col items-center gap-6">
            <UserBadge user={user}>
              <UserBadge.Avatar className="size-50 outline-4 outline-blue-400 outline-offset-4" />
            </UserBadge>

            <Button variant={"outline"} className="my-btn">
              Upload Avatar
            </Button>
          </div>
          {/* Form Fields */}
          <form onSubmit={onSubmit} className="flex-1 space-y-6">
            <div className="flex w-full gap-2 flex-col items-end">
              <Controller
                control={form.control}
                name="nickname"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldTitle>Nickname</FieldTitle>
                    <Input
                      {...field}
                      className="p-5"
                      placeholder="Your nickname"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="username"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldTitle>Username</FieldTitle>
                    <Input
                      {...field}
                      className="p-5"
                      placeholder="Your username"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Button
                disabled={isUpdatingUser}
                type="submit"
                className="my-btn"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
