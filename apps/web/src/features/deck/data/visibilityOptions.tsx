import type { Visibility } from "@pixis/constants";
import { Globe, Lock, Link } from "lucide-react";



export const VISIBILITY_OPTIONS: {
  value: Visibility;
  label: string;
  desc: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "public",
    label: "Public",
    desc: "Anyone can find and study this deck",
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
    desc: "Only you can see this deck",
    icon: <Lock size={14} strokeWidth={1.8} />,
  },
];