"use client";

import { Roboto_Mono } from "next/font/google";
import { useEffect, useRef } from "react";

const ascii = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const COLS = 224;
const ROWS = 72;
const LINE = 1.1154;
const SPARK = ".:~=*xo#";

type RawFrame = { far: string; near: string };
type Frame = {
  far: string;
  near: string;
  nearHtml: string;
  cover: Uint8Array;
};

function hash(n: number) {
  const value = Math.sin(n * 12.9898 + 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function parseFrame({ far, near }: RawFrame): Frame {
  const cover = new Uint8Array(COLS * ROWS);
  let text = "";
  let inside = false;
  let x = 0;
  let y = 0;

  for (const char of near) {
    if (char === "{" || char === "}") {
      inside = char === "{";
      continue;
    }
    text += char;
    if (char === "\n") {
      y += 1;
      x = 0;
      continue;
    }
    if (inside && x < COLS && y < ROWS) cover[y * COLS + x] = 1;
    x += 1;
  }

  return {
    far,
    near: text,
    nearHtml: near.replaceAll("{", "<span>").replaceAll("}", "</span>"),
    cover,
  };
}

function reveal(frame: Frame, time: number) {
  const farLines = frame.far.split("\n");
  const nearLines = frame.near.split("\n");
  const sparkStep = Math.floor(time * 30);
  const far: string[] = [];
  const near: string[] = [];
  const farHot: string[] = [];
  const nearHot: string[] = [];

  for (let y = 0; y < ROWS; y += 1) {
    const yNorm = (ROWS - 1 - y) / (ROWS - 1);
    const farLine = farLines[y] ?? "";
    const nearLine = nearLines[y] ?? "";
    let farRow = "";
    let nearRow = "";
    let farHotRow = "";
    let nearHotRow = "";

    const cell = (glyph: string, at: number, seed: number) => {
      const progress = time - at;
      if (glyph === " " || progress < 0) return { shown: " ", hot: " " };
      if (progress < 0.08) {
        return {
          shown: " ",
          hot: SPARK[Math.floor(hash(seed + sparkStep) * SPARK.length)] ?? ".",
        };
      }
      if (progress < 0.45) return { shown: " ", hot: glyph };
      return { shown: glyph, hot: " " };
    };

    for (let x = 0; x < COLS; x += 1) {
      const seed = y * COLS + x;
      const base =
        0.1 + 2 * yNorm + 0.35 * Math.abs(x / COLS - 0.5) + 0.2 * hash(seed);
      const covered = frame.cover[seed] === 1;
      const nearAt = base + 0.2;
      const nearCell = cell(nearLine[x] ?? " ", nearAt, seed);
      const farCell =
        covered && time >= nearAt
          ? { shown: " ", hot: " " }
          : cell(farLine[x] ?? " ", base, seed);

      nearRow += nearCell.shown;
      nearHotRow += nearCell.hot;
      farRow += farCell.shown;
      farHotRow += farCell.hot;
    }

    far.push(farRow);
    near.push(nearRow);
    farHot.push(farHotRow);
    nearHot.push(nearHotRow);
  }

  return {
    far: far.join("\n"),
    near: near.join("\n"),
    farHot: farHot.join("\n"),
    nearHot: nearHot.join("\n"),
  };
}

export function GlyphField() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const farRef = useRef<HTMLPreElement>(null);
  const nearRef = useRef<HTMLPreElement>(null);
  const hotRef = useRef<HTMLPreElement>(null);
  const nearHotRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    const root = rootRef.current;
    const far = farRef.current;
    const near = nearRef.current;
    const hot = hotRef.current;
    const nearHot = nearHotRef.current;
    const hero = scene?.parentElement;
    if (!scene || !root || !far || !near || !hot || !nearHot || !hero) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(pointer: fine)");
    let frames: Frame[] = [];
    let cancelled = false;
    let frame = 0;
    let direction = 1;
    let timer = 0;
    let intro = 0;
    let started = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let parallax = 0;
    let moving = false;

    const fit = () => {
      const { width, height } = root.getBoundingClientRect();
      if (width === 0 || height === 0) return;
      const size = Math.max(width / (0.6 * COLS), height / (ROWS * LINE));
      const textWidth = 0.6 * COLS * size;
      const textHeight = ROWS * LINE * size;
      root.style.setProperty("--temple-font", `${size.toFixed(3)}px`);
      root.style.setProperty("--temple-w", `${width.toFixed(1)}px`);
      root.style.setProperty(
        "--temple-x",
        `${((width - textWidth) / 2).toFixed(1)}px`,
      );
      root.style.setProperty(
        "--temple-y",
        `${(-0.35 * (textHeight - height)).toFixed(1)}px`,
      );
    };

    const show = (index: number) => {
      const current = frames[index];
      if (!current) return;
      far.textContent = current.far;
      near.innerHTML = current.nearHtml;
      hot.textContent = "";
      nearHot.textContent = "";
    };

    const step = () => {
      if (document.hidden) return;
      if (frame + direction < 0 || frame + direction >= frames.length) {
        direction = -direction;
      }
      frame += direction;
      show(frame);
    };

    const startIdle = () => {
      window.clearInterval(timer);
      show(frame);
      if (reduce.matches) return;
      timer = window.setInterval(step, 220);
    };

    const introFrame = (now: number) => {
      const elapsed = (now - started) / 1000;
      if (elapsed >= 3.3) {
        intro = 0;
        startIdle();
        return;
      }
      const next = reveal(frames[0], elapsed);
      far.textContent = next.far;
      near.textContent = next.near;
      hot.textContent = next.farHot;
      nearHot.textContent = next.nearHot;
      intro = window.requestAnimationFrame(introFrame);
    };

    const begin = () => {
      if (!frames.length) return;
      scene.dataset.temple = "ready";
      window.clearInterval(timer);
      if (intro) window.cancelAnimationFrame(intro);
      if (reduce.matches) {
        frame = 0;
        startIdle();
        return;
      }
      started = performance.now();
      intro = window.requestAnimationFrame(introFrame);
    };

    const glide = () => {
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;
      const settled =
        Math.abs(targetX - currentX) < 0.05 &&
        Math.abs(targetY - currentY) < 0.05;
      if (settled) {
        currentX = targetX;
        currentY = targetY;
      }
      const front = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`;
      const back = `translate3d(${(currentX * 0.35).toFixed(2)}px, ${(currentY * 0.35).toFixed(2)}px, 0)`;
      near.style.transform = front;
      nearHot.style.transform = front;
      far.style.transform = back;
      hot.style.transform = back;
      if (moving || !settled) parallax = window.requestAnimationFrame(glide);
      else parallax = 0;
    };

    const onMove = (event: PointerEvent) => {
      if (reduce.matches || !fine.matches) return;
      const rect = hero.getBoundingClientRect();
      targetX = -(10 * (2 * ((event.clientX - rect.left) / rect.width - 0.5)));
      targetY = -(5 * (2 * ((event.clientY - rect.top) / rect.height - 0.5)));
      moving = true;
      if (!parallax) parallax = window.requestAnimationFrame(glide);
    };

    const onLeave = () => {
      moving = false;
      targetX = 0;
      targetY = 0;
      if (!parallax) parallax = window.requestAnimationFrame(glide);
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(root);
    void document.fonts.ready.then(fit);
    reduce.addEventListener("change", begin);
    hero.addEventListener("pointermove", onMove, { passive: true });
    hero.addEventListener("pointerleave", onLeave);

    void import("./glyph-frames.json").then((module) => {
      if (cancelled) return;
      frames = (module.default as RawFrame[]).map(parseFrame);
      begin();
    });

    return () => {
      cancelled = true;
      window.clearInterval(timer);
      if (intro) window.cancelAnimationFrame(intro);
      if (parallax) window.cancelAnimationFrame(parallax);
      observer.disconnect();
      reduce.removeEventListener("change", begin);
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
      delete scene.dataset.temple;
    };
  }, []);

  return (
    <div ref={sceneRef} aria-hidden className="glyph-scene">
      <div ref={rootRef} className={`glyph-temple ${ascii.className}`}>
        <pre ref={farRef} data-layer="far" />
        <pre ref={nearRef} data-layer="near" />
        <pre ref={hotRef} data-layer="hot" />
        <pre ref={nearHotRef} data-layer="near-hot" />
      </div>
    </div>
  );
}
