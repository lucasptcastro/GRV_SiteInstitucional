"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, MapPin, MessageCircle, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SITE, getContactWhatsApp } from "@/lib/site";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

const CONTACT_LINKS = [
  {
    icon: Mail,
    label: "E-mail",
    value: SITE.email,
    href: `mailto:${SITE.email}`,
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: SITE.phone,
    href: getContactWhatsApp(),
    external: true,
  },
  {
    icon: MapPin,
    label: "Local",
    value: SITE.location,
    href: "#mapa",
  },
];

export function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const subject = encodeURIComponent(`[Grove Solutions] Contato de ${name}`);
    const body = encodeURIComponent(
      `Olá, Grove Solutions!\n\nSou ${name} (${email}).\n\n${message}`,
    );
    window.open(`mailto:${SITE.email}?subject=${subject}&body=${body}`, "_blank");
  }

  return (
    <section id="contato" className="scroll-mt-20 px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            label="Contato"
            title="Vamos conversar"
            description="Conte o que a sua empresa precisa. Respondemos por e-mail ou WhatsApp."
          />
        </Reveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          <Reveal delay={100}>
            <div className="flex flex-col gap-6">
              <div>
                <h3 className="mb-1 text-lg font-semibold">Fale com a Grove</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Apps, sites, sistemas e automações. Envie o contexto do
                  projeto e retornamos com o próximo passo.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {CONTACT_LINKS.map(
                  ({ icon: Icon, label, value, href, external }) => (
                    <Link
                      key={label}
                      href={href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noopener noreferrer" : undefined}
                      className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
                    >
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/15">
                        <Icon className="size-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs font-medium">
                          {label}
                        </p>
                        <p className="text-foreground text-sm font-semibold">
                          {value}
                        </p>
                      </div>
                    </Link>
                  ),
                )}
              </div>

              <Button size="lg" asChild className="w-full gap-2 sm:w-auto">
                <Link
                  href={getContactWhatsApp()}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="size-4" />
                  Falar pelo WhatsApp
                </Link>
              </Button>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <h3 className="mb-6 text-lg font-semibold">Enviar mensagem</h3>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="name">Seu nome</Label>
                  <Input
                    id="name"
                    placeholder="João Silva"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="email">Seu e-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="joao@empresa.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="message">Mensagem</Label>
                  <Textarea
                    id="message"
                    placeholder="Olá! Gostaria de conversar sobre um sistema para..."
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    required
                    className="min-h-[140px]"
                  />
                </div>
                <Button type="submit" size="lg" className="mt-1 w-full gap-2">
                  <Send className="size-4" />
                  Enviar mensagem
                </Button>
                <p className="text-muted-foreground text-center text-xs">
                  Abre o cliente de e-mail com a mensagem preenchida.
                </p>
              </form>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
