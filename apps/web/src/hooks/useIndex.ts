export type UseIndexProps = {
  ceilIndex: number;
  currentIdx: number;
  set: React.Dispatch<React.SetStateAction<number>>;
};

export const useIndex = ({ ceilIndex, currentIdx, set }: UseIndexProps) => {
  const onNext = () => {
    const nextValue = currentIdx < ceilIndex ? currentIdx + 1 : currentIdx;
    set(nextValue);
    const hasNext = nextValue < ceilIndex;
    const hasPrevious = nextValue > 0;
    return {
      hasNext,
      hasPrevious,
    };
  };

  const onPrevious = () => {
    const nextValue = currentIdx > 0 ? currentIdx - 1 : currentIdx;

    set(nextValue);
    const hasNext = nextValue < ceilIndex;
    const hasPrevious = nextValue > 0;
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
