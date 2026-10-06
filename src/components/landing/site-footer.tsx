import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";

import { SITE, getContactWhatsApp } from "@/lib/site";
import { SiteLogo } from "./site-logo";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex flex-col items-center gap-2 sm:items-start">
            <SiteLogo className="h-6" />
            <p className="text-muted-foreground text-xs">
              © {year} Grove Solutions. {SITE.location}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href={getContactWhatsApp()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <MessageCircle className="size-5" />
            </Link>
            <Link
              href={`mailto:${SITE.email}`}
              aria-label="E-mail"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Mail className="size-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
