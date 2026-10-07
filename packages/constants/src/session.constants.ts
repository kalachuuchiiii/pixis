export const EXAM_MODE_ENUM = ["TIMED", "NORMAL"] as const;

export const SESSION_STATUS = ["incomplete", "completed", "idle"] as const;

export type ExamMode = (typeof EXAM_MODE_ENUM)[number];
export type SessionStatus = (typeof SESSION_STATUS)[number];
