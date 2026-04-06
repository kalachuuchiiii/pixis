import { useState, type ChangeEvent } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "../hooks/useAuth";
import { updatePasswordFormSchema } from "@pixis/schemas";

export const UpdatePasswordDialog = () => {
  const [form, setForm] = useState({ oldPassword: "", newPassword: "" });
  const formError = updatePasswordFormSchema.safeParse(form).error?.issues[0].message;
  const { updatePassword, isUpdatingPassword } = useAuth();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <p className="font-medium text-stone-900">Change Password</p>
        <p className="text-sm text-stone-500">Update your account password</p>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant={"secondary"} className="my-btn">
            Update Password
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-md ">
          <DialogHeader className="p-2" >
            <DialogTitle>Update Password</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-3 ">
            <input
              type="password"
              name="oldPassword"
              value={form.oldPassword}
              onChange={handleChange}
              placeholder="Current password"
              className="w-full px-3 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-stone-200"
            />
            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              placeholder="New password"
              className="w-full px-3 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-stone-200"
            />
            { formError && <p className="text-red-400 text-xs">{formError}</p> }
          </div>

          <footer className="w-full justify-end flex mt-6" >
            <Button variant={"outline"}>Cancel</Button>
            <Button
              onClick={() => updatePassword(form)}
              disabled={!!formError || isUpdatingPassword}
              className="ml-2"
            >
              Save
            </Button>
          </footer>
        </DialogContent>
      </Dialog>
    </div>
  );
};
