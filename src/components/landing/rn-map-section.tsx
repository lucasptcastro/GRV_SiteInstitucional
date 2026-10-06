import rnMap from "@/data/rn-map.json";
import { MAP_PINS } from "@/lib/map-pins";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

type Municipality = {
  id: string;
  name: string;
  key: string;
  d: string;
  x: number;
  y: number;
};

const MUNICIPALITIES = rnMap.municipalities as Municipality[];
const BOUNDS = rnMap.bounds;

function normalizeCity(value: string) {
  return value.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().trim();
}

function pathBounds(d: string) {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const match of d.matchAll(/[ML]([\d.]+) ([\d.]+)/g)) {
    const x = Number(match[1]);
    const y = Number(match[2]);
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }
  return { minX, maxX, minY, maxY };
}

const FOCUS_PINS = MAP_PINS.filter((pin) => pin.id !== "terrabit");

const CROP = (() => {
  const keys = new Set(FOCUS_PINS.map((pin) => normalizeCity(pin.city)));
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const municipality of MUNICIPALITIES) {
    if (!keys.has(municipality.key)) continue;
    const bounds = pathBounds(municipality.d);
    minX = Math.min(minX, bounds.minX);
    maxX = Math.max(maxX, bounds.maxX);
    minY = Math.min(minY, bounds.minY);
    maxY = Math.max(maxY, bounds.maxY);
  }
  const minAspect = 1.5;
  let cropMinX = Math.max(0, minX - 64);
  let cropMaxX = Math.min(rnMap.width, maxX + 72);
  let cropMinY = Math.max(0, minY - 44);
  let cropMaxY = Math.min(rnMap.height, maxY + 44);
  const height = cropMaxY - cropMinY;
  const neededWidth = height * minAspect;
  if (cropMaxX - cropMinX < neededWidth) {
    cropMinX = Math.max(0, cropMaxX - neededWidth);
  }
  return {
    minX: cropMinX,
    maxX: cropMaxX,
    minY: cropMinY,
    maxY: cropMaxY,
  };
})();

type PlacedPin = (typeof MAP_PINS)[number] & { x: number; y: number };

function project(lat: number, lng: number) {
  const x = ((lng - BOUNDS.minLon) / (BOUNDS.maxLon - BOUNDS.minLon)) * 100;
  const y = ((BOUNDS.maxLat - lat) / (BOUNDS.maxLat - BOUNDS.minLat)) * 100;
  return { x, y };
}

function separatePins(pins: PlacedPin[]) {
  const origin = pins.map((pin) => ({ x: pin.x, y: pin.y }));
  const placed = pins.map((pin) => ({ ...pin }));
  const unitX = rnMap.width / 100;
  const unitY = rnMap.height / 100;
  const minGap = 16;

  for (let pass = 0; pass < 12; pass += 1) {
    for (let i = 0; i < placed.length; i += 1) {
      for (let j = i + 1; j < placed.length; j += 1) {
        const dx = (placed[j].x - placed[i].x) * unitX;
        const dy = (placed[j].y - placed[i].y) * unitY;
        const dist = Math.hypot(dx, dy);
        if (dist >= minGap) continue;
        const angle = dist === 0 ? j * 2.399 : Math.atan2(dy, dx);
        const push = (minGap - dist) / 2;
        placed[i].x -= (Math.cos(angle) * push) / unitX;
        placed[i].y -= (Math.sin(angle) * push) / unitY;
        placed[j].x += (Math.cos(angle) * push) / unitX;
        placed[j].y += (Math.sin(angle) * push) / unitY;
      }
    }
  }

  const maxDrift = 1.8;
  return placed.map((pin, index) => {
    const dx = pin.x - origin[index].x;
    const dy = pin.y - origin[index].y;
    const drift = Math.hypot(dx, dy);
    if (drift <= maxDrift) return pin;
    return {
      ...pin,
      x: origin[index].x + (dx / drift) * maxDrift,
      y: origin[index].y + (dy / drift) * maxDrift,
    };
  });
}

function toCrop(pin: PlacedPin) {
  const svgX = (pin.x / 100) * rnMap.width;
  const svgY = (pin.y / 100) * rnMap.height;
  return {
    ...pin,
    x: ((svgX - CROP.minX) / (CROP.maxX - CROP.minX)) * 100,
    y: ((svgY - CROP.minY) / (CROP.maxY - CROP.minY)) * 100,
  };
}

function placedPins() {
  return separatePins(
    FOCUS_PINS.map((pin) => ({ ...pin, ...project(pin.lat, pin.lng) })),
  ).map(toCrop);
}

export function RnMapSection() {
  const pins = placedPins();

  return (
    <section
      id="mapa"
      className="scroll-mt-20 border-b border-border px-4 py-24 sm:px-6"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            label="Presença"
            title="Onde temos projetos  no RN"
            description="Clientes na região de Natal, no litoral leste do Rio Grande do Norte."
          />
        </Reveal>

        <Reveal delay={80}>
          <div className="relative mx-auto mt-12 max-w-4xl">
            <svg
              viewBox={`${CROP.minX} ${CROP.minY} ${CROP.maxX - CROP.minX} ${CROP.maxY - CROP.minY}`}
              role="img"
              aria-label="Mapa da região de Natal no Rio Grande do Norte"
              className="h-auto w-full"
            >
              <rect
                x={CROP.minX}
                y={CROP.minY}
                width={CROP.maxX - CROP.minX}
                height={CROP.maxY - CROP.minY}
                fill="oklch(0.95 0.03 220)"
              />
              {MUNICIPALITIES.map((municipality) => (
                <path
                  key={municipality.id}
                  d={municipality.d}
                  fill="oklch(0.96 0.03 166)"
                  stroke="oklch(0.72 0.08 166)"
                  strokeWidth={0.8}
                  strokeLinejoin="round"
                >
                  <title>{municipality.name}</title>
                </path>
              ))}
            </svg>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background: `
                  linear-gradient(to right, var(--background) 0%, transparent 16%, transparent 94%, var(--background) 100%),
                  linear-gradient(to bottom, var(--background) 0%, transparent 14%, transparent 86%, var(--background) 100%)
                `,
              }}
            />

            {pins.map((pin) => (
              <div
                key={pin.id}
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2 hover:z-20"
                style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={pin.logo}
                  alt={pin.name}
                  title={`${pin.name} — ${pin.city}`}
                  width={40}
                  height={40}
                  className="size-10 rounded-full border-2 border-white object-cover shadow-md"
                />
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
