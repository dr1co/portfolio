import { TerminalPanel } from "@/components/terminal/terminal-panel";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import type { Locale } from "@/i18n/locales";
import { getMessages } from "@/i18n/messages";

/** Body of the 404 page, shared by `notFound()` inside a route and the global page for unmatched URLs. */
export function NotFoundView({ locale }: { locale: Locale }) {
  const t = getMessages(locale).notFound;
  return (
    <Container className="flex max-w-2xl flex-col gap-8 py-20 md:py-28">
      <div>
        <p className="font-mono text-sm text-accent">{"// 404"}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
          {t.title}
        </h1>
        <p className="mt-3 text-muted">{t.body}</p>
      </div>
      <TerminalPanel
        title="404 / not-found"
        lines={["$ cd requested-page", "cd: no such route"]}
        caption={t.caption}
      />
      <div>
        <ButtonLink href="/">{t.back}</ButtonLink>
      </div>
    </Container>
  );
}
