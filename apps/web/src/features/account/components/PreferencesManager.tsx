import { Switch } from "@/components/ui/switch";
import { useProfile } from "../hooks/useProfile";
import { useProfileDetails } from "../hooks/useProfileDetails";

export const PreferencesManager = () => {
  const { data: user } = useProfileDetails();

  const { togglePrivacy, isTogglingPrivacy } = useProfile();

  return (
    <div>
      <h2 className="text-sm opacity-75  my-2s">Preferences</h2>
      <div className=" dark:text-neutral-100 rounded-3xl p-8 space-y-8">
        {/* Dark Mode */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium dark:text-neutral-100 ">Dark Mode</p>
            <p className="text-sm dark:text-stone-500 ">
              Switch to dark theme for night studying
            </p>
          </div>
          <Switch />
        </div>

        {/* Private Account */}
        <div className="flex items-center justify-between ">
          <div>
            <p className="font-medium dark:text-neutral-100">Private Account</p>
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
