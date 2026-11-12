import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LocaleProvider } from "@/i18n/locale-context";
import type { Locale } from "@/i18n/locales";
import { LanguageSwitch } from "./language-switch";

const navigation = vi.hoisted(() => ({ pathname: "/" }));
vi.mock("next/navigation", () => ({ usePathname: () => navigation.pathname }));

function renderIn(locale: Locale, pathname: string) {
  navigation.pathname = pathname;
  render(
    <LocaleProvider locale={locale}>
      <LanguageSwitch />
    </LocaleProvider>,
  );
}

describe("LanguageSwitch", () => {
  it.each([
    ["/en", "/pt-br"],
    ["/en/lab/pipeline", "/pt-br/lab/pipeline"],
    ["/projects/tcc-engsoftware", "/pt-br/projects/tcc-engsoftware"],
  ])("links %s to the same page in Portuguese", (pathname, href) => {
    renderIn("en", pathname);

    const link = screen.getByRole("link", { name: "PT — Ver em português" });
    expect(link).toHaveAttribute("href", href);
    expect(link).toHaveAttribute("hreflang", "pt-BR");
    expect(link).toHaveAttribute("lang", "pt-BR");
    expect(link).toHaveTextContent("PT");
  });

  it.each([
    ["/pt-br", "/"],
    ["/pt-br/projects", "/projects"],
  ])("links %s to the same page in English", (pathname, href) => {
    renderIn("pt-br", pathname);

    const link = screen.getByRole("link", { name: "EN — View in English" });
    expect(link).toHaveAttribute("href", href);
    expect(link).toHaveAttribute("hreflang", "en");
    expect(link).toHaveTextContent("EN");
  });
});
