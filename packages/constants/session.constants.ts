

export const EXAM_MODE_ENUM = ['TIMED', 'NORMAL'] as const;


export type ExamMode = typeof EXAM_MODE_ENUM[number];