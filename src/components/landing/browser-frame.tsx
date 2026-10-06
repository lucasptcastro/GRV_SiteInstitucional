import type { ReactNode } from "react";

interface BrowserFrameProps {
  url?: string;
  children: ReactNode;
}

export function BrowserFrame({ url, children }: BrowserFrameProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white shadow-xl">
      <div className="flex items-center gap-2 border-b bg-zinc-100 px-3 py-2">
        <div className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-red-400" />
          <span className="size-2.5 rounded-full bg-amber-400" />
          <span className="size-2.5 rounded-full bg-emerald-400" />
        </div>
        {url && (
          <p className="text-muted-foreground truncate rounded-md bg-white px-3 py-1 text-xs">
            {url}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}
