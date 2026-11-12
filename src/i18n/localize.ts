import { locales, type Locale } from "./locales";

/** A content text in every supported language. */
export type Localized = Readonly<Record<Locale, string>>;

/** `T` with every `Localized` text replaced by a plain string. */
export type Resolved<T> = T extends Localized
  ? string
  : T extends readonly (infer Item)[]
    ? readonly Resolved<Item>[]
    : T extends object
      ? { [K in keyof T]: Resolved<T[K]> }
      : T;

function isLocalized(value: object): value is Localized {
  const keys = Object.keys(value);
  return (
    keys.length === locales.length &&
    locales.every((locale) => typeof (value as Localized)[locale] === "string")
  );
}

/** Content data in one language: every `Localized` text, at any depth, becomes its `locale` string. */
export function localize<T>(value: T, locale: Locale): Resolved<T> {
  return resolve(value, locale) as Resolved<T>;
}

function resolve(value: unknown, locale: Locale): unknown {
  if (Array.isArray(value)) return value.map((item) => resolve(item, locale));
  if (value === null || typeof value !== "object") return value;
  if (isLocalized(value)) return value[locale];
  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [key, resolve(item, locale)]),
  );
}
