"use client";

import { cn } from "@/lib/utils";
import type { ConnectionStatus, DesktopClientStatus } from "@/lib/types";

interface ConnectionStatusBadgeProps {
  status: ConnectionStatus;
  className?: string;
}

export function ConnectionStatusBadge({
  status,
  className,
}: ConnectionStatusBadgeProps) {
  const statusConfig = {
    connected: {
      label: "Connected",
      className: "bg-success text-success-foreground",
    },
    waiting: {
      label: "Waiting",
      className: "bg-warning text-warning-foreground",
    },
    disconnected: {
      label: "Disconnected",
      className: "bg-muted text-muted-foreground",
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
        config.className,
        className
      )}
    >
      <span
        className={cn(
          "h-2 w-2 rounded-full",
          status === "connected" && "bg-success-foreground animate-pulse",
          status === "waiting" && "bg-warning-foreground animate-pulse",
          status === "disconnected" && "bg-muted-foreground"
        )}
      />
      {config.label}
    </span>
  );
}

interface DesktopClientStatusBadgeProps {
  status: DesktopClientStatus;
  className?: string;
}

export function DesktopClientStatusBadge({
  status,
  className,
}: DesktopClientStatusBadgeProps) {
  const statusConfig = {
    connected: {
      label: "Desktop App Connected",
      className: "bg-success text-success-foreground",
    },
    not_connected: {
      label: "Desktop App Not Connected",
      className: "bg-muted text-muted-foreground",
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
        config.className,
        className
      )}
    >
      <span
        className={cn(
          "h-2 w-2 rounded-full",
          status === "connected"
            ? "bg-success-foreground animate-pulse"
            : "bg-muted-foreground"
        )}
      />
      {config.label}
    </span>
  );
}
