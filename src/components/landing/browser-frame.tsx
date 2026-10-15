import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface BrowserFrameProps {
  className?: string;
  children: ReactNode;
}

export function BrowserFrame({ className, children }: BrowserFrameProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-white shadow-xl",
        className,
      )}
    >
      {children}
    </div>
  );
}
