import Link from "next/link";

import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-32 text-center">
        <p className="text-primary mb-4 font-mono text-sm font-medium">404</p>
        <h1 className="mb-3 text-3xl font-bold tracking-tight">
          Página não encontrada
        </h1>
        <p className="text-muted-foreground mb-8 max-w-sm">
          A página que você procura não existe ou foi movida.
        </p>
        <Button asChild>
          <Link href="/">Voltar ao início</Link>
        </Button>
      </main>
      <SiteFooter />
    </div>
  );
}
