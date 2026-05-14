export const withRetry = async <T>(
  fn: () => Promise<T>,
  {
    retry = 3,
    delay = 300,
  }: {
    retry?: number;
    delay?: number;
  } = {},
): Promise<T> => {
  let attempt = 0;

  while (attempt < retry) {
    try {
      return await fn();
    } catch (e) {
      attempt++;

      if (attempt >= retry) throw e;

      await new Promise((res) => setTimeout(res, delay * attempt));
    }
  }

  throw new Error('Unreachable');
};
