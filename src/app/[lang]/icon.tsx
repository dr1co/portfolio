import { ImageResponse } from "next/og";
import { locales } from "@/i18n/locales";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

/** `>_` favicon. Hex values mirror the dark tokens in globals.css. */
export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 6,
        background: "#11151C",
        color: "#A3E6A0",
        fontSize: 18,
        fontWeight: 700,
        fontFamily: "monospace",
      }}
    >
      {">_"}
    </div>,
    size,
  );
}
