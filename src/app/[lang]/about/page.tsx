import type { Metadata } from "next";
import { AboutPipeline } from "@/components/about/about-pipeline";
import { AboutTopic } from "@/components/about/about-topic";
import { ResumeLink } from "@/components/about/resume-link";
import { ContactSection } from "@/components/home/contact-section";
import { AppLink } from "@/components/ui/app-link";
import { Container } from "@/components/ui/container";
import { getAbout } from "@/content/about";
import { techName } from "@/content/technologies";
import { getMessages } from "@/i18n/messages";
import { getLocale } from "@/i18n/server";
import { age } from "@/lib/age";
import { canonicalFor } from "@/lib/canonical";
import { getSiteConfig } from "@/lib/site-config";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: getMessages(locale).about.title,
    description: getAbout(locale).lead,
    alternates: canonicalFor("/about", locale),
  };
}

const linkClass = "font-medium text-accent hover:underline";

export default async function AboutPage() {
  const locale = await getLocale();
  const t = getMessages(locale).about;
  const about = getAbout(locale);
  const { nickname, location, birthMonth } = getSiteConfig(locale);
  const years = await age(birthMonth);

  return (
    <>
      <Container className="py-16 md:py-20">
        <p className="font-mono text-sm text-accent">{t.eyebrow}</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
          {t.title}
        </h1>
        <p className="mt-4 max-w-prose text-lg text-muted">{about.lead}</p>
        <div className="mt-10">
          <AboutPipeline locale={locale} age={years} />
        </div>

        <div className="mt-16 flex max-w-3xl flex-col gap-16">
          <AboutTopic id="whoami" title={t.sections.whoami}>
            <p className="font-mono text-sm text-muted">
              {t.identity(nickname, years, location)}
            </p>
            {about.story.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </AboutTopic>

          <AboutTopic id="experience" title={t.sections.experience}>
            <div>
              <h3 className="text-xl font-semibold">
                {about.experience.title}
              </h3>
              <p className="text-muted">
                {about.experience.company} · {about.experience.period}
              </p>
            </div>
            <p>{about.experience.context}</p>
            <ul className="flex list-disc flex-col gap-2 pl-5">
              {about.experience.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </AboutTopic>

          <AboutTopic id="education" title={t.sections.education}>
            <ul className="flex flex-col gap-6">
              {about.education.map((item) => (
                <li key={item.degree}>
                  <h3 className="text-xl font-semibold">{item.degree}</h3>
                  <p className="text-muted">
                    {item.institution} · {item.period}
                  </p>
                  {item.note && <p className="mt-2">{item.note}</p>}
                  {item.href && (
                    <AppLink
                      href={item.href}
                      className={`mt-2 inline-block ${linkClass}`}
                    >
                      {t.thesisLink}
                    </AppLink>
                  )}
                </li>
              ))}
            </ul>
          </AboutTopic>

          <AboutTopic id="learning" title={t.sections.learning}>
            <ol className="flex flex-col gap-3">
              {about.learning.map((item, index) => (
                <li key={item.tech} className="flex gap-3">
                  <span aria-hidden className="font-mono text-sm text-muted">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p>
                    <span className="font-medium">{techName(item.tech)}</span>
                    <span className="text-muted">: {item.note}</span>
                  </p>
                </li>
              ))}
            </ol>
          </AboutTopic>

          <AboutTopic id="how-i-work" title={t.sections["how-i-work"]}>
            <ul className="flex flex-col gap-6">
              {about.principles.map((principle) => (
                <li key={principle.title}>
                  <h3 className="text-xl font-semibold">{principle.title}</h3>
                  <p className="mt-1 text-muted">{principle.body}</p>
                </li>
              ))}
            </ul>
          </AboutTopic>

          <AboutTopic id="achievements" title={t.sections.achievements}>
            <ul className="flex flex-col gap-3">
              {about.achievements.map((achievement) => (
                <li key={achievement.title} className="flex gap-4">
                  <span className="w-12 shrink-0 font-mono text-sm text-muted">
                    {achievement.year}
                  </span>
                  <span>{achievement.title}</span>
                </li>
              ))}
            </ul>
          </AboutTopic>

          <AboutTopic id="beyond-code" title={t.sections["beyond-code"]}>
            <h3 className="text-xl font-semibold">{t.languages}</h3>
            <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1">
              {about.languages.map((language) => (
                <div key={language.name} className="contents">
                  <dt className="font-medium">{language.name}</dt>
                  <dd className="text-muted">{language.level}</dd>
                </div>
              ))}
            </dl>
            {about.facts.map((fact) => (
              <p key={fact.body}>
                {fact.body}{" "}
                {fact.link && (
                  <AppLink href={fact.link.href} external className={linkClass}>
                    {fact.link.label}
                  </AppLink>
                )}
              </p>
            ))}
          </AboutTopic>

          <ResumeLink locale={locale} />
        </div>
      </Container>
      <ContactSection locale={locale} />
    </>
  );
}
