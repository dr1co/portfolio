import {
  CircleCheck,
  CircleSlash,
  CircleX,
  Clock,
  LoaderCircle,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { RunState } from "@/content/lab-pipeline";
import type { Locale } from "@/i18n/locales";
import { getMessages } from "@/i18n/messages";
import { cn } from "@/lib/cn";

const STATES: Record<
  RunState,
  {
    icon: LucideIcon;
    tone: "neutral" | "info" | "accent" | "error";
  }
> = {
  pending: { icon: Clock, tone: "neutral" },
  running: { icon: LoaderCircle, tone: "info" },
  passed: { icon: CircleCheck, tone: "accent" },
  failed: { icon: CircleX, tone: "error" },
  skipped: { icon: CircleSlash, tone: "neutral" },
};

/**
 * Pipeline run state as icon + text. The running icon spins only when motion is allowed,
 * and never with `spin={false}` (for states that last long, where spinning would be endless decoration).
 */
export function RunStateBadge({
  state,
  locale,
  spin = true,
  className,
}: {
  state: RunState;
  locale: Locale;
  spin?: boolean;
  className?: string;
}) {
  const { icon, tone } = STATES[state];
  return (
    <Badge
      icon={icon}
      tone={tone}
      className={cn(
        spin && state === "running" && "[&>svg]:motion-safe:animate-spin",
        className,
      )}
    >
      {getMessages(locale).run.states[state]}
    </Badge>
  );
}
