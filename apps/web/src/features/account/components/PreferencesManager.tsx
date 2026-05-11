import { Switch } from "@/components/ui/switch";
import { useProfile } from "../hooks/useProfile";
import { useEffect, useState } from "react";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";

export const PreferencesManager = () => {
  const { data: user } = useAuthUser();

  const { togglePrivacy, isTogglingPrivacy } = useProfile();
  const [mode, setMode] = useState(
    localStorage.getItem("theme") === "light" ? "light" : "dark"
  );

  useEffect(() => {
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", mode === "dark" ? "dark" : "light");
  }, [mode]);

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
            checked={mode === "dark"}
            onCheckedChange={() =>
              setMode((prev) => (prev === "dark" ? "light" : "dark"))
            }
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
