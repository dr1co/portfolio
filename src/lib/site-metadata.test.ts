import { describe, expect, it } from "vitest";
import { siteMetadata } from "./site-metadata";

describe("siteMetadata", () => {
  it("describes the site in the page's language, naming the other language as an alternate", () => {
    expect(siteMetadata("en").openGraph).toMatchObject({
      locale: "en_US",
      alternateLocale: ["pt_BR"],
      title: "Adriano Matoba Lipski — DevOps & Automation",
    });
    expect(siteMetadata("pt-br").openGraph).toMatchObject({
      locale: "pt_BR",
      alternateLocale: ["en_US"],
      title: "Adriano Matoba Lipski — DevOps & Automação",
    });
  });
});
