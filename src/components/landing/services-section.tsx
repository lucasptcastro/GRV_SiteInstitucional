import {
  BadgeCheck,
  Gauge,
  Globe,
  Smartphone,
  Sparkles,
  Workflow,
} from "lucide-react";

import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

const SERVICES = [
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

const PILLARS = [
  {
    icon: BadgeCheck,
    title: "Google Developer",
    description: "Empresa de tecnologia verificada pelo Google.",
  },
  {
    icon: Sparkles,
    title: "Experiência do usuário",
    description: "Sistemas com foco na experiência de quem usa.",
  },
  {
    icon: Gauge,
    title: "Escalabilidade",
    description: "Soluções preparadas para crescer com a operação.",
  },
];

export function ServicesSection() {
  return (
    <section
      id="servicos"
      className="scroll-mt-20 border-b border-border px-4 py-24 sm:px-6"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            label="Serviços"
            title="Soluções tecnológicas com qualidade"
            description="Do aplicativo ao sistema interno, entregamos o que a operação precisa para funcionar no dia a dia."
          />
        </Reveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2">
          {SERVICES.map((service, index) => (
            <Reveal key={service.title} delay={index * 60}>
              <article className="card-interactive flex h-full gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <service.icon className="size-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{service.title}</h3>
                  <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {PILLARS.map((pillar) => (
            <div
              key={pillar.title}
              className="rounded-2xl border border-border bg-muted/40 px-5 py-4"
            >
              <div className="mb-2 flex items-center gap-2">
                <pillar.icon className="size-4 text-primary" />
                <h3 className="text-sm font-semibold">{pillar.title}</h3>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
