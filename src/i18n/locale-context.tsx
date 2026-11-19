"use client";

import { createContext, useContext, type ReactNode } from "react";
import { defaultLocale, type Locale } from "./locales";
import { getMessages, type Messages } from "./messages";

const LocaleContext = createContext<Locale>(defaultLocale);

/** Makes the page's locale available to client components. */
export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  return <LocaleContext value={locale}>{children}</LocaleContext>;
}

/** The page's locale in a client component (the default locale outside a provider). */
export function useLocale(): Locale {
  return useContext(LocaleContext);
}

/** UI strings for the page's locale in a client component. */
export function useMessages(): Messages {
  return getMessages(useLocale());
}
