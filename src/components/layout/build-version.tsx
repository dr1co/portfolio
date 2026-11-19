import { AppLink } from "@/components/ui/app-link";
import type { Locale } from "@/i18n/locales";
import { getMessages } from "@/i18n/messages";
import type { BuildInfo } from "@/lib/build-info";

/** "Version abc1234", linked to the commit on GitHub when the URL is known. */
export function BuildVersion({
  info,
  locale,
}: {
  info: BuildInfo;
  locale: Locale;
}) {
  const label = getMessages(locale).layout.version(info.short);
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
