import { readFile } from "node:fs/promises";
import { ImageResponse } from "next/og";
import { join } from "node:path";

export const imageSize = { width: 1200, height: 630 };

export async function socialImage(
  title: string,
  eyebrow: string,
  description: string,
) {
  const mark = await readFile(join(process.cwd(), "public/brand/favicon.png"));
  const image = `data:image/png;base64,${mark.toString("base64")}`;
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "linear-gradient(128deg, #0A1428 25%, #193C78 100%)",
        color: "white",
        padding: "66px 80px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 17,
          fontSize: 42,
          fontWeight: 700,
          letterSpacing: "-1px",
        }}
      >
        {/* The OG rasterizer consumes a data URL directly. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          width={62}
          height={62}
          alt=""
          style={{ borderRadius: 10 }}
        />
        <span>wejha</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
        <span
          style={{
            color: "#80B4FF",
            fontSize: 24,
            textTransform: "uppercase",
            letterSpacing: "3px",
          }}
        >
          {eyebrow}
        </span>
        <strong
          style={{
            fontSize: title.length > 36 ? 65 : 83,
            lineHeight: 1.02,
            letterSpacing: "-3px",
          }}
        >
          {title}
        </strong>
        <span style={{ color: "#c6d6f1", maxWidth: 850, fontSize: 28 }}>
          {description}
        </span>
      </div>
      <div
        style={{
          display: "flex",
          width: 100,
          height: 5,
          background: "#80B4FF",
        }}
      />
    </div>,
    imageSize,
  );
}
