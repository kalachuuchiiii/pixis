import { Switch } from "@/components/ui/switch";
import { useProfile } from "../hooks/useProfile";
import { useAppSelector } from "@/hooks/useReduxHook";

export const PreferencesManager = () => {

    const { user } = useAppSelector(state => state.profile);
    const { togglePrivacy, isTogglingPrivacy } = useProfile();
    
  return (
    <div className="mb-16">
      <h2 className="text-xs font-semibold tracking-[0.125em] uppercase text-stone-400 mb-6">
        PREFERENCES
      </h2>
      <div className="bg-white border border-stone-100 rounded-3xl p-8 space-y-8">
        {/* Dark Mode */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-stone-900">Dark Mode</p>
            <p className="text-sm text-stone-500">
              Switch to dark theme for night studying
            </p>
          </div>
          <Switch />
        </div>

        {/* Private Account */}
        <div className="flex items-center justify-between pt-6 border-t border-stone-100">
          <div>
            <p className="font-medium text-stone-900">Private Account</p>
            <p className="text-sm text-stone-500">
              Make your profile and decks visible only to approved users
            </p>
          </div>
          <Switch checked = {user.isPrivate} onCheckedChange={() => togglePrivacy()} disabled = {isTogglingPrivacy} />
        </div>
      </div>
    </div>
  );
};
