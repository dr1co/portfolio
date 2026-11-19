import { lang } from "next/root-params";
import { toLocale, type Locale } from "./locales";

/** The locale of the page being rendered, from the `[lang]` root segment. Server Components only (not metadata image routes). */
export async function getLocale(): Promise<Locale> {
  return toLocale(await lang());
}
