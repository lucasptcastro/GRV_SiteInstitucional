"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BrowserFrame } from "./browser-frame";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";
import { PROJECTS } from "@/lib/content";
import { cn } from "@/lib/utils";

const SHOWCASE = PROJECTS.filter((p) => p.featured);
const MORE = PROJECTS.filter((p) => !p.featured);
const CYCLE_MS = 6500;

export function ProjectsSection() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const project = SHOWCASE[active];

  useEffect(() => {
    if (paused || SHOWCASE.length < 2) return;

    const id = window.setInterval(() => {
      setActive((current) => (current + 1) % SHOWCASE.length);
    }, CYCLE_MS);

    return () => window.clearInterval(id);
  }, [paused, active]);

  return (
    <section
      id="sistemas"
      className="border-b border-border scroll-mt-20 px-4 py-24 sm:px-6"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            label="Sistemas"
            title="O que já desenvolvemos"
            description="Sistemas em produção, apps publicados e sites conduzidos do requisito ao deploy. As abas avançam sozinhas — clique para fixar um projeto."
          />
        </Reveal>

        <Reveal delay={80}>
          <div
            className="mt-14 flex flex-col gap-10"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div
              role="tablist"
              aria-label="Sistemas em destaque"
              className="flex flex-wrap justify-center gap-2"
            >
              {SHOWCASE.map((item, index) => (
                <ProjectTab
                  key={item.id}
                  label={item.tabLabel}
                  caption={
                    item.type === "mobile"
                      ? "Aplicativo"
                      : item.type === "landing"
                        ? "Landing page"
                        : "Sistema web"
                  }
                  selected={index === active}
                  showProgress={index === active && !paused}
                  progressKey={`${item.id}-${active}`}
                  onSelect={() => setActive(index)}
                />
              ))}
            </div>

            <div
              role="tabpanel"
              className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)] lg:items-center"
            >
              <div className="flex flex-col gap-5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">
                    {project.type === "mobile"
                      ? "Mobile"
                      : project.type === "landing"
                        ? "Landing"
                        : "Web"}
                  </Badge>
                  <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    {project.status}
                  </span>
                </div>

                <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  {project.title}
                </h3>

                <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
                  {project.description}
                </p>

                <ul className="flex flex-col gap-2.5">
                  {project.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm">
                      <Check className="text-primary mt-0.5 size-4 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-1.5">
                  {project.tech.map((tech) => (
                    <Badge key={tech} variant="tech" className="text-[11px]">
                      {tech}
                    </Badge>
                  ))}
                </div>

                {project.link && (
                  <div>
                    <Button asChild>
                      <Link
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Ver projeto
                        <ExternalLink className="size-4" />
                      </Link>
                    </Button>
                  </div>
                )}
              </div>

              <BrowserFrame>
                <div className="relative aspect-[16/10] bg-muted">
                  <Image
                    src={project.thumbnail}
                    alt={`Miniatura de ${project.title}`}
                    fill
                    unoptimized
                    className="object-cover object-top"
                    sizes="(max-width: 1024px) 100vw, 520px"
                    priority={active === 0}
                  />
                </div>
              </BrowserFrame>
            </div>
          </div>
        </Reveal>

        {MORE.length > 0 && (
          <div className="mt-28">
            <p className="text-muted-foreground mb-5 text-xs font-semibold uppercase tracking-widest">
              Mais sistemas
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {MORE.map((item, index) => (
                <Reveal key={item.id} delay={index * 50}>
                  <article className="card-interactive overflow-hidden rounded-xl border border-border bg-card shadow-sm h-full">
                    <div className="relative aspect-[16/10] bg-muted">
                      <Image
                        src={item.thumbnail}
                        alt={`Miniatura de ${item.title}`}
                        fill
                        unoptimized
                        className="object-cover object-top"
                        sizes="(max-width: 640px) 100vw, 25vw"
                      />
                    </div>
                    <div className="flex flex-col gap-2 p-4">
                      <h3 className="text-sm font-semibold leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
                        {item.description}
                      </p>
                      {item.link && (
                        <Link
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary mt-1 inline-flex items-center gap-1 text-[11px] font-medium hover:underline"
                        >
                          Ver projeto
                          <ExternalLink className="size-2.5" />
                        </Link>
                      )}
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function ProjectTab({
  label,
  caption,
  selected,
  showProgress,
  progressKey,
  onSelect,
}: {
  label: string;
  caption: string;
  selected: boolean;
  showProgress: boolean;
  progressKey: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      onClick={onSelect}
      className={cn(
        "relative shrink-0 overflow-hidden rounded-xl border px-4 py-3 text-center transition-colors",
        selected
          ? "border-primary/30 bg-primary/5 text-foreground"
          : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      <span className="block text-sm font-semibold">{label}</span>
      <span className="text-muted-foreground mt-0.5 block text-xs">
        {caption}
      </span>
      {showProgress && (
        <span
          key={progressKey}
          className="animate-tab-progress bg-primary absolute inset-x-0 bottom-0 h-0.5"
        />
      )}
    </button>
  );
}
