import type { Locale } from "../locales";
import { en, type Messages } from "./en";

export type { Messages };

const messages: Record<Locale, Messages> = { en };

/** UI strings for `locale`. Client components use `useMessages()` instead. */
export function getMessages(locale: Locale): Messages {
  return messages[locale];
}
