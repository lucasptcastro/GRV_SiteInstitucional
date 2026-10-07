import { OrbitGlobe } from "./orbit-globe";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";
import { CLIENTS } from "@/lib/content";

const GLOBE_CLIENTS = CLIENTS.map((client) => ({
  id: client.id,
  name: client.name,
  icon: client.logo,
}));

export function ClientsSection() {
  return (
    <section
      id="clientes"
      className="border-b border-border scroll-mt-20 overflow-hidden bg-background px-4 py-24 sm:px-6"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            label="Clientes"
            title="Empresas que impulsionamos"
            description="Clientes e parceiros em academias, clubes, imobiliárias, educação e operações."
          />
        </Reveal>

        <OrbitGlobe className="mt-10" items={GLOBE_CLIENTS} />
      </div>
    </section>
  );
}
