import type { Deck } from "@pixis/schemas";

export const initialDeckData: Deck = {
  title: "",
  color: "#000000",
  topic: "",
  visibility: "private",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  flashcardCount: 0,
  id: 0,
  userId: 0,
  participantsCount: 0,
  averageAccuracy: 0,
  userSavedDeckCount: 0,
  user: {
    username: "",
    nickname: "",
    id: 0,
    avatarUrl: null,
  },
  deletedAt: null,
  savedByMe: null,
};
