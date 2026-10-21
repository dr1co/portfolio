import { ogSize, renderOgImage } from "@/lib/og-image";
import { siteConfig } from "@/lib/site-config";

export const alt = `${siteConfig.name} — ${siteConfig.descriptor}`;
export const size = ogSize;
export const contentType = "image/png";

export default function OpenGraphImage() {
  return renderOgImage({
    title: siteConfig.headline,
    subtitle: `${siteConfig.name} · ${siteConfig.descriptor}`,
  });
}
