import { PixisAvatar } from "@/components/ui/PixisAvatar";
import { NameManager } from "../components/NameManager";
import { PreferencesManager } from "../components/PreferencesManager";
import { SecurityManager } from "@/features/account/components/SecurityManager";
import { AppHeader } from "@/components/ui/AppHeader";
import { Separator } from "@/components/ui/separator";

const SettingsPage = () => {
  return (
    <div className=" dark:text-neutral-100 text-zinc-900 page-container   ">
      <AppHeader heading="Settings" description="Manage your settings" />

      {/* Profile Information */}
      <NameManager />
      <Separator className="my-10" />
      {/* Appearance Section */}
      <PreferencesManager />
      <Separator className="my-10" />
      <SecurityManager />
    </div>
  );
};

export default SettingsPage;
