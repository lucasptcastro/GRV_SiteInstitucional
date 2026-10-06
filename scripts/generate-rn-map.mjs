import { writeFile } from "node:fs/promises";

const MALHA =
  "https://servicodados.ibge.gov.br/api/v3/malhas/estados/24?formato=application/vnd.geo+json&qualidade=minima&intrarregiao=municipio";
const MUNICIPIOS =
  "https://servicodados.ibge.gov.br/api/v1/localidades/estados/24/municipios";

function norm(value) {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .trim();
}

function collectRings(geometry) {
  if (geometry.type === "Polygon") return geometry.coordinates;
  if (geometry.type === "MultiPolygon") return geometry.coordinates.flat();
  return [];
}

function projectFactory(bounds, width, height) {
  const lonSpan = bounds.maxLon - bounds.minLon;
  const latSpan = bounds.maxLat - bounds.minLat;
  return (lon, lat) => {
    const x = ((lon - bounds.minLon) / lonSpan) * width;
    const y = ((bounds.maxLat - lat) / latSpan) * height;
    return [x, y];
  };
}

function ringArea(ring, project) {
  let area = 0;
  for (let i = 0; i < ring.length - 1; i += 1) {
    const [x0, y0] = project(ring[i][0], ring[i][1]);
    const [x1, y1] = project(ring[i + 1][0], ring[i + 1][1]);
    area += x0 * y1 - x1 * y0;
  }
  return area / 2;
}

function ringCentroid(ring, project) {
  let area = 0;
  let cx = 0;
  let cy = 0;
  for (let i = 0; i < ring.length - 1; i += 1) {
    const [x0, y0] = project(ring[i][0], ring[i][1]);
    const [x1, y1] = project(ring[i + 1][0], ring[i + 1][1]);
    const cross = x0 * y1 - x1 * y0;
    area += cross;
    cx += (x0 + x1) * cross;
    cy += (y0 + y1) * cross;
  }
  area /= 2;
  if (Math.abs(area) < 1e-6) {
    const [x, y] = project(ring[0][0], ring[0][1]);
    return [x, y];
  }
  return [cx / (6 * area), cy / (6 * area)];
}

function ringPath(ring, project) {
  return (
    ring
      .map((coord, index) => {
        const [x, y] = project(coord[0], coord[1]);
        const cmd = index === 0 ? "M" : "L";
        return `${cmd}${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join("") + "Z"
  );
}

const [malha, municipios] = await Promise.all([
  fetch(MALHA).then((response) => {
    if (!response.ok) throw new Error(`malha ${response.status}`);
    return response.json();
  }),
  fetch(MUNICIPIOS).then((response) => {
    if (!response.ok) throw new Error(`municipios ${response.status}`);
    return response.json();
  }),
]);

const names = new Map(
  municipios.map((item) => [String(item.id), item.nome]),
);

let minLon = Infinity;
let minLat = Infinity;
let maxLon = -Infinity;
let maxLat = -Infinity;

for (const feature of malha.features) {
  for (const ring of collectRings(feature.geometry)) {
    for (const [lon, lat] of ring) {
      minLon = Math.min(minLon, lon);
      maxLon = Math.max(maxLon, lon);
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
    }
  }
}

const padLon = (maxLon - minLon) * 0.03;
const padLat = (maxLat - minLat) * 0.03;
const bounds = {
  minLon: minLon - padLon,
  maxLon: maxLon + padLon,
  minLat: minLat - padLat,
  maxLat: maxLat + padLat,
};

const width = 1000;
const height = Math.round(
  (width * (bounds.maxLat - bounds.minLat)) /
    (bounds.maxLon - bounds.minLon),
);
const project = projectFactory(bounds, width, height);

const municipalities = malha.features.map((feature) => {
  const code = String(
    feature.properties.codarea ??
      feature.properties.id ??
      feature.properties.geocodigo ??
      "",
  );
  const name = names.get(code);
  if (!name) {
    throw new Error(`município sem nome: ${code} ${JSON.stringify(feature.properties)}`);
  }

  const rings = collectRings(feature.geometry);
  let largest = rings[0];
  let largestArea = 0;
  for (const ring of rings) {
    const area = Math.abs(ringArea(ring, project));
    if (area > largestArea) {
      largest = ring;
      largestArea = area;
    }
  }

  const [cx, cy] = ringCentroid(largest, project);
  return {
    id: code,
    name,
    key: norm(name),
    d: rings.map((ring) => ringPath(ring, project)).join(""),
    x: Number(((cx / width) * 100).toFixed(2)),
    y: Number(((cy / height) * 100).toFixed(2)),
  };
});

municipalities.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

const payload = { width, height, bounds, municipalities };
await writeFile(
  new URL("../src/data/rn-map.json", import.meta.url),
  JSON.stringify(payload),
);

console.log(
  `municipios=${municipalities.length} viewBox=${width}x${height}`,
);
