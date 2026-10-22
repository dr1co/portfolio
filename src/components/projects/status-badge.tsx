import { CheckCircle2, Clock, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ProjectStatus } from "@/content/projects";

const STATUS: Record<
  Exclude<ProjectStatus, "planned">,
  { label: string; icon: LucideIcon; tone: "accent" | "info" }
> = {
  available: { label: "Available", icon: CheckCircle2, tone: "accent" },
  "in-progress": { label: "In progress", icon: Clock, tone: "info" },
};

/** Project status as icon + text. Planned projects are never published, so they render nothing. */
export function StatusBadge({ status }: { status: ProjectStatus }) {
  if (status === "planned") return null;
  const { label, icon, tone } = STATUS[status];
  return (
    <Badge icon={icon} tone={tone} className="shrink-0">
      {label}
    </Badge>
  );
}
