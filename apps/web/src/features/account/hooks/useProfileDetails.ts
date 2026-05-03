import api from "@/lib/api";
import type { User } from "@pixis/schemas";
import { useQuery } from "@tanstack/react-query";

export const initialData: User = {
  id: 0,
  username: "",
  nickname: "",
  avatarPublicUrl: "",
  isPrivate: false,
  lastNicknameUpdate: new Date().toISOString(),
  lastUsernameUpdate: new Date().toISOString(),
  point: {
    id: 0,
    currentPoints: 0,
    highestPoints: 0,
    totalPoints: 0,
  },
  streak: {
    id: 0,
    currentStreak: 0,
    highestStreak: 0,
    totalStreak: 0,
    lastActionTimestamp: new Date().toISOString(),
  },
  createdAt: new Date().toISOString(),
};

export const useProfileDetails = () => {
  const { data, error, ...result } = useQuery({
    queryKey: ["profile-details"],
    queryFn: async () => {
      const res = await api.get<{ user: User }>("/users/me/profile");
      return res.data.user;
    },
    staleTime: Infinity,
  });

  return {
    data: data ?? initialData,
    ...result,
  };
};
