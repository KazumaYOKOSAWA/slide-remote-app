"use client";

import { cn } from "@/lib/utils";

interface QRCodePlaceholderProps {
  sessionCode: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function QRCodePlaceholder({
  sessionCode,
  size = "md",
  className,
}: QRCodePlaceholderProps) {
  const sizeClasses = {
    sm: "h-32 w-32",
    md: "h-48 w-48",
    lg: "h-64 w-64",
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted",
        sizeClasses[size],
        className
      )}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <svg
          className="h-12 w-12 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
          />
        </svg>
        <span className="text-xs text-muted-foreground">
          QR Code
          <br />
          Code: {sessionCode}
        </span>
      </div>
    </div>
  );
}
