import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { SITE } from "@/lib/site";

export const runtime = "nodejs";
export const alt = SITE.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const mark = await readFile(join(process.cwd(), "public/brand/mark.png"));
  const markSrc = `data:image/png;base64,${mark.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0a18",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={markSrc}
          alt=""
          width={88}
          height={88}
          style={{ marginBottom: 32 }}
        />
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: "#ffffff",
            lineHeight: 1.1,
            marginBottom: 16,
            letterSpacing: "-1px",
          }}
        >
          Grove Solutions
        </div>
        <div
          style={{
            fontSize: 28,
            fontWeight: 500,
            color: "#18CB96",
            marginBottom: 40,
          }}
        >
          Apps, sites, sistemas e automações
        </div>
        <div
          style={{
            display: "flex",
            gap: 24,
            fontSize: 18,
            color: "#6b7280",
          }}
        >
          <span>Rio Grande do Norte — Brasil</span>
          <span>·</span>
          <span>contato@groves.com.br</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
