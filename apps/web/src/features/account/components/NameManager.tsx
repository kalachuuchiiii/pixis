import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { updateUserFormSchema, type UpdateUserForm } from "@pixis/schemas";

import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useProfileDetails } from "../hooks/useProfileDetails";
import { useProfile } from "../hooks/useProfile";

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
    <div className="mb-16">
      <h2 className="text-xs font-semibold tracking-[0.125em] uppercase text-zinc-400 mb-6">
        PROFILE INFORMATION
      </h2>
      <div className="bg-white  border-zinc-100 rounded-3xl p-8">
        <div className="flex flex-col sm:flex-row gap-8">
          {/* Avatar */}

          <div className="flex flex-col items-center gap-6">
            <div className="flex-shrink-0 flex flex-col items-center sm:items-start">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-zinc-800 to-black flex items-center justify-center text-6xl text-white cursor-pointer hover:brightness-110 transition-all">
                👤
              </div>
              <p className="text-center text-[11px] text-zinc-400 mt-3 tracking-wide">
                CHANGE AVATAR
              </p>
            </div>
            <Button variant={"outline"} className="px-6 py-5">
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
                    <Input {...field} placeholder="Your nickname" />
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
                    <Input {...field} placeholder="Your username" />
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
