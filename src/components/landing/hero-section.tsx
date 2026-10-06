"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowDown, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { HERO_LINES } from "@/lib/content";
import { getContactWhatsApp } from "@/lib/site";
import { cn } from "@/lib/utils";

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
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pt-16"
      style={{ background: "var(--hero-bg)" }}
      aria-label="Apresentação"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, oklch(0.748 0.153 166 / 0.22) 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/70 backdrop-blur-sm">
          <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
          Rio Grande do Norte
        </div>

        <p
          className="mb-2 text-base font-medium"
          style={{ color: "var(--hero-muted)" }}
        >
          Empresa de tecnologia
        </p>

        <h1 className="mb-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/logotype-light.png"
            alt="groves."
            width={213}
            height={51}
            className="h-14 w-auto sm:h-16 md:h-20"
          />
        </h1>

        <div className="mb-6 flex h-12 items-center justify-center">
          <p
            className={cn(
              "text-xl font-semibold transition-all duration-300 sm:text-2xl md:text-3xl",
              phase === "in"
                ? "translate-y-0 opacity-100"
                : "-translate-y-2 opacity-0",
            )}
            style={{ color: "#18CB96" }}
          >
            {HERO_LINES[lineIndex]}
          </p>
        </div>

        <p
          className="mb-10 max-w-xl text-base leading-relaxed sm:text-lg"
          style={{ color: "var(--hero-muted)" }}
        >
          Soluções tecnológicas sob medida para atender às necessidades da sua
          empresa de forma eficaz.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            size="lg"
            asChild
            className="bg-[#18CB96] text-[#083528] shadow-lg shadow-[#18CB96]/25 hover:bg-[#14b886]"
          >
            <Link href="#projetos">
              <ArrowDown className="size-4" />
              Ver projetos
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            asChild
            className="border-white/20 bg-white/5 text-white backdrop-blur-sm hover:border-white/30 hover:bg-white/10 hover:text-white"
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
      </div>

      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 opacity-40">
        <span className="text-xs font-medium tracking-widest text-white uppercase">
          scroll
        </span>
        <div className="h-8 w-px bg-white/40" />
      </div>
    </section>
  );
}
