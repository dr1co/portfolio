import { cn } from "@/lib/cn";
import { AppLink, type AppLinkProps } from "./app-link";

const VARIANTS = {
  primary: "bg-accent text-accent-foreground hover:opacity-90",
  secondary:
    "border border-border bg-surface text-foreground hover:bg-surface-elevated",
};

/** Call-to-action link styled as a button. */
export function ButtonLink({
  variant = "primary",
  className,
  ...props
}: AppLinkProps & { variant?: keyof typeof VARIANTS }) {
  return (
    <AppLink
      {...props}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 text-sm font-medium transition",
        VARIANTS[variant],
        className,
      )}
    />
  );
}
