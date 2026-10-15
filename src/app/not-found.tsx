import { TerminalPanel } from "@/components/terminal/terminal-panel";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <Container className="flex max-w-2xl flex-col gap-8 py-20 md:py-28">
      <div>
        <p className="font-mono text-sm text-accent">{"// 404"}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
          Page not found
        </h1>
        <p className="mt-3 text-muted">
          This route doesn&apos;t exist, or it hasn&apos;t shipped yet.
        </p>
      </div>
      <TerminalPanel
        title="404 / not-found"
        lines={["$ cd requested-page", "cd: no such route"]}
        caption="Illustrative terminal output for a missing page."
      />
      <div>
        <ButtonLink href="/">Back to home</ButtonLink>
      </div>
    </Container>
  );
}
