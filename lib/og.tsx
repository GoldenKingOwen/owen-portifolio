import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

// Brand colours mirror --color-bg / --color-accent-* in app/globals.css.
export function renderOg({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px",
          background: "#0d1117",
          color: "#e8eaf0",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, color: "#5fd0d3" }}>{eyebrow}</div>
        <div
          style={{
            display: "flex",
            fontSize: title.length > 40 ? 64 : 92,
            fontWeight: 700,
            lineHeight: 1.1,
            marginTop: 24,
          }}
        >
          {title}
        </div>
        <div style={{ display: "flex", fontSize: 36, color: "#8b92a8", marginTop: 32 }}>
          {subtitle}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 48,
            width: 160,
            height: 8,
            borderRadius: 4,
            background: "#5fd0d3",
          }}
        />
      </div>
    ),
    ogSize
  );
}
