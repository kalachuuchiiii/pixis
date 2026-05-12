import type { UserWithStats } from "@pixis/schemas";

export const initialUserStatData: UserWithStats = {
  id: 0,
  username: "",
  nickname: "",
  avatarUrl: "",
  isPrivate: false,
  lastNicknameUpdate: new Date().toISOString(),
  lastUsernameUpdate: new Date().toISOString(),
  averageAccuracy: 0,
  deckStudiedCount: 0,
  flashcardAnsweredCount: 0,
  rank: 0,
  point: {
    id: 0,
    currentPoints: 0,
    highestPoints: 0,
  },
  streak: {
    id: 0,
    currentStreak: 0,
    highestStreak: 0,
    lastActionTimestamp: new Date().toISOString(),
  },
  createdAt: new Date().toISOString(),
};
