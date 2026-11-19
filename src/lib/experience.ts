import type { Locale } from "@/i18n/locales";
import { getMessages } from "@/i18n/messages";

/** Human-readable experience from a start year, e.g. "4+ years". */
export function experienceLabel(
  since: number,
  year: number,
  locale: Locale,
): string {
  const t = getMessages(locale).skills;
  const years = year - since;
  return years < 1 ? t.lessThanAYear : t.years(years);
}
