import { readFile } from "node:fs/promises";
import { ImageResponse } from "next/og";
import { join } from "node:path";

export const imageSize = { width: 1200, height: 630 };

export async function socialImage(
  title: string,
  eyebrow: string,
  description: string,
) {
  const logo = await readFile(
    join(process.cwd(), "public/brand/wejha-logo.png"),
  );
  const image = `data:image/png;base64,${logo.toString("base64")}`;
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
        }}
      >
        {/* The OG rasterizer consumes a data URL directly. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          width={250}
          height={84}
          alt=""
          style={{ borderRadius: 10, objectFit: "cover" }}
        />
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
