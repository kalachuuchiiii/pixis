import {
  BookOpen,
  Brain,
  Clock,
  Eye,
  FileText,
  FlaskConical,
  Layers,
  Map,
  PieChart,
  Puzzle,
  Repeat,
  Target,
  Users,
  Zap,
} from "lucide-react";
import type { Technique } from "../types/types";

export const studyTechniqueOptions = [
  { id: "active-recall", name: "Active Recall" },
  { id: "spaced-repetition", name: "Spaced Repetition" },
  { id: "feynman", name: "Feynman Technique" },
  { id: "pomodoro", name: "Pomodoro Technique" },
  { id: "blurting", name: "Blurting" },
  { id: "interleaving", name: "Interleaving" },
  { id: "mind-mapping", name: "Mind Mapping" },
  { id: "leitner", name: "Leitner System" },
  { id: "sq3r", name: "SQ3R" },
  { id: "retrieval-practice", name: "Retrieval Practice" },
  { id: "dual-coding", name: "Dual Coding" },
  { id: "chunking", name: "Chunking" },
  { id: "elaboration", name: "Elaboration" },
  { id: "cornell", name: "Cornell Note-Taking" },
  { id: "pareto", name: "Pareto Principle" },
  { id: "exam-simulation", name: "Exam Simulation" },
];

export const studyTechniques: Technique[] = [
  {
    id: "active-recall",
    name: "Active Recall",
    description:
      "Force yourself to retrieve information from memory rather than passively reviewing it. Close the book and write down everything you remember.",
    benefits: [
      "Strengthens memory pathways",
      "Reveals knowledge gaps",
      "Beats re-reading by 3×",
    ],
    useCases: ["Exam prep", "Vocabulary building", "Concept mastery"],
    difficulty: "Beginner",
    effectiveness: "Very High",
    category: "Recall",
    icon: Brain,
    videoId: "ukLnPbIffxE",
    videoTitle: "Active Recall: The Best Way to Study",
    videoNote:
      "A concise breakdown of why active recall outperforms passive study methods, backed by cognitive science.",
  },
  {
    id: "spaced-repetition",
    name: "Spaced Repetition",
    description:
      "Review material at increasing intervals over time. Each successful recall pushes the next review further into the future, optimizing memory retention.",
    benefits: [
      "Long-term retention",
      "Efficient review schedules",
      "Combats forgetting curve",
    ],
    useCases: ["Language learning", "Medical studies", "Historical facts"],
    difficulty: "Intermediate",
    effectiveness: "Very High",
    category: "Recall",
    icon: Repeat,
    videoId: "Z-zNHHpXoMM",
    videoTitle: "Spaced Repetition Explained",
    videoNote:
      "Explains the forgetting curve and how spaced repetition is the most evidence-backed learning method.",
  },
  {
    id: "feynman",
    name: "Feynman Technique",
    description:
      "Explain a concept in simple language as if teaching a child. Where you stumble, you find your gaps. Then go back, refine, and repeat.",
    benefits: [
      "Deep conceptual clarity",
      "Exposes hidden gaps",
      "Boosts confidence",
    ],
    useCases: ["STEM subjects", "Philosophy", "Any complex topic"],
    difficulty: "Intermediate",
    effectiveness: "Very High",
    category: "Comprehension",
    icon: Zap,
    videoId: "tkm0TNFzIeg",
    videoTitle: "The Feynman Technique",
    videoNote:
      "Named after Nobel laureate Richard Feynman — this video demonstrates the four-step process clearly.",
  },
  {
    id: "pomodoro",
    name: "Pomodoro Technique",
    description:
      "Work in focused 25-minute blocks followed by 5-minute breaks. After four cycles, take a longer 15–30 minute rest.",
    benefits: ["Reduces burnout", "Sustains focus", "Makes time visible"],
    useCases: ["Long study sessions", "Writing tasks", "Deep work"],
    difficulty: "Beginner",
    effectiveness: "High",
    category: "Time",
    icon: Clock,
    videoId: "mNBmG24djoY",
    videoTitle: "Pomodoro Technique Explained",
    videoNote:
      "A practical overview of using time-boxing to prevent mental fatigue during intense study sessions.",
  },
  {
    id: "blurting",
    name: "Blurting",
    description:
      "Read a topic, close everything, and write every single thing you can remember — no filter, no structure. Then compare gaps to source material.",
    benefits: ["Fast knowledge audit", "No setup needed", "Highly active"],
    useCases: ["Quick reviews", "Essay prep", "Last-minute studying"],
    difficulty: "Beginner",
    effectiveness: "High",
    category: "Recall",
    icon: FileText,
    videoId: "CgrCo1J9A44",
    videoTitle: "Blurting Method for Studying",
    videoNote:
      "A simple yet powerful method especially popular among students cramming for exams.",
  },
  {
    id: "interleaving",
    name: "Interleaving",
    description:
      "Mix different subjects or problem types within a single session instead of blocking one topic at a time. Forces your brain to differentiate and adapt.",
    benefits: [
      "Better discrimination",
      "Improves long-term transfer",
      "Prevents over-specialization",
    ],
    useCases: [
      "Math problem sets",
      "Multiple subjects",
      "Skill-based learning",
    ],
    difficulty: "Advanced",
    effectiveness: "Very High",
    category: "Mixed",
    icon: Layers,
    videoId: "AWTYfzxBwPg",
    videoTitle: "Interleaving: The Counter-Intuitive Study Strategy",
    videoNote:
      "Explains why mixing subjects feels harder but leads to dramatically better test performance.",
  },
  {
    id: "mind-mapping",
    name: "Mind Mapping",
    description:
      "Create visual diagrams that branch out from a central concept. Helps structure information spatially and reveal relationships between ideas.",
    benefits: [
      "Visual clarity",
      "Reveals connections",
      "Great for brainstorming",
    ],
    useCases: ["Note-taking", "Essay planning", "Concept review"],
    difficulty: "Beginner",
    effectiveness: "Moderate",
    category: "Organization",
    icon: Map,
    videoId: "5nTuScU70As",
    videoTitle: "How to Mind Map",
    videoNote:
      "A beginner-friendly introduction to creating effective mind maps for visual learners.",
  },
  {
    id: "leitner",
    name: "Leitner System",
    description:
      "A physical flashcard system with five boxes. Cards move forward when recalled correctly and backward when wrong, creating a built-in spaced repetition schedule.",
    benefits: [
      "Tactile reinforcement",
      "Self-adjusting difficulty",
      "No app needed",
    ],
    useCases: ["Vocabulary", "Definitions", "Flashcard-based study"],
    difficulty: "Beginner",
    effectiveness: "High",
    category: "Recall",
    icon: BookOpen,
    videoId: "8Zr-Fn3EXWU",
    videoTitle: "The Leitner Box System",
    videoNote:
      "Demonstrates the physical box system that gave birth to modern spaced repetition software.",
  },
  {
    id: "sq3r",
    name: "SQ3R",
    description:
      "Survey, Question, Read, Recite, Review. A structured reading method that turns passive text into an active dialogue with the material.",
    benefits: [
      "Improves comprehension",
      "Builds questions before reading",
      "Systematic coverage",
    ],
    useCases: [
      "Textbook reading",
      "Dense academic papers",
      "Non-fiction books",
    ],
    difficulty: "Intermediate",
    effectiveness: "High",
    category: "Comprehension",
    icon: Eye,
    videoId: "0dhcSP_Myjg",
    videoTitle: "SQ3R Reading Method",
    videoNote:
      "Walks through each step of SQ3R with practical examples for textbook-heavy courses.",
  },
  {
    id: "retrieval-practice",
    name: "Retrieval Practice",
    description:
      "The act of recalling information from memory strengthens it more than re-reading. Use quizzes, blank-page recalls, or practice tests.",
    benefits: [
      "Proven by decades of research",
      "Works across all subjects",
      "Self-testing feedback",
    ],
    useCases: ["Test prep", "Medical licensing", "Certifications"],
    difficulty: "Beginner",
    effectiveness: "Very High",
    category: "Recall",
    icon: Target,
    videoId: "mzCEJVtED0U",
    videoTitle: "Retrieval Practice: The Science of Learning",
    videoNote:
      "Covers the testing effect and why self-quizzing is one of the most validated study strategies.",
  },
  {
    id: "dual-coding",
    name: "Dual Coding",
    description:
      "Combine verbal and visual information — notes alongside diagrams, text with illustrations. Encoding information in two formats doubles retention pathways.",
    benefits: [
      "Leverages both memory systems",
      "Makes abstract ideas concrete",
      "Highly memorable",
    ],
    useCases: ["Science diagrams", "History timelines", "Process flows"],
    difficulty: "Intermediate",
    effectiveness: "High",
    category: "Comprehension",
    icon: Eye,
    videoId: "ZFmKYd_vPQc",
    videoTitle: "Dual Coding Theory Explained",
    videoNote:
      "A visual explanation of Allan Paivio's dual coding theory and how to apply it practically.",
  },
  {
    id: "chunking",
    name: "Chunking",
    description:
      "Group individual pieces of information into meaningful units. Phone numbers, acronyms, and mnemonics all rely on chunking to reduce cognitive load.",
    benefits: [
      "Reduces cognitive load",
      "Faster processing",
      "Easier to memorize",
    ],
    useCases: ["Numbers and codes", "Memorization tasks", "Language patterns"],
    difficulty: "Beginner",
    effectiveness: "High",
    category: "Organization",
    icon: Puzzle,
    videoId: "hydCdGLAh00",
    videoTitle: "Chunking for Better Memory",
    videoNote:
      "Explains Miller's Law and how chunking can dramatically increase your working memory capacity.",
  },
  {
    id: "elaboration",
    name: "Elaboration",
    description:
      "Ask 'why' and 'how' about everything you study. Add detail, make connections to existing knowledge, and generate personal examples.",
    benefits: [
      "Creates rich memory networks",
      "Deepens understanding",
      "Personalizes learning",
    ],
    useCases: ["Conceptual subjects", "Essay writing", "Problem-solving"],
    difficulty: "Intermediate",
    effectiveness: "High",
    category: "Comprehension",
    icon: Brain,
    videoId: "eF7VociLFxQ",
    videoTitle: "Elaborative Interrogation",
    videoNote:
      "Covers how asking 'why does this work?' transforms shallow memorization into deep understanding.",
  },
  {
    id: "cornell",
    name: "Cornell Note-Taking",
    description:
      "Divide your page into cues, notes, and summary sections. Review by covering the notes and recalling from cue words alone.",
    benefits: [
      "Structured review built in",
      "Promotes summarization",
      "Reduces re-reading",
    ],
    useCases: ["Lectures", "Textbook reading", "Meeting notes"],
    difficulty: "Beginner",
    effectiveness: "High",
    category: "Organization",
    icon: FileText,
    videoId: "WtW9IyE04OQ",
    videoTitle: "Cornell Note-Taking System",
    videoNote:
      "A clear walkthrough of the Cornell method and why its built-in review structure is so effective.",
  },
  {
    id: "pareto",
    name: "Pareto Principle",
    description:
      "Apply the 80/20 rule to studying: identify the 20% of material that will appear in 80% of exam questions. Focus ruthlessly on high-yield content.",
    benefits: [
      "Maximizes ROI of study time",
      "Reduces overwhelm",
      "Great under time pressure",
    ],
    useCases: ["Exam prep", "Large syllabi", "Time-constrained learning"],
    difficulty: "Advanced",
    effectiveness: "Very High",
    category: "Time",
    icon: PieChart,
    videoId: "EAynHZE-lK4",
    videoTitle: "The 80/20 Rule for Studying",
    videoNote:
      "How to apply Pareto thinking to identify highest-yield content before an exam.",
  },
  {
    id: "exam-simulation",
    name: "Exam Simulation",
    description:
      "Replicate real exam conditions — timed, no notes, strict environment. Doing this repeatedly reduces test anxiety and surface real performance gaps.",
    benefits: [
      "Reduces anxiety",
      "Reveals true performance",
      "Acclimates to pressure",
    ],
    useCases: ["High-stakes exams", "Standardized tests", "Certifications"],
    difficulty: "Advanced",
    effectiveness: "Very High",
    category: "Mixed",
    icon: FlaskConical,
    videoId: "CPxSzxylRCI",
    videoTitle: "Practice Tests & Exam Simulation",
    videoNote:
      "Why simulated exams are the gold standard for exam preparation and how to set them up properly.",
  },
];
