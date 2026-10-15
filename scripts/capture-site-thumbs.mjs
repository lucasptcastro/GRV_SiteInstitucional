import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

// budget: tempo virtual (ms) ate o screenshot. Curto demais pega a pagina
// incompleta; longo demais pega popups que abrem com atraso (caso do proalbuns).
const SITES = [
  { id: "proalbuns", url: "https://www.proalbuns.com.br/", budget: 3000 },
  { id: "picmimos", url: "https://www.picmimos.com.br/", budget: 12000 },
  { id: "fotolivromania", url: "https://fotolivromania.com.br/", budget: 12000 },
  { id: "loopmais", url: "https://loopmaistv.com.br/", budget: 12000 },
  { id: "olucaspeixoto", url: "https://olucaspeixoto.com.br/", budget: 12000 },
];

const WIDTH = 1440;
const HEIGHT = 900;
const OUT_DIR = resolve(process.cwd(), "public", "sites");

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
].filter(Boolean);

function findChrome() {
  const found = CHROME_CANDIDATES.find((candidate) => existsSync(candidate));
  if (!found) {
    throw new Error(
      "Chrome nao encontrado. Instale o Chrome ou defina CHROME_PATH com o caminho do executavel.",
    );
  }
  return found;
}

function budgetFor(site) {
  const override = process.env[`BUDGET_${site.id.toUpperCase()}`];
  return override ? Number(override) : site.budget;
}

function capture(chrome, site, profileDir) {
  const out = join(OUT_DIR, `${site.id}.png`);
  execFileSync(
    chrome,
    [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      "--disable-extensions",
      "--no-first-run",
      "--force-device-scale-factor=1",
      `--user-data-dir=${profileDir}`,
      `--window-size=${WIDTH},${HEIGHT}`,
      `--virtual-time-budget=${budgetFor(site)}`,
      `--screenshot=${out}`,
      site.url,
    ],
    { stdio: "inherit", timeout: 120000 },
  );
  return out;
}

const wanted = process.argv.slice(2);
const targets = wanted.length
  ? SITES.filter((site) => wanted.includes(site.id))
  : SITES;

if (!targets.length) {
  throw new Error(
    `Nenhum site corresponde a "${wanted.join(", ")}". Ids validos: ${SITES.map((s) => s.id).join(", ")}`,
  );
}

const chrome = findChrome();
mkdirSync(OUT_DIR, { recursive: true });
const profileDir = mkdtempSync(join(tmpdir(), "grv-thumbs-"));

console.log(`Chrome: ${chrome}`);
console.log(`Saida: ${OUT_DIR} (${WIDTH}x${HEIGHT})\n`);

const results = [];
try {
  for (const site of targets) {
    console.log(`Capturando ${site.id} -> ${site.url}`);
    const out = capture(chrome, site, profileDir);
    results.push({ id: site.id, out });
  }
} finally {
  rmSync(profileDir, { recursive: true, force: true });
}

console.log("\nMiniaturas geradas:");
for (const { id, out } of results) {
  const kb = existsSync(out) ? Math.round(statSync(out).size / 1024) : 0;
  console.log(`  ${id.padEnd(16)} ${String(kb).padStart(6)} KB  ${out}`);
}
