import { useEffect, useRef, useState } from "react";

export const useTimer = (
  callback?: () => void,
  options: { min: number; max: number } = { min: 10000, max: 60 * 60 * 1000 }
) => {
  const [time, setTime] = useState(60 * 1000); //1 minute in ms;
  const [fixedTime, setFixedTime] = useState<null | number>(null);
  const [isRunning, setIsRunning] = useState(false);
  const callbackRef = useRef(callback);
  const beepSfx = new Audio("/beep-sfx.mp3");

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const deductSeconds = (seconds: number = 0) => {
    if (!seconds || isRunning) return;
    setTime((prev) => {
      const nextValue = prev - seconds * 1000;
      if (nextValue <= options.min) {
        return options.min;
      }
      return nextValue;
    });
  };

  const addSeconds = (seconds: number = 0) => {
    if (!seconds || isRunning) return;
    setTime((prev) => {
      const nextValue = prev + seconds * 1000;
      if (nextValue >= options.max) {
        return options.max;
      }
      return nextValue;
    });
  };

  const start = () => {
    if (isRunning) return;
    setIsRunning(true);
    setFixedTime(time);
  };

  useEffect(() => {
    if (!isRunning || !fixedTime) return;

    const intervalId = setInterval(() => {
      setTime((prev) => {
        // stop when done
        if (prev <= 1000) {
          clearInterval(intervalId);
          return 0;
        }

        const next = prev - 1000;

        if (next <= 5000) {
          beepSfx.currentTime = 0;
          beepSfx.play();
        }

        return next;
      });
    }, 1000);

    const timeoutId = setTimeout(
      () => callbackRef.current && callbackRef?.current(),
      fixedTime
    );

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [isRunning, fixedTime]);

  return {
    time,
    addSeconds,
    deductSeconds,
    isRunning,
    start,
  };
};

export type UseTimerReturn = ReturnType<typeof useTimer>;
