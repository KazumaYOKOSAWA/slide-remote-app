"use client";

import { cn } from "@/lib/utils";

interface TimerDisplayProps {
  time: string;
  isRunning?: boolean;
  className?: string;
}

export function TimerDisplay({
  time,
  isRunning = true,
  className,
}: TimerDisplayProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-lg px-3 py-1 font-mono text-lg",
        isRunning ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
        className
      )}
    >
      <svg
        className={cn("h-4 w-4", isRunning && "animate-pulse")}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span className="font-semibold">{time}</span>
    </div>
  );
}
