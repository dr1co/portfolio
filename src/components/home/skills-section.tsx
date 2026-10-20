import { Sprout } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/ui/section";
import { skillGroups, type SkillGroup } from "@/content/skills";
import { cn } from "@/lib/cn";

/** Skills grouped by practical domain; learning areas are labelled in text, never implied. */
export function SkillsSection({
  groups = skillGroups,
}: {
  groups?: readonly SkillGroup[];
}) {
  return (
    <Section id="skills" eyebrow="// skills" title="Skills by domain">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <article
            key={group.id}
            className={cn(
              "rounded-lg border bg-surface p-6",
              group.learning
                ? "border-dashed border-muted/60"
                : "border-border",
            )}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-semibold">{group.title}</h3>
              {group.learning && (
                <Badge icon={Sprout}>Currently learning</Badge>
              )}
            </div>
            {group.learning && (
              <p className="mt-2 text-sm text-muted">
                Active learning areas — not yet used in a substantive project.
              </p>
            )}
            <ul className="mt-4 flex flex-col gap-2 font-mono text-sm">
              {group.skills.map((skill) => (
                <li key={skill.name} className="flex items-center gap-2">
                  {skill.name}
                  {skill.learning && !group.learning && (
                    <Badge icon={Sprout}>learning</Badge>
                  )}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </Section>
  );
}
