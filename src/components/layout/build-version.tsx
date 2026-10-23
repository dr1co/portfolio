import { AppLink } from "@/components/ui/app-link";
import type { BuildInfo } from "@/lib/build-info";

/** "Version abc1234", linked to the commit on GitHub when the URL is known. */
export function BuildVersion({ info }: { info: BuildInfo }) {
  const label = `Version ${info.short}`;
  if (!info.url) return <span>{label}</span>;

  return (
    <AppLink
      href={info.url}
      external
      externalIcon={false}
      className="font-mono hover:text-foreground"
    >
      {label}
    </AppLink>
  );
}
