"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

export type OrbitGlobeItem = {
  id: string;
  name: string;
  icon: string;
};

type Orbit = {
  radius: number;
  tilt: number;
  roll: number;
  speed: number;
  phase: number;
};

type Projected = {
  x: number;
  y: number;
  depth: number;
  hidden: boolean;
};

const CONTINENTS: [number, number][][] = [
  [
    [-168, 70],
    [-138, 70],
    [-120, 60],
    [-100, 53],
    [-80, 54],
    [-54, 48],
    [-65, 35],
    [-81, 25],
    [-86, 10],
    [-103, 22],
    [-119, 33],
    [-130, 52],
    [-164, 60],
  ],
  [
    [-81, 12],
    [-63, 10],
    [-48, -2],
    [-35, -8],
    [-47, -24],
    [-60, -40],
    [-70, -55],
    [-76, -30],
    [-80, -5],
  ],
  [
    [-18, 36],
    [4, 37],
    [14, 32],
    [34, 31],
    [51, 12],
    [43, -12],
    [32, -30],
    [18, -35],
    [10, -18],
    [-2, 5],
    [-17, 15],
  ],
  [
    [-10, 36],
    [-9, 58],
    [12, 71],
    [33, 70],
    [44, 58],
    [70, 74],
    [105, 77],
    [144, 60],
    [178, 65],
    [160, 46],
    [135, 35],
    [122, 20],
    [108, 7],
    [95, 18],
    [79, 7],
    [65, 25],
    [45, 30],
    [30, 42],
    [15, 38],
  ],
  [
    [112, -12],
    [133, -10],
    [152, -23],
    [147, -39],
    [124, -34],
    [113, -24],
  ],
  [
    [-54, 59],
    [-26, 70],
    [-36, 82],
    [-60, 80],
  ],
];

const ORBITS: Orbit[] = [
  { radius: 1.5, tilt: 0.34, roll: 0.1, speed: 0.13, phase: 0.3 },
  { radius: 1.9, tilt: 0.5, roll: -0.3, speed: -0.09, phase: 1.7 },
  { radius: 2.25, tilt: 0.28, roll: 0.18, speed: 0.07, phase: 3.1 },
];

const MOBILE_ORBITS = ORBITS.slice(0, 2).map((orbit) => ({
  ...orbit,
  radius: orbit.radius * 0.75,
}));

const CHAR_SIZE = 8;
const GLOBE_TILT = 0.36;
const PERSPECTIVE = 9;
const LAND_CACHE = new Uint8Array(720 * 360);

function perspective(z: number) {
  return PERSPECTIVE / (PERSPECTIVE - z);
}

function containsPoint(lon: number, lat: number, ring: [number, number][]) {
  let inside = false;

  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [lonA, latA] = ring[i];
    const [lonB, latB] = ring[j];
    const crosses =
      latA > lat !== latB > lat &&
      lon < ((lonB - lonA) * (lat - latA)) / (latB - latA) + lonA;

    if (crosses) inside = !inside;
  }

  return inside;
}

function isLand(lon: number, lat: number) {
  const row = Math.min(359, Math.max(0, Math.floor((lat + 90) * 2)));
  const col = Math.min(719, Math.max(0, Math.floor((lon + 180) * 2)));
  const index = row * 720 + col;

  if (LAND_CACHE[index] === 0) {
    LAND_CACHE[index] = CONTINENTS.some((ring) =>
      containsPoint(lon, lat, ring),
    )
      ? 1
      : 2;
  }

  return LAND_CACHE[index] === 1;
}

function projectOrbit(orbit: Orbit, angle: number): Projected {
  const x = Math.cos(angle) * orbit.radius;
  const ySpin = Math.sin(angle) * orbit.radius;
  const y = -ySpin * Math.sin(orbit.tilt);
  const z = ySpin * Math.cos(orbit.tilt);
  const worldX = x * Math.cos(orbit.roll) - y * Math.sin(orbit.roll);
  const worldY = x * Math.sin(orbit.roll) + y * Math.cos(orbit.roll);
  const scale = perspective(z);

  return {
    x: worldX * scale,
    y: worldY * scale,
    depth: z / orbit.radius,
    hidden: z / orbit.radius < 0 && Math.hypot(worldX * scale, worldY * scale) < 1.04,
  };
}

function orbitExtent(orbits: Orbit[]) {
  let maxX = 1;
  let maxY = 1;

  for (const orbit of orbits) {
    const scale = perspective(orbit.radius);
    const sinTilt = Math.sin(orbit.tilt);
    const cosRoll = Math.cos(orbit.roll);
    const sinRoll = Math.sin(orbit.roll);

    maxX = Math.max(
      maxX,
      orbit.radius * Math.hypot(cosRoll, sinTilt * sinRoll) * scale,
    );
    maxY = Math.max(
      maxY,
      orbit.radius * Math.hypot(sinRoll, sinTilt * cosRoll) * scale,
    );
  }

  return { x: maxX, y: maxY };
}

function orbitPaths(
  orbit: Orbit,
  unit: number,
  width: number,
  height: number,
  steps = 96,
) {
  const samples = Array.from({ length: steps }, (_, index) =>
    projectOrbit(orbit, orbit.phase + ((Math.PI * 2) * index) / steps),
  );
  const seam = samples.findIndex(
    (point, index) => point.hidden !== samples[(index || steps) - 1].hidden,
  );
  const ordered =
    seam < 0
      ? samples
      : [...samples.slice(seam), ...samples.slice(0, seam)];

  const groups: Projected[][] = [];
  for (const point of ordered) {
    const current = groups[groups.length - 1];
    if (current && current[0].hidden === point.hidden) current.push(point);
    else groups.push([point]);
  }

  const closed = groups.map((group, index) => [
    ...group,
    groups[(index + 1) % groups.length][0],
  ]);

  const toPath = (hidden: boolean) =>
    closed
      .filter((group) => group[0].hidden === hidden)
      .map((group) =>
        group
          .map((point, index) => {
            const x = (width / 2 + point.x * unit).toFixed(1);
            const y = (height / 2 - point.y * unit).toFixed(1);
            return `${index ? "L" : "M"} ${x} ${y}`;
          })
          .join(" "),
      )
      .join(" ");

  return { near: toPath(false), far: toPath(true) };
}

function rotateGlobe(lat: number, lon: number, radius = 1): [number, number, number] {
  const x = Math.cos(lat) * Math.sin(lon) * radius;
  const y = Math.sin(lat) * radius;
  const z = Math.cos(lat) * Math.cos(lon) * radius;
  const cos = Math.cos(GLOBE_TILT);
  const sin = Math.sin(GLOBE_TILT);

  return [x, cos * y - sin * z, sin * y + cos * z];
}

function rasterizeGlobe(
  cols: number,
  rows: number,
  charAspect: number,
  radius: number,
  time: number,
) {
  const empty = () =>
    Array.from({ length: rows }, () => Array.from({ length: cols }, () => " "));
  const dim = empty();
  const ink = empty();
  const depth = new Float32Array(cols * rows).fill(Number.NEGATIVE_INFINITY);
  const midCol = cols / 2;
  const midRow = rows / 2;
  const spin = 0.19 * time;
  const latStep = 1 / (1.75 * radius);
  const lonStep = 1 / (1.75 * (radius / charAspect));

  const plot = (
    point: [number, number, number],
    glyph: string,
    layer: "dim" | "ink",
    z = point[2],
  ) => {
    const scale = perspective(point[2]);
    const col = Math.round(midCol + point[0] * scale * (radius / charAspect));
    const row = Math.round(midRow - point[1] * scale * radius);
    if (col < 0 || col >= cols || row < 0 || row >= rows) return;

    const index = row * cols + col;
    if (z < depth[index] - 0.012) return;

    depth[index] = z;
    dim[row][col] = " ";
    ink[row][col] = " ";
    (layer === "ink" ? ink : dim)[row][col] = glyph;
  };

  for (let lat = -Math.PI / 2; lat <= Math.PI / 2; lat += latStep) {
    const latDeg = (lat * 180) / Math.PI;

    for (let lon = -Math.PI; lon < Math.PI; lon += lonStep) {
      const point = rotateGlobe(lat, lon + spin);
      if (point[2] < -0.05) continue;

      const grid =
        Math.abs(((6 * lat) / Math.PI) % 1) < 0.05 ||
        Math.abs(((6 * lon) / Math.PI) % 1) < 0.05;

      if (isLand((lon * 180) / Math.PI, latDeg)) {
        plot(
          point,
          point[2] > 0.6 ? "+" : point[2] > 0.25 ? ":" : ".",
          "ink",
        );
      } else {
        plot(point, grid ? "." : " ", "dim");
      }
    }
  }

  for (let angle = 0; angle <= Math.PI * 2; angle += 0.004) {
    plot(
      [1.01 * Math.cos(angle), 1.01 * Math.sin(angle), 0],
      ".",
      "ink",
      1,
    );
  }

  return {
    dim: dim.map((row) => row.join("")).join("\n"),
    ink: ink.map((row) => row.join("")).join("\n"),
  };
}

function iconPose(orbit: Orbit, slot: number, slots: number, time: number) {
  const angle =
    orbit.phase +
    ((Math.PI * 2) * slot) / Math.max(1, slots) +
    time * orbit.speed;
  const point = projectOrbit(orbit, angle);
  const lit = (point.depth + 1) / 2;
  const fade =
    point.depth >= 0
      ? 1
      : (() => {
          const t = Math.min(
            1,
            Math.max(0, (Math.hypot(point.x, point.y) - 1.04) / 0.3),
          );
          return t * t * (3 - 2 * t);
        })();
  const size =
    (perspective(point.depth * orbit.radius) / perspective(orbit.radius)) *
    (0.78 + 0.22 * lit) *
    (0.9 + 0.1 * fade);

  return {
    ...point,
    scale: size,
    opacity: (0.4 + 0.6 * lit) * fade,
  };
}

function assignIcons(count: number, ringCount: number) {
  return Array.from({ length: count }, (_, index) => {
    const ring = index % ringCount;
    return {
      ring,
      slot: Math.floor(index / ringCount),
      slots: Math.ceil((count - ring) / ringCount),
    };
  });
}

export function OrbitGlobe({
  items,
  className,
}: {
  items: readonly OrbitGlobeItem[];
  className?: string;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const iconRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const frame = frameRef.current;
    const canvas = canvasRef.current;
    const svg = svgRef.current;
    const ctx = canvas?.getContext("2d");
    if (!frame || !canvas || !svg || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let charWidth = 4.8;
    let unit = 100;
    let font = "";
    let orbits = ORBITS;
    let visibleCount: number = items.length;
    let visible = false;
    let elapsed = 0;
    let lastGlobe = Number.NEGATIVE_INFINITY;
    let raf = 0;
    let clock = 0;

    const layout = () => {
      const box = frame.getBoundingClientRect();
      width = box.width;
      height = box.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      font = `500 ${CHAR_SIZE}px ${getComputedStyle(canvas).fontFamily}`;
      ctx.font = font;
      charWidth = ctx.measureText("M").width || 4.2;
      cols = Math.floor(width / charWidth);
      rows = Math.floor(height / CHAR_SIZE);

      const mobile = width < 640;
      orbits = mobile ? MOBILE_ORBITS : ORBITS;
      const pad = mobile ? 4 : 28;
      const extent = orbitExtent(orbits);
      unit = Math.max(
        1,
        Math.min((width / 2 - pad) / extent.x, (height / 2 - pad) / extent.y),
      );

      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      const paths = svg.querySelectorAll("path");
      orbits.forEach((orbit, index) => {
        const { near, far } = orbitPaths(orbit, unit, width, height);
        paths[index * 2]?.setAttribute("d", far);
        paths[index * 2 + 1]?.setAttribute("d", near);
      });
      for (let index = orbits.length; index < ORBITS.length; index++) {
        paths[index * 2]?.setAttribute("d", "");
        paths[index * 2 + 1]?.setAttribute("d", "");
      }

      const nextCount = items.length;
      if (nextCount !== visibleCount) {
        visibleCount = nextCount;
        iconRefs.current.forEach((node, index) => {
          if (node) node.style.display = index < visibleCount ? "" : "none";
        });
      }
    };

    const drawGlobe = (time: number) => {
      if (!cols || !rows) return;

      const layers = rasterizeGlobe(
        cols,
        rows,
        charWidth / CHAR_SIZE,
        unit / CHAR_SIZE,
        time,
      );
      const styles = getComputedStyle(canvas);
      const dim = "rgba(0, 0, 0, 0.32)";
      const ink = styles.color || "rgba(0, 0, 0, 0.64)";
      const offsetX = (width - cols * charWidth) / 2;
      const offsetY = (height - rows * CHAR_SIZE) / 2;

      ctx.clearRect(0, 0, width, height);
      ctx.font = font;
      ctx.textBaseline = "top";

      for (const [text, color] of [
        [layers.dim, dim],
        [layers.ink, ink],
      ] as const) {
        ctx.fillStyle = color;
        text.split("\n").forEach((line, index) => {
          ctx.fillText(line, offsetX, offsetY + index * CHAR_SIZE);
        });
      }
    };

    const drawIcons = (time: number) => {
      const slots = assignIcons(visibleCount, orbits.length);

      for (let index = 0; index < visibleCount; index++) {
        const node = iconRefs.current[index];
        if (!node) continue;

        const { ring, slot, slots: ringSlots } = slots[index];
        const pose = iconPose(orbits[ring], slot, ringSlots, time);

        node.style.transform = `translate3d(${Math.round(pose.x * unit)}px, ${Math.round(-pose.y * unit)}px, 0) scale(${pose.scale.toFixed(3)})`;
        node.style.opacity = pose.opacity.toFixed(3);
        node.style.zIndex =
          pose.depth < 0 ? "1" : String(3 + Math.round(10 * pose.depth));
      }
    };

    const render = (time: number, forceGlobe = false) => {
      drawIcons(time);
      if (forceGlobe || time - lastGlobe >= 0.08) {
        lastGlobe = time;
        drawGlobe(time);
      }
    };

    const tick = (now: number) => {
      if (clock) elapsed += Math.min(0.1, (now - clock) / 1000);
      clock = now;
      render(elapsed);
      raf = requestAnimationFrame(tick);
    };

    const syncPlayback = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      clock = 0;

      if (!visible || document.hidden || reduced.matches) {
        render(reduced.matches ? 2.6 : elapsed, true);
        return;
      }

      raf = requestAnimationFrame(tick);
    };

    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncPlayback();
    });
    const resize = new ResizeObserver(() => {
      layout();
      render(reduced.matches ? 2.6 : elapsed, true);
    });

    intersection.observe(frame);
    resize.observe(frame);
    reduced.addEventListener("change", syncPlayback);
    document.addEventListener("visibilitychange", syncPlayback);
    layout();
    syncPlayback();
    document.fonts
      ?.load(font)
      .then(() => {
        layout();
        render(reduced.matches ? 2.6 : elapsed, true);
      })
      .catch(() => undefined);

    return () => {
      cancelAnimationFrame(raf);
      intersection.disconnect();
      resize.disconnect();
      reduced.removeEventListener("change", syncPlayback);
      document.removeEventListener("visibilitychange", syncPlayback);
    };
  }, [items]);

  return (
    <div
      ref={frameRef}
      className={cn(
        "relative isolate h-[440px] w-full overflow-hidden sm:h-[520px] lg:h-[600px]",
        className,
      )}
    >
          <canvas
            ref={canvasRef}
            aria-hidden
            className="pointer-events-none absolute inset-0 z-[2] block size-full select-none font-mono text-foreground/70"
          />

          <svg
            ref={svgRef}
            aria-hidden
            fill="none"
            className="pointer-events-none absolute inset-0 z-[2] size-full"
          >
            {ORBITS.map((orbit) => (
              <g
                key={`${orbit.radius}-${orbit.phase}`}
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              >
                <path
                  className="stroke-foreground/4"
                  strokeDasharray="3 5"
                />
                <path className="stroke-foreground/12" />
              </g>
            ))}
          </svg>

      <div aria-hidden className="absolute inset-0">
        {items.map((item, index) => (
          <span
            key={item.id}
            ref={(node) => {
              iconRefs.current[index] = node;
            }}
            title={item.name}
            style={{ opacity: 0 }}
            className="absolute top-1/2 left-1/2 z-[3] -mt-7 -ml-7 flex size-14 items-center justify-center overflow-hidden rounded-[14px] border border-border/80 bg-background p-2 shadow-[0_1px_2px_rgba(0,0,0,0.04)] will-change-transform"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.icon}
              alt=""
              width={36}
              height={36}
              className="size-9 object-contain"
            />
          </span>
        ))}
      </div>

      <p className="sr-only">
        Globo ASCII com empresas em órbita:{" "}
        {items.map((item) => item.name).join(", ")}.
      </p>
    </div>
  );
}
