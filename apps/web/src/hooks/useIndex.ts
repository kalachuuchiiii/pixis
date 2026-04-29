export const useIndex = (
  ceilIndex: number,
  set: React.Dispatch<React.SetStateAction<number>>
) => {
  const onNext = () => {
    let hasNext: boolean = false;
    let hasPrevious: boolean = false;
    set((prev) => {
      hasNext = prev < ceilIndex;
      hasPrevious = prev > 0;
      return hasNext ? prev + 1 : prev;
    });

    return {
      hasNext,
      hasPrevious,
    };
  };

  const onPrevious = () => {
    let hasNext: boolean = false;
    let hasPrevious: boolean = false;
    set((prev) => {
      hasNext = prev < ceilIndex;
      hasPrevious = prev > 0;
      return hasPrevious ? prev - 1 : prev;
    });
    return {
      hasNext,
      hasPrevious,
    };
  };

  return {
    onNext,
    onPrevious,
  };
};
