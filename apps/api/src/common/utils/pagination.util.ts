


export const getNextPage = <T >(items: T[], limit: number, page: number) => {
    const hasNextPage = items.length === limit + 1;
    const nextPage = hasNextPage ? page + 1 : null;
    const data = hasNextPage ? items.slice(0, limit) : items;
    return {
        nextPage,
        data
    }
} 