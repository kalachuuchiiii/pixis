import type { LucideIcon } from "lucide-react";
import type { JSX } from "react";

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";
export type Effectiveness = "High" | "Very High" | "Moderate";
export type Category =
  | "Recall"
  | "Organization"
  | "Time"
  | "Comprehension"
  | "Mixed";

export interface Technique {
  id: string;
  name: string;
  description: string;
  benefits: string[];
  useCases: string[];
  difficulty: Difficulty;
  effectiveness: Effectiveness;
  category: Category;
  icon: LucideIcon;
  videoId: string;
  videoTitle: string;
  videoNote: string;
}
