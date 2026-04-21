import type {
  InfiniteData,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

export const useInViewRefetch = (
  infiniteQuery: UseInfiniteQueryResult<InfiniteData<any, unknown>, Error>
) => {
  const { ref, inView } = useInView();
  const { hasNextPage, isPending, isFetching, fetchNextPage } = infiniteQuery;

  useEffect(() => {
    if (!hasNextPage || isPending || isFetching || !ref || !inView) return;
    fetchNextPage();
  }, [inView]);

  return {
    ref,
  };
};
