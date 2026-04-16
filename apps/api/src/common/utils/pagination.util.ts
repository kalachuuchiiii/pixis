import type { PaginateQuery } from 'nestjs-paginate';

export const getNextPage = (links: {
    first?: string | undefined;
    previous?: string | undefined;
    current: string;
    next?: string | undefined;
    last?: string | undefined;
}, page: number | undefined = 6) => {
    return links.next ? ((page ?? 6) + 1) : null;
} 