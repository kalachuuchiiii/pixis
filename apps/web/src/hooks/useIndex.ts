export type UseIndexProps = {
  ceilIndex: number;
  currentIdx: number;
  set: React.Dispatch<React.SetStateAction<number>>;
  disabled: boolean;
};

export const useIndex = ({
  ceilIndex,
  currentIdx,
  set,
  disabled = false,
}: UseIndexProps) => {
  const onNext = () => {
    if (disabled) return;
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
    if (disabled) return;
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
