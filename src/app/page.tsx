import { ClientsSection } from "@/components/landing/clients-section";
import { ContactSection } from "@/components/landing/contact-section";
import { HeroSection } from "@/components/landing/hero-section";
import { ProjectsSection } from "@/components/landing/projects-section";
import { RnMapSection } from "@/components/landing/rn-map-section";
import { ServicesSection } from "@/components/landing/services-section";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { TechMarquee } from "@/components/landing/tech-marquee";
import { WebsitesSection } from "@/components/landing/websites-section";
import { JsonLd } from "@/components/seo/json-ld";
import { getStructuredData } from "@/lib/structured-data";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      <JsonLd data={getStructuredData()} />
      <SiteHeader />
      <main id="conteudo" className="flex-1">
        <HeroSection />
        <ServicesSection />
        <TechMarquee />
        <ProjectsSection />
        <WebsitesSection />
        <ClientsSection />
        <RnMapSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </div>
  );
}
