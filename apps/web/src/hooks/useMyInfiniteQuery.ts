import {
  useInfiniteQuery,
  type DefinedInitialDataInfiniteOptions,
  type InfiniteData,
  type QueryClient,
} from "@tanstack/react-query";
import { useInViewRefetch } from "@/hooks/useInViewRefetch";

export const useMyInfiniteQuery = (
  options: DefinedInitialDataInfiniteOptions<
    unknown,
    Error,
    InfiniteData<unknown, unknown>,
    readonly unknown[],
    unknown
  >,
  queryClient?: QueryClient
) => {
  const infiniteQuery = useInfiniteQuery(options, queryClient);
  const { ref } = useInViewRefetch(infiniteQuery);

  return {
    ref,
    ...infiniteQuery,
  };
};
