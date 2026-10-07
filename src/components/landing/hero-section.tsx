"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  Globe,
  MessageCircle,
  Smartphone,
  Sparkles,
  Workflow,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { HERO_LINES } from "@/lib/content";
import { getContactWhatsApp } from "@/lib/site";
import { cn } from "@/lib/utils";

import { GlyphField } from "./glyph-field";

const HERO_SERVICES = [
  {
    icon: Smartphone,
    title: "Apps móveis",
    description:
      "Publicamos e desenvolvemos aplicativos móveis para a sua empresa.",
  },
  {
    icon: Globe,
    title: "Websites",
    description:
      "Construímos landing pages e sites institucionais para o seu negócio.",
  },
  {
    icon: Sparkles,
    title: "Sistemas",
    description:
      "Desenvolvemos sistemas sob medida para atender às suas necessidades.",
  },
  {
    icon: Workflow,
    title: "Automações",
    description:
      "Automatizamos tarefas manuais para a empresa ganhar performance.",
  },
];

export function HeroSection() {
  const [lineIndex, setLineIndex] = useState(0);
  const [phase, setPhase] = useState<"in" | "out">("in");

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase("out");
      setTimeout(() => {
        setLineIndex((current) => (current + 1) % HERO_LINES.length);
        setPhase("in");
      }, 350);
    }, 3200);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="relative flex min-h-screen flex-col items-center justify-center overflow-x-hidden px-4 pt-24 pb-16"
      style={{ background: "var(--hero-bg)" }}
      aria-label="Apresentação"
    >
      <GlyphField />

      <div className="relative z-10 flex w-full flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs leading-5 font-medium text-white ring-1 ring-inset ring-white/25">
          <span className="size-1.5 rounded-full bg-white" />
          Empresa de Tecnologia
        </div>

        <h1 className="mt-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/hero-logotype.svg"
            alt="groves."
            width={161}
            height={39}
            className="mx-auto h-12 w-auto sm:h-14 md:h-16"
          />
        </h1>

        <p
          className={cn(
            "mt-4 max-w-[820px] text-[clamp(28px,8.2vw,40px)] leading-[1.1] font-medium tracking-[-0.01em] text-white transition-all duration-300",
            phase === "in"
              ? "translate-y-0 opacity-100"
              : "-translate-y-2 opacity-0",
          )}
        >
          {HERO_LINES[lineIndex]}
        </p>

        <p className="mx-auto mt-4 max-w-[520px] text-base leading-6 text-white/90">
          Soluções tecnológicas sob medida para atender às necessidades da sua
          empresa de forma eficaz.
        </p>

        <div className="mx-auto mt-6 flex w-full max-w-[320px] flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:items-center sm:justify-center">
          <Button
            asChild
            className="h-10 rounded-[10px] bg-white px-4 text-sm font-medium text-black shadow-[0_2px_10px_rgba(8,53,40,0.28)] hover:bg-[#f4f4f4]"
          >
            <Link href="#projetos">
              <ArrowDown className="size-4" />
              Ver projetos
            </Link>
          </Button>
          <Button
            variant="ghost"
            asChild
            className="h-10 rounded-[10px] bg-transparent px-4 text-sm font-medium text-white ring-1 ring-inset ring-white/30 hover:bg-white/10 hover:text-white hover:ring-white/50"
          >
            <Link
              href={getContactWhatsApp()}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="size-4" />
              Falar no WhatsApp
            </Link>
          </Button>
        </div>

        <ul className="mt-8 grid w-full max-w-[640px] grid-cols-2 gap-3 text-left">
          {HERO_SERVICES.map((service) => (
            <li key={service.title}>
              <a
                href="#servicos"
                className="group flex h-full flex-col rounded-xl bg-[color-mix(in_srgb,white_10%,#18cb96)] p-5 text-white ring-1 ring-inset ring-white/20 transition-colors hover:bg-[color-mix(in_srgb,white_16%,#18cb96)] hover:ring-white/30"
              >
                <span className="flex items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white">
                    <service.icon className="size-5 text-[#18CB96]" />
                  </span>
                  <span className="text-sm font-medium">{service.title}</span>
                </span>
                <span className="mt-3 line-clamp-2 text-sm leading-5 text-white/80">
                  {service.description}
                </span>
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#servicos"
          className="mt-4 inline-flex items-center gap-1 text-sm text-white/80 hover:text-white"
        >
          Ver detalhes dos serviços
          <ArrowRight className="size-4" />
        </a>
      </div>
    </section>
  );
}
