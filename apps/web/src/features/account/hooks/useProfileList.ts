import { useInViewRefetch } from "@/hooks/useInViewRefetch";
import api from "@/lib/api";
import type { UserBadgeWithFollowStats, UserWithStats } from "@pixis/schemas";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type KeyboardEventHandler,
} from "react";

export const useProfileList = () => {
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");
  const handleChangeSearchInput = (e: ChangeEvent<HTMLInputElement>) =>
    setSearchInput(e.target.value);

  const onEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      setQuery(searchInput);
    }
  };

  const onSubmit = () => {
    setQuery(searchInput);
  };

  const profileQuery = useInfiniteQuery({
    queryKey: ["profiles", query],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await api.get<{
        profiles: UserBadgeWithFollowStats;
        nextPage: number | null;
      }>(`/users/list?page=${pageParam}&limit=6&search=${searchInput}`);
      return res.data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.nextPage;
    },
    initialPageParam: 1,
  });
  const { data: profilesData, hasNextPage } = profileQuery;
  const profiles = profilesData?.pages?.flatMap((p) => p.profiles) ?? [];
  const hasNoMoreData = !hasNextPage && profiles.length > 0;
  const hasNoData = !hasNextPage && profiles.length === 0;
  const { ref } = useInViewRefetch(profileQuery);

  return {
    ...profileQuery,
    ref,
    searchInput,
    onEnter,
    handleChangeSearchInput,
    hasNoMoreData,
    onSubmit,
    profiles,
    hasNoData,
  };
};
