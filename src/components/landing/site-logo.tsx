import { cn } from "@/lib/utils";

interface SiteLogoProps {
  className?: string;
  variant?: "light" | "dark";
}

export function SiteLogo({ className, variant = "dark" }: SiteLogoProps) {
  const src =
    variant === "light" ? "/brand/hero-logotype.png" : "/brand/logotype.png";

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="groves."
      width={213}
      height={51}
      className={cn("h-7 w-auto", className)}
    />
  );
}
