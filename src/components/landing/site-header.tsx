"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";
import { SiteLogo } from "./site-logo";

const NAV_LINKS = [
  { href: "#servicos", label: "Serviços" },
  { href: "#tecnologias", label: "Tecnologias" },
  { href: "#sistemas", label: "Sistemas" },
  { href: "#sites", label: "Sites" },
  { href: "#clientes", label: "Clientes" },
  { href: "#mapa", label: "Mapa" },
  { href: "#contato", label: "Contato" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 right-0 left-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/90 border-b border-border/50 shadow-sm backdrop-blur-md"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" aria-label={`${SITE.name}, início`}>
          <SiteLogo variant={scrolled ? "dark" : "light"} className="h-7" />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                scrolled
                  ? "text-muted-foreground hover:text-foreground hover:bg-muted"
                  : "text-white/70 hover:text-white hover:bg-white/10",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button
            size="sm"
            asChild
            className={
              scrolled ? undefined : "bg-white text-[#083528] hover:bg-white/90"
            }
          >
            <Link href="#contato">Entrar em contato</Link>
          </Button>
        </div>

        <button
          className={cn(
            "rounded-md p-2 transition-colors lg:hidden",
            scrolled
              ? "text-foreground hover:bg-muted"
              : "text-white hover:bg-white/10",
          )}
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="bg-background/95 border-b border-border backdrop-blur-md lg:hidden">
          <nav className="flex flex-col px-4 pt-2 pb-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-foreground rounded-md px-3 py-2.5 text-sm font-medium transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Button size="sm" asChild className="mt-2">
              <Link href="#contato" onClick={() => setMobileOpen(false)}>
                Entrar em contato
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
