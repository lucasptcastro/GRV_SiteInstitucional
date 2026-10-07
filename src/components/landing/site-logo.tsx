import { cn } from "@/lib/utils";

interface SiteLogoProps {
  className?: string;
  variant?: "light" | "dark";
}

export function SiteLogo({ className, variant = "dark" }: SiteLogoProps) {
  const light = variant === "light";
  const src = light ? "/brand/hero-logotype.svg" : "/brand/logotype.png";

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="groves."
      width={light ? 161 : 213}
      height={light ? 39 : 51}
      className={cn("h-7 w-auto", className)}
    />
  );
}
