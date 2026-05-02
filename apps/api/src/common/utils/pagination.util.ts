import { Paginated, type PaginateQuery } from 'nestjs-paginate';

export const getNextPage = (
  links: {
    first?: string | undefined;
    previous?: string | undefined;
    current: string;
    next?: string | undefined;
    last?: string | undefined;
  },
  page: number | undefined = 6,
) => {
  return links.next ? (page ?? 6) + 1 : null;
};

export const getPaginationData = <T>(paginated: Paginated<T>) => {
  const { data, links, meta } = paginated;

  return {
    data,
    nextPage: !!links.next ? (meta.currentPage ?? 0) + 1 : null,
    totalItems: meta.totalItems,
    totalPages: meta.totalPages,
  };
};
