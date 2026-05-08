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

export const getPaginationData = <T extends { id: number }>(
  paginated: Paginated<T>,
) => {
  const { data, links, meta } = paginated;
  return {
    data,
    nextPage: !!links.next ? (meta.currentPage ?? 0) + 1 : null,
    previousPage: !!links.previous ? (meta.currentPage ?? 0) - 1 : null,
    beforeCursor: data[0]?.id || null,
    afterCursor: data[data.length - 1]?.id || null,
    totalItems: meta.totalItems,
    totalPages: meta.totalPages,
  };
};
