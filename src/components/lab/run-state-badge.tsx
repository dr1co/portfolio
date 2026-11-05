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
import { cn } from "@/lib/cn";

const STATES: Record<
  RunState,
  {
    label: string;
    icon: LucideIcon;
    tone: "neutral" | "info" | "accent" | "error";
  }
> = {
  pending: { label: "Pending", icon: Clock, tone: "neutral" },
  running: { label: "Running", icon: LoaderCircle, tone: "info" },
  passed: { label: "Passed", icon: CircleCheck, tone: "accent" },
  failed: { label: "Failed", icon: CircleX, tone: "error" },
  skipped: { label: "Skipped", icon: CircleSlash, tone: "neutral" },
};

/** Pipeline run state as icon + text. The running icon spins only when motion is allowed. */
export function RunStateBadge({
  state,
  className,
}: {
  state: RunState;
  className?: string;
}) {
  const { label, icon, tone } = STATES[state];
  return (
    <Badge
      icon={icon}
      tone={tone}
      className={cn(
        state === "running" && "[&>svg]:motion-safe:animate-spin",
        className,
      )}
    >
      {label}
    </Badge>
  );
}
