"use client";

import { cn } from "@/lib/utils";

interface SessionCodeDisplayProps {
  code: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function SessionCodeDisplay({
  code,
  size = "md",
  className,
}: SessionCodeDisplayProps) {
  const sizeClasses = {
    sm: "text-2xl gap-1",
    md: "text-4xl gap-2",
    lg: "text-6xl gap-3",
  };

  const digitSizeClasses = {
    sm: "px-2 py-1",
    md: "px-4 py-2",
    lg: "px-6 py-4",
  };

  return (
    <div className={cn("flex items-center justify-center", sizeClasses[size], className)}>
      {code.split("").map((digit, index) => (
        <span
          key={index}
          className={cn(
            "inline-flex items-center justify-center rounded-lg bg-muted font-mono font-bold text-foreground",
            digitSizeClasses[size]
          )}
        >
          {digit}
        </span>
      ))}
    </div>
  );
}
