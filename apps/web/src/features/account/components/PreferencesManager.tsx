import { Switch } from "@/components/ui/switch";
import { useProfile } from "../hooks/useProfile";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { useDarkMode } from "../hooks/useDarkMode";

export const PreferencesManager = () => {
  const { data: user } = useAuthUser();
  const theme = useDarkMode((state) => state.theme);
  const toggleTheme = useDarkMode((state) => state.toggleTheme);
  const { togglePrivacy, isTogglingPrivacy } = useProfile();


  return (
    <div>
      <h2 className="text-sm opacity-75 w-fit  my-2">Preferences</h2>
      <div className=" dark:text-neutral-100 rounded-3xl p-8 space-y-8">
        {/* Dark Mode */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="font-medium w-fit  text-zinc-900 dark:text-neutral-100 ">
              Dark Mode
            </p>
            <p className="text-sm dark:text-stone-500 w-fit ">
              Switch to dark theme for night studying
            </p>
          </div>
          <Switch
            checked={theme === "dark"}
            onCheckedChange={toggleTheme}
          />
        </div>

        {/* Private Account */}
        <div className="flex items-center justify-between ">
          <div className="space-y-1">
            <p className="font-medium w-fit  text-zinc-900 dark:text-neutral-100">
              Private Account
            </p>

            <p className="text-sm dark:text-stone-500 ">
              If enabled, no one can be able to see your deck history
            </p>
          </div>
          <Switch
            checked={user.isPrivate}
            onCheckedChange={() => togglePrivacy()}
            disabled={isTogglingPrivacy}
          />
        </div>
      </div>
    </div>
  );
};
