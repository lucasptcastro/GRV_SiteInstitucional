import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { WEBSITES } from "@/lib/content";
import { BrowserFrame } from "./browser-frame";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

export function WebsitesSection() {
  return (
    <section
      id="sites"
      className="border-b border-border scroll-mt-20 bg-muted/30 px-4 py-24 sm:px-6"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            label="Sites"
            title="Sites e lojas que colocamos no ar"
            description="Sites institucionais, e-commerces e portfólios entregues e em produção. Veja a miniatura e abra o site."
          />
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {WEBSITES.map((site, index) => (
            <Reveal key={site.id} delay={index * 60}>
              <article className="card-interactive group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                <BrowserFrame className="rounded-none border-0 border-b border-border shadow-none">
                  <div className="relative aspect-[16/10] bg-muted">
                    <Image
                      src={site.thumbnail}
                      alt={`Miniatura do site ${site.name}`}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                </BrowserFrame>

                <div className="flex flex-1 flex-col gap-3 p-5">
                  <h3 className="text-base font-semibold leading-tight transition-colors group-hover:text-primary">
                    {site.name}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {site.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {site.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Link
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary mt-auto inline-flex items-center gap-1 pt-2 text-xs font-medium hover:underline"
                  >
                    Abrir site
                    <ExternalLink className="size-3" />
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
