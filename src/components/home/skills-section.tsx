import { Sprout } from "lucide-react";
import type { CSSProperties } from "react";
import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/ui/section";
import { Tooltip } from "@/components/ui/tooltip";
import { getSkillGroups, type Skill, type SkillGroup } from "@/content/skills";
import { techName } from "@/content/technologies";
import type { Locale } from "@/i18n/locales";
import { getMessages } from "@/i18n/messages";
import { cn } from "@/lib/cn";
import { currentYear } from "@/lib/current-year";
import { experienceLabel } from "@/lib/experience";
import { techIcon } from "@/lib/tech-icons";

/** Skills grouped by practical domain, as logo tiles whose details show on hover, focus or tap. */
export async function SkillsSection({ locale }: { locale: Locale }) {
  const year = await currentYear();
  const t = getMessages(locale).skills;
  return (
    <Section id="skills" eyebrow={t.eyebrow} title={t.title}>
      <SkillGrid groups={getSkillGroups(locale)} year={year} locale={locale} />
    </Section>
  );
}

/** One card per group; learning areas are labelled in text, never implied. */
export function SkillGrid({
  groups,
  year,
  locale,
}: {
  groups: readonly SkillGroup[];
  year: number;
  locale: Locale;
}) {
  const t = getMessages(locale).skills;
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {groups.map((group) => (
        <article
          key={group.id}
          className={cn(
            "rounded-lg border bg-surface p-6",
            group.learning ? "border-dashed border-muted/60" : "border-border",
          )}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-semibold">{group.title}</h3>
            {group.learning && <Badge icon={Sprout}>{t.learning}</Badge>}
          </div>
          {group.learning && (
            <p className="mt-2 text-sm text-muted">{t.learningNote}</p>
          )}
          <ul className="relative mt-4 flex flex-wrap gap-3">
            {group.skills.map((skill) => (
              <li key={skill.tech}>
                <SkillTile
                  skill={skill}
                  learning={group.learning}
                  year={year}
                  locale={locale}
                />
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}

function SkillTile({
  skill,
  learning,
  year,
  locale,
}: {
  skill: Skill;
  learning?: boolean;
  year: number;
  locale: Locale;
}) {
  const name = techName(skill.tech);
  const icon = techIcon(skill.tech);

  return (
    <Tooltip
      label={name}
      className={cn(
        "flex size-12 items-center justify-center rounded-lg border bg-surface-elevated transition hover:border-accent/50 motion-safe:hover:-translate-y-0.5",
        learning ? "border-dashed border-muted/60" : "border-border",
      )}
      content={
        <>
          <span aria-hidden className="block font-semibold">
            {name}
          </span>
          <span className="block text-muted">
            {learning || skill.since === undefined
              ? getMessages(locale).skills.learning
              : experienceLabel(skill.since, year, locale)}
          </span>
          {skill.note && <span className="block">{skill.note}</span>}
        </>
      }
    >
      {icon ? (
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className="size-6 fill-current text-[color:var(--brand-light,var(--foreground))] dark:text-[color:var(--brand-dark,var(--foreground))]"
          style={
            {
              "--brand-light": icon.light,
              "--brand-dark": icon.dark,
            } as CSSProperties
          }
        >
          <path d={icon.path} />
        </svg>
      ) : (
        <span aria-hidden className="font-mono text-xs font-semibold">
          {name}
        </span>
      )}
    </Tooltip>
  );
}
