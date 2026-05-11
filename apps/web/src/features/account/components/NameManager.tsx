import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { UpdateUserFormSchema, type UpdateUserForm } from "@pixis/schemas";

import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useProfile } from "../hooks/useProfile";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";

export const NameManager = () => {
  const { data: user } = useAuthUser();

  const form = useForm<UpdateUserForm>({
    resolver: zodResolver(UpdateUserFormSchema),
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
    <div className="w-full">
      <p className="opacity-75 w-fit my-8 text-sm">Profile Information</p>
      <div className="  border-zinc-100 rounded-3xl">
        <div className="flex flex-col sm:flex-row gap-8">
          {/* Form Fields */}
          <form onSubmit={onSubmit} className="flex-1 space-y-6">
            <div className="flex w-full gap-6 flex-col items-end">
              <Controller
                control={form.control}
                name="nickname"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldTitle>
                      <p className="w-fit">Nickname</p>
                    </FieldTitle>
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
                    <FieldTitle>
                      <p className="w-fit">Username</p>
                    </FieldTitle>
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
