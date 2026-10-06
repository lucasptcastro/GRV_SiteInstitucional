function env(value: string | undefined, fallback: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
}

function resolveSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel =
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ||
    process.env.VERCEL_URL?.trim();
  if (vercel) {
    const host = vercel.replace(/\/$/, "");
    return host.startsWith("http") ? host : `https://${host}`;
  }

  return "https://groves.com.br";
}

export const SITE = {
  name: "Grove Solutions",
  title: "Grove Solutions | Empresa de Tecnologia",
  description:
    "Empresa de tecnologia no Rio Grande do Norte. Desenvolvimento de aplicativos, websites, sistemas sob medida e automações.",
  url: resolveSiteUrl(),
  email: env(process.env.NEXT_PUBLIC_CONTACT_EMAIL, "contato@groves.com.br"),
  whatsapp: env(process.env.NEXT_PUBLIC_WHATSAPP, "5584991649669"),
  phone: "(84) 99164-9669",
  location: "Rio Grande do Norte — Brasil",
  locale: "pt_BR",
  language: "pt-BR",
  updatedAt: "2026-10-06",
  keywords: [
    "Grove Solutions",
    "empresa de tecnologia",
    "desenvolvimento de software",
    "aplicativos",
    "sistemas sob medida",
    "websites",
    "automações",
    "Rio Grande do Norte",
  ],
} as const;

export function getWhatsAppUrl(text?: string) {
  const number = SITE.whatsapp.replace(/\D/g, "");
  const base = `https://wa.me/${number}`;
  if (!text) return base;
  return `${base}?text=${encodeURIComponent(text)}`;
}

export function getContactWhatsApp() {
  return getWhatsAppUrl(
    "Olá! Vi o site da Grove Solutions e gostaria de conversar sobre um projeto.",
  );
}
