import { ImageResponse } from "next/og";
import { siteConfig } from "./site-config";

export const ogSize = { width: 1200, height: 630 };

/**
 * Shared 1200×630 social preview: wordmark, a large title and a subtitle.
 * Hex values mirror the dark tokens in globals.css (CSS variables are unavailable in ImageResponse).
 */
export function renderOgImage({
  title,
  subtitle,
  titleSize = 84,
}: {
  title: string;
  subtitle: string;
  titleSize?: number;
}) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 96,
        background: "#11151C",
        color: "#E8EDF0",
        fontFamily: "monospace",
      }}
    >
      <div style={{ display: "flex", fontSize: 40, color: "#A3E6A0" }}>
        {`${siteConfig.wordmark}_`}
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 32,
          fontSize: titleSize,
          fontWeight: 700,
          fontFamily: "sans-serif",
          lineHeight: 1.1,
        }}
      >
        {title}
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 24,
          fontSize: 36,
          color: "#A3AFBD",
        }}
      >
        {subtitle}
      </div>
    </div>,
    ogSize,
  );
}
