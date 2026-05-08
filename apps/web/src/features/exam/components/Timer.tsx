import { Button } from "@/components/ui/button";
import type { UseTimerReturn } from "../hooks/useTimer";
import { formatMs } from "@/utils/formatMs";

export const Timer = ({
  time,
  start,
  addSeconds,
  isRunning,
  deductSeconds,
}: UseTimerReturn) => {
  return (
    <div className="flex flex-col items-center justify-center max-w-md ">
      {/* Timer Card */}
      <div className="bg-zinc-950 rounded-3xl shadow-2xl w-full">
        {/* Display */}
        <div className="relative flex items-center justify-center">
          <div className="text-[5.5rem] md:text-[6.5rem] font-mono font-bold tracking-tighter text-white tabular-nums">
            {formatMs(time)}
          </div>

          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full -z-10" />
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <div className="flex gap-3 flex-1">
            <div className="space-x-1">
              <Button
                disabled={isRunning}
                onClick={() => addSeconds(10)}
                className="my-btn"
                variant={"outline"}
              >
                +10s
              </Button>
              <Button
                disabled={isRunning}
                onClick={() => deductSeconds(10)}
                className="my-btn"
                variant={"outline"}
              >
                -10s
              </Button>
            </div>

            <div className="space-x-1">
              <Button
                disabled={isRunning}
                onClick={() => addSeconds(60)}
                className="my-btn"
                variant={"outline"}
              >
                +1m
              </Button>
              <Button
                disabled={isRunning}
                onClick={() => deductSeconds(60)}
                className="my-btn"
                variant={"outline"}
              >
                -1m
              </Button>
            </div>
            <Button onClick={start} className="my-btn" disabled={isRunning}>
              <span>Start</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Optional hint */}
      <p className="text-zinc-500 text-sm mt-6 text-center">
        Click Start to begin • Add time anytime
      </p>
    </div>
  );
};
