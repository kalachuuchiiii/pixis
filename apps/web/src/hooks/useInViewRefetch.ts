import type {
  InfiniteData,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

export const useInViewRefetch = (
  infiniteQuery: UseInfiniteQueryResult<InfiniteData<any, unknown>, Error>,
  options: { direction: "next" | "previous" } = { direction: "next" }
) => {
  const { ref, inView } = useInView();
  const {
    hasNextPage,
    hasPreviousPage,
    isPending,
    isFetching,
    fetchNextPage,
    fetchPreviousPage,
    data,
  } = infiniteQuery;

  useEffect(() => {
    if (isPending || isFetching || !inView) return;
    if (hasNextPage && options.direction === "next") {
      fetchNextPage();
      return;
    }

    if (hasPreviousPage && options.direction === "previous") {
      fetchPreviousPage();
      return;
    }
  }, [inView]);

  return {
    ref,
    ...infiniteQuery,
  };
};
