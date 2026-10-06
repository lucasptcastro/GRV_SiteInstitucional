import { SITE } from "@/lib/site";

export function getStructuredData(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    email: SITE.email,
    telephone: SITE.phone,
    areaServed: {
      "@type": "State",
      name: "Rio Grande do Norte",
    },
    address: {
      "@type": "PostalAddress",
      addressRegion: "RN",
      addressCountry: "BR",
    },
  };
}
