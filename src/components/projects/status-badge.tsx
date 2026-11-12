import { CheckCircle2, Clock, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ProjectStatus } from "@/content/projects";
import type { Locale } from "@/i18n/locales";
import { getMessages } from "@/i18n/messages";

const STATUS: Record<
  Exclude<ProjectStatus, "planned">,
  { icon: LucideIcon; tone: "accent" | "info" }
> = {
  available: { icon: CheckCircle2, tone: "accent" },
  "in-progress": { icon: Clock, tone: "info" },
};

/** Project status as icon + text. Planned projects are never published, so they render nothing. */
export function StatusBadge({
  status,
  locale,
}: {
  status: ProjectStatus;
  locale: Locale;
}) {
  if (status === "planned") return null;
  const { icon, tone } = STATUS[status];
  return (
    <Badge icon={icon} tone={tone} className="shrink-0">
      {getMessages(locale).projects.status[status]}
    </Badge>
  );
}
