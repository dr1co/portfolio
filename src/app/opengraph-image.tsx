import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";

export const alt = `${siteConfig.name} — ${siteConfig.descriptor}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Social preview. Hex values mirror the dark tokens in globals.css (CSS variables are unavailable here). */
export default function OpenGraphImage() {
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
      <div
        style={{ display: "flex", fontSize: 40, color: "#A3E6A0" }}
      >{`${siteConfig.wordmark}_`}</div>
      <div
        style={{
          display: "flex",
          marginTop: 32,
          fontSize: 84,
          fontWeight: 700,
          fontFamily: "sans-serif",
        }}
      >
        {siteConfig.headline}
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 24,
          fontSize: 36,
          color: "#A3AFBD",
        }}
      >
        {`${siteConfig.name} · ${siteConfig.descriptor}`}
      </div>
    </div>,
    size,
  );
}
