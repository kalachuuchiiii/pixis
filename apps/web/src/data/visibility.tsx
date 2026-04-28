import type { Visibility } from "@pixis/constants";
import { Globe, Lock, Link } from "lucide-react";


export type VisibilityOption = {
  value: Visibility;
  label: string;
  desc: string;
  icon: React.ReactNode;
};

export const VISIBILITY_OPTIONS: VisibilityOption[] = [
  {
    value: "public",
    label: "Public",
    desc: "Anyone can find and open this resource",
    icon: <Globe size={14} strokeWidth={1.8} />,
  },
  {
    value: "unlisted",
    label: "Unlisted",
    desc: "Only people with the link can access",
    icon: <Link size={14} strokeWidth={1.8} />,
  },
  {
    value: "private",
    label: "Private",
    desc: "Only you can see this resource",
    icon: <Lock size={14} strokeWidth={1.8} />,
  },
];