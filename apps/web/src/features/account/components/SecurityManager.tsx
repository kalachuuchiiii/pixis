import { SignOutDialog } from "@/features/auth/components/SignOutDialog";
import { DeleteAccountDialog } from "./DeleteAccountDialog";
import { UpdatePasswordDialog } from "@/features/auth/components/UpdatePasswordDialog";

export const SecurityManager = () => {
  return (
    <div>
      <h2 className="text-sm opacity-75 my-2">Security</h2>
      <div className=" p-8 space-y-8">
        {/* Change Password */}
        <UpdatePasswordDialog />

        {/* Sign Out */}
        <SignOutDialog />

        {/* Delete Account */}
        <DeleteAccountDialog />
      </div>
    </div>
  );
};
