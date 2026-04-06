
import { PixisAvatar } from "@/components/ui/PixisAvatar";
import { NameManager } from "../components/NameManager";
import { PreferencesManager } from "../components/PreferencesManager";
import { SecurityManager } from "@/features/account/components/SecurityManager";

const SettingsPage = () => {

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-100 h-[60px] px-8 flex items-center justify-between">
        <PixisAvatar />

        <div className="text-sm text-stone-500 font-medium">Settings</div>
        <a
          href="/"
          className="text-[13.5px] text-stone-500 hover:text-stone-900 transition-colors"
        >
          ← Home
        </a>
      </nav>

      <div className="mx-auto max-w-7xl pt-12 pb-24 lg:px-8">
        {/* Page Title */}
        <h1
          className="text-[clamp(32px,5vw,48px)] font-normal text-stone-900 mb-12"
          style={{ fontFamily: "'DM Serif Display', serif" }}
        >
          Settings
        </h1>

        {/* Profile Information */}
        <NameManager />

        {/* Appearance Section */}
        <PreferencesManager />
        <SecurityManager />
      </div>
    </div>
  );
};

export default SettingsPage;
