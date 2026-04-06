import { SignOutDialog } from "@/features/auth/components/SignOutDialog";
import z from "zod";
import store from "@/app/store";
import { DeleteAccountDialog } from "./DeleteAccountDialog";
import { UpdatePasswordDialog } from "@/features/auth/components/UpdatePasswordDialog";


export const SecurityManager = () => {

  return (
    <div>
      <h2 className="text-xs font-semibold tracking-[0.125em] uppercase text-red-500 mb-6">
        SECURITY
      </h2>
      <div className="bg-white border border-red-100 rounded-3xl p-8 space-y-8">
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
