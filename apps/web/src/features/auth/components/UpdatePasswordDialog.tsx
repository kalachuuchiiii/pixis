import { useState, type ChangeEvent } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "../hooks/useAuth";
import {
  updatePasswordFormSchema,
  type UpdatePasswordForm,
} from "@pixis/schemas";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export const UpdatePasswordDialog = () => {
  const form = useForm<UpdatePasswordForm>({
    resolver: zodResolver(updatePasswordFormSchema),
    defaultValues: {
      newPassword: "",
      oldPassword: "",
    },
  });

  const { handleSubmit } = form;

  const { updatePassword, isUpdatingPassword } = useAuth();

  const onSubmit = handleSubmit(async (data) => {
    await updatePassword(data);
  });

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <p className="font-medium text-zinc-900">Change Password</p>
        <p className="text-sm text-zinc-500">Update your account password</p>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant={"secondary"} className="my-btn">
            Update Password
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-md">
          <form {...form} onSubmit={onSubmit} className="space-y-6">
            <DialogHeader className="pt-2">
              <DialogTitle>Update Password</DialogTitle>
              <DialogDescription>
                Choose a new password to keep your account secure
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-3 ">
              <Controller
                name="oldPassword"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Old Password</FieldLabel>
                    <Input {...field} placeholder="Your old password" />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="newPassword"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>New Password</FieldLabel>
                    <Input {...field} placeholder="Your new password" />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <footer className="w-full justify-end flex mt-6">
              <DialogClose>
                <Button variant={"outline"} type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={isUpdatingPassword}
                className="ml-2"
              >
                Save
              </Button>
            </footer>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
