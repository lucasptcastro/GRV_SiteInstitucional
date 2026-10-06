export const HERO_LINES = [
  "Aplicativos móveis",
  "Websites e landing pages",
  "Sistemas sob medida",
  "Automações de processo",
] as const;

export const TECH_ICONS = [
  { id: "react", name: "React", icon: "/tech/react.svg" },
  { id: "nextjs", name: "Next.js", icon: "/tech/nextdotjs.svg" },
  { id: "typescript", name: "TypeScript", icon: "/tech/typescript.svg" },
  { id: "nodejs", name: "Node.js", icon: "/tech/nodedotjs.svg" },
  { id: "expo", name: "Expo", icon: "/tech/expo.svg" },
  { id: "tailwind", name: "Tailwind CSS", icon: "/tech/tailwindcss.svg" },
  { id: "postgres", name: "PostgreSQL", icon: "/tech/postgresql.svg" },
  { id: "docker", name: "Docker", icon: "/tech/docker.svg" },
  { id: "github", name: "GitHub", icon: "/tech/github.svg" },
  { id: "vercel", name: "Vercel", icon: "/tech/vercel.svg" },
  { id: "prisma", name: "Prisma", icon: "/tech/prisma.svg" },
  { id: "jest", name: "Jest", icon: "/tech/jest.svg" },
  { id: "git", name: "Git", icon: "/tech/git.svg" },
  { id: "drizzle", name: "Drizzle ORM", icon: "/tech/drizzle.svg" },
  { id: "mui", name: "MUI", icon: "/tech/mui.svg" },
  { id: "reactquery", name: "React Query", icon: "/tech/reactquery.svg" },
  { id: "radix", name: "shadcn/ui", icon: "/tech/radixui.svg" },
] as const;

export type ProjectType = "web" | "mobile" | "landing";

export interface Project {
  id: string;
  title: string;
  tabLabel: string;
  type: ProjectType;
  featured: boolean;
  description: string;
  highlights: string[];
  tech: string[];
  link?: string;
  previewUrl?: string;
  thumbnail: string;
  status: string;
  year: string;
}

export const PROJECTS: Project[] = [
  {
    id: "rox-bjj",
    title: "ROX BJJ — Sistema Integrado",
    tabLabel: "ROX BJJ",
    type: "web",
    featured: true,
    description:
      "Sistema financeiro completo para rede de academias de jiu-jitsu. Controle de matrículas, mensalidades, contas a pagar e receber com pagamentos via Mercado Pago e perfis por unidade.",
    highlights: [
      "Perfis de admin, matriz, filial e aluno com permissões por unidade",
      "Mensalidades e pagamentos online via Mercado Pago",
      "Contas a pagar e receber da rede, sem planilha",
    ],
    tech: [
      "Next.js",
      "TypeScript",
      "PostgreSQL",
      "Drizzle ORM",
      "Better Auth",
      "Mercado Pago",
      "Vercel",
    ],
    link: "https://sistema-integrado.roxbjj.groves.com.br",
    previewUrl: "sistema-integrado.roxbjj.groves.com.br",
    thumbnail: "/projects/rox-bjj.png",
    status: "Em produção",
    year: "2024",
  },
  {
    id: "servclub",
    title: "ServClub — App para Associados",
    tabLabel: "ServClub",
    type: "mobile",
    featured: true,
    description:
      "Aplicativo iOS e Android para associados de clube de lazer. Consulta de parques, eventos, reservas, planos de associação e pagamento via PIX e cartão.",
    highlights: [
      "Publicado na App Store e Google Play",
      "Reservas, planos, check-in e programa de afiliados",
      "Pagamento de planos via PIX e cartão",
    ],
    tech: ["React Native", "Expo", "TypeScript", "NativeWind"],
    link: "https://apps.apple.com/br/app/servclub/id6692608376",
    previewUrl: "apps.apple.com/servclub",
    thumbnail: "/projects/servclub.png",
    status: "Publicado na App Store",
    year: "2023",
  },
  {
    id: "surja",
    title: "Surja — Gestor de Mesas",
    tabLabel: "Surja",
    type: "web",
    featured: true,
    description:
      "Sistema de gestão de mesas e chamados via QR Code para bares e restaurantes. Clientes chamam o garçom ou pedem a conta direto do celular, sem necessidade de app.",
    highlights: [
      "QR Code por mesa, sem app para o cliente",
      "Tela do salão com fila de chamados em tempo real",
      "Dashboard de métricas do atendimento",
    ],
    tech: [
      "Next.js",
      "TypeScript",
      "shadcn/ui",
      "Better Auth",
      "Drizzle ORM",
      "PostgreSQL",
    ],
    link: "https://surja.com.br",
    previewUrl: "surja.com.br",
    thumbnail: "/projects/surja.png",
    status: "Em produção",
    year: "2025",
  },

  {
    id: "cim-portal",
    title: "Conquista Imóveis — Portal Financeiro",
    tabLabel: "Conquista Imóveis",
    type: "web",
    featured: true,
    description:
      "Portal financeiro interno para imobiliária. Contas a pagar e receber, investimentos, relatórios em Excel, cadastro de clientes, corretores, construtoras e reservas de imóveis.",
    highlights: [
      "Dashboard mensal com indicadores financeiros",
      "Exportação de relatórios em Excel",
      "Cadastro de clientes, corretores, construtoras e reservas",
    ],
    tech: [
      "Next.js",
      "TypeScript",
      "PostgreSQL",
      "Drizzle ORM",
      "Better Auth",
      "Recharts",
      "ExcelJS",
    ],
    thumbnail: "/projects/cim-portal.png",
    status: "Em produção",
    year: "2024",
  },
  {
    id: "arc-gestor",
    title: "ARCO — Gestor de Mesas",
    tabLabel: "ARCO",
    type: "web",
    featured: true,
    description:
      "Sistema de gestão de mesas e chamados via QR Code para bares e restaurantes. Clientes chamam o garçom ou pedem a conta direto do celular, sem necessidade de app.",
    highlights: [
      "QR Code por mesa, sem app para o cliente",
      "Tela do salão com fila de chamados em tempo real",
      "Dashboard de métricas do atendimento",
    ],
    tech: [
      "Next.js",
      "TypeScript",
      "shadcn/ui",
      "Better Auth",
      "Drizzle ORM",
      "PostgreSQL",
    ],
    thumbnail: "/projects/arc-gestor.png",
    status: "Em produção",
    year: "2025",
  },
];

export interface Client {
  id: string;
  name: string;
  logo: string;
}

export const CLIENTS: Client[] = [
  { id: "celta", name: "Celta Contabilidade", logo: "/clients/celta.jpg" },
  { id: "servclub", name: "ServClub", logo: "/clients/servclub.jpg" },
  {
    id: "fotolivromania",
    name: "Foto Livro Mania",
    logo: "/clients/fotolivromania.png",
  },
  { id: "jabatec", name: "Jabatec", logo: "/clients/jabatec.png" },
  { id: "proalbuns", name: "Pro Álbuns", logo: "/clients/proalbuns.jpg" },
  { id: "terrabit", name: "Terra Bit", logo: "/clients/terrabit.jpg" },
  { id: "roxbjj", name: "ROX BJJ", logo: "/clients/roxbjj.jpg" },
  { id: "loopmais", name: "Loopmais", logo: "/clients/loopmais.jpg" },
  { id: "rise", name: "Agência Rise", logo: "/clients/rise.jpg" },
  { id: "picmimos", name: "Picmimos", logo: "/clients/picmimos.jpg" },
  { id: "salaorony", name: "Salão Rony", logo: "/clients/salaorony.jpg" },
  {
    id: "conquistaimoveis",
    name: "Conquista Imóveis",
    logo: "/clients/conquistaimoveis.jpg",
  },
  {
    id: "arco",
    name: "Associação Recreativa dos Correios",
    logo: "/clients/arco.jpg",
  },
];
