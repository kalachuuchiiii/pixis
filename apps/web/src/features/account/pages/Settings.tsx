import { Skeleton } from "boneyard-js/react";
import { SecurityManager } from "../components/SecurityManager";
import { Separator } from "@/components/ui/separator";
import { PreferencesManager } from "../components/PreferencesManager";
import { NameManager } from "../components/NameManager";
import { AvatarManager } from "../components/AvatarManager";
import { AppHeader } from "@/components/ui/AppHeader";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";

const SettingsPage = () => {
  const { data: user, isPending } = useAuthUser();
  const isLoading = !user || isPending;

  return (
    <div className="dark:text-neutral-100  text-zinc-900 page-container">
      <AppHeader heading="Settings" description="Manage your settings" />

      <div className="lg:flex-row pr-8 flex-col flex lg:gap-10 w-full">
        <AvatarManager />

        <Skeleton
          name="settings-name-section"
          className="w-full"
          loading={isLoading}
        >
          <NameManager />
        </Skeleton>
      </div>

      <Separator className="my-10" />

      <Skeleton name="settings-preferences-section" loading={isLoading}>
        <PreferencesManager />
      </Skeleton>

      <Separator className="my-10" />

      <Skeleton name="settings-security-section" loading={isLoading}>
        <SecurityManager />
      </Skeleton>
    </div>
  );
};

export default SettingsPage;
