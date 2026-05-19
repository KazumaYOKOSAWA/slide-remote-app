"use client";

import { cn } from "@/lib/utils";
import type { LogEntry, RemoteCommand, COMMAND_LABELS } from "@/lib/types";

interface OperationLogProps {
  logs: LogEntry[];
  commandLabels?: Record<RemoteCommand, string>;
  className?: string;
}

const defaultLabels: Record<RemoteCommand, string> = {
  NEXT_SLIDE: "Next Slide",
  PREV_SLIDE: "Previous Slide",
  BLACKOUT: "Black Screen",
  START_PRESENTATION: "Start Presentation",
  END_PRESENTATION: "End Presentation",
};

export function OperationLog({
  logs,
  commandLabels = defaultLabels,
  className,
}: OperationLogProps) {
  if (logs.length === 0) {
    return (
      <div className={cn("text-sm text-muted-foreground", className)}>
        No operations yet
      </div>
    );
  }

  return (
    <div className={cn("space-y-1", className)}>
      {logs.map((log, index) => (
        <div
          key={index}
          className="flex items-center gap-3 text-sm"
        >
          <span className="font-mono text-muted-foreground">{log.timestamp}</span>
          <span className="text-foreground">{commandLabels[log.command]}</span>
        </div>
      ))}
    </div>
  );
}
