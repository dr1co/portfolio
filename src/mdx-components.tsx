import type { MDXComponents } from "mdx/types";
import type { ComponentProps } from "react";
import { Callout } from "@/components/mdx/callout";
import { CodeBlock } from "@/components/mdx/code-block";
import { Diagram } from "@/components/mdx/diagram";
import { Figure } from "@/components/mdx/figure";
import { AppLink } from "@/components/ui/app-link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { defaultLocale, type Locale } from "@/i18n/locales";
import { getMessages } from "@/i18n/messages";
import { cn } from "@/lib/cn";

/** Element → component mapping for MDX case studies, with labels in `locale`. Pass it as `<Body components={...} />`. */
export function getMdxComponents(locale: Locale): MDXComponents {
  return {
    h2: (props) => (
      <h2
        {...props}
        className="mt-12 mb-4 text-2xl font-semibold tracking-tight"
      />
    ),
    h3: (props) => (
      <h3 {...props} className="mt-8 mb-3 text-xl font-semibold" />
    ),
    p: (props) => <p {...props} className="my-4 leading-relaxed" />,
    ul: (props) => (
      <ul
        {...props}
        className="my-4 list-disc space-y-2 pl-6 marker:text-muted"
      />
    ),
    ol: (props) => (
      <ol
        {...props}
        className="my-4 list-decimal space-y-2 pl-6 marker:text-muted"
      />
    ),
    blockquote: (props) => (
      <blockquote
        {...props}
        className="my-6 border-l-2 border-border pl-4 text-muted"
      />
    ),
    hr: () => <hr className="my-10 border-border" />,
    a: ({ href = "", children }: ComponentProps<"a">) => (
      <AppLink
        href={href}
        external={href.startsWith("http")}
        className="text-accent underline underline-offset-4 hover:no-underline"
      >
        {children}
      </AppLink>
    ),
    code: ({ className, ...props }: ComponentProps<"code">) => (
      <code
        {...props}
        className={cn(
          className,
          !className &&
            "rounded bg-surface-elevated px-1.5 py-0.5 font-mono text-[0.9em]",
        )}
      />
    ),
    pre: CodeBlock,
    table: (props) => (
      <ScrollArea label={getMessages(locale).mdx.table} className="my-6">
        <table
          {...props}
          className="w-full min-w-[36rem] border-collapse text-left text-sm"
        />
      </ScrollArea>
    ),
    th: (props) => (
      <th
        {...props}
        className="border-b border-border px-3 py-2 font-semibold"
      />
    ),
    td: (props) => (
      <td {...props} className="border-b border-border px-3 py-2 align-top" />
    ),
    Callout: (props: Omit<ComponentProps<typeof Callout>, "locale">) => (
      <Callout {...props} locale={locale} />
    ),
    Diagram: (props: Omit<ComponentProps<typeof Diagram>, "locale">) => (
      <Diagram {...props} locale={locale} />
    ),
    Figure,
  };
}

/** Global mapping required by `@next/mdx`, in the default locale; case-study pages override it per locale. */
export function useMDXComponents(): MDXComponents {
  return getMdxComponents(defaultLocale);
}
