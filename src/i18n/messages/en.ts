import type { FinalState } from "@/lib/pipeline-run";
import type { PipelineEvent, RunState } from "@/content/lab-pipeline";

const finished: Record<FinalState, string> = {
  passed: "passed",
  failed: "failed",
  skipped: "skipped",
};

/** UI strings in English. Every other locale must provide the same shape. */
export const en = {
  layout: {
    skipLink: "Skip to content",
    home: (wordmark: string) => `${wordmark} — home`,
    mainNav: "Main",
    mobileNav: "Mobile",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    contact: "Contact",
    githubProfile: "GitHub profile (opens in a new tab)",
    newTab: "(opens in a new tab)",
    toggleTheme: "Toggle theme",
    switchTheme: {
      light: "Switch to light theme",
      dark: "Switch to dark theme",
    },
    builtWith: "Built with Next.js, TypeScript and Tailwind CSS",
    source: "Source",
    version: (commit: string) => `Version ${commit}`,
  },
  /** The link to this page in the other language, written in that language. */
  languageSwitch: { label: "Ver em português", short: "PT" },
  contactLabels: { github: "GitHub", linkedin: "LinkedIn", email: "Email" },
  copy: {
    command: "Copy command",
    code: "Copy code",
    copied: "Copied",
  },
  notFound: {
    title: "Page not found",
    body: "This route doesn't exist, or it hasn't shipped yet.",
    caption: "Illustrative terminal output for a missing page.",
    back: "Back to home",
  },
  badges: { example: "Example", simulated: "Simulated", live: "Live" },
  hero: {
    technologies: "Core technologies",
    caption: "Example terminal output, not a live system.",
    exploreProjects: "Explore Projects",
    openGithub: "Open GitHub",
    seePipeline: "See the pipeline",
    getInTouch: "Get in touch",
  },
  featured: {
    eyebrow: "// projects",
    title: "Featured projects",
    viewAll: "View all projects",
  },
  pipeline: {
    eyebrow: "// pipeline",
    title: "How my code reaches production",
    description:
      "Select a stage to see what it does. This is an illustrative walkthrough, so feel free since you won't trigger a real pipeline.",
    labLink: "Explore the real pipeline in the Lab",
    stages: "Delivery pipeline stages",
    workflowExcerpt: "Workflow excerpt",
  },
  skills: {
    eyebrow: "// skills",
    title: "Skills by domain",
    learning: "Currently learning",
    learningNote: "Active learning areas.",
    lessThanAYear: "Less than a year",
    years: (years: number) => `${years}+ ${years === 1 ? "year" : "years"}`,
  },
  contact: {
    eyebrow: "// contact",
    title: "Get in touch",
    description: "Reach out through any of these channels.",
  },
  projects: {
    eyebrow: "// projects",
    title: "Projects",
    status: { available: "Available", "in-progress": "In progress" },
    technologies: "Technologies",
    caseStudy: "Case study",
    source: "Source",
    liveDemo: "Live demo",
    allProjects: "All projects",
    loading: "Loading case study…",
    onThisPage: "On this page",
    updated: "Updated",
  },
  mdx: {
    callout: { note: "Note", warning: "Warning", simulated: "Simulated" },
    table: "Table",
    scrollable: (title: string) => `${title} (scrollable)`,
    described: (title: string) => `${title}, described`,
  },
  lab: {
    eyebrow: "// lab",
    title: "Lab",
    objective: "Objective:",
    prerequisites: "Prerequisites:",
    concepts: "Concepts",
    openDemo: "Open the demo",
    source: "Source",
  },
  explorer: {
    back: "Back to the Lab",
    realRuns: "See real runs on GitHub",
    heading: "Explore a run",
    scenario: "Scenario",
    run: "Run",
    pause: "Pause",
    resume: "Resume",
    reset: "Reset",
    idle: "Press Run to replay this scenario step by step.",
    paused: "Paused.",
    jobs: "Workflow jobs",
    previous: "Previous",
    previousJob: "Previous job",
    next: "Next",
    nextJob: "Next job",
    event: (name: string) => `event: ${name}`,
    needs: (jobs: readonly string[]) =>
      `needs: ${jobs.length > 0 ? jobs.join(", ") : "nothing"}`,
    simulatedOutcome: "Simulated outcome:",
    notDecided: "not decided yet.",
    needsLabel: "Needs:",
    nothing: "nothing",
    runsOn: "Runs on:",
    steps: "Steps",
    thisScenario: "This scenario:",
    workflowExcerpt: "Workflow excerpt",
    viewWorkflow: "View ci.yml on GitHub",
    outcomes: "Outcomes by scenario",
    outcomesCaption: "Simulated outcome of each job in each scenario",
    job: "Job",
  },
  run: {
    states: {
      pending: "Pending",
      running: "Running",
      passed: "Passed",
      failed: "Failed",
      skipped: "Skipped",
    } satisfies Record<RunState, string>,
    /** How each event reads in a sentence, e.g. "Runs only on pull requests." */
    eventLabels: {
      "push-main": "pushes to main",
      "pull-request": "pull requests",
    } satisfies Record<PipelineEvent, string>,
    /** A single occurrence of each event, e.g. "event: push to main". */
    eventNames: {
      "push-main": "push to main",
      "pull-request": "pull request",
    } satisfies Record<PipelineEvent, string>,
    and: " and ",
    runsOnlyOn: (events: string) => `Runs only on ${events}.`,
    blocked: (job: string, failed: boolean) =>
      `Needs ${job}, which ${failed ? "failed" : "was skipped"}.`,
    passed: "Every step passed.",
    started: "Run started. Every job is pending.",
    running: (jobs: readonly string[]) => `Running: ${jobs.join(", ")}.`,
    finishedJob: (job: string, state: FinalState) =>
      `${job} ${finished[state]}.`,
    summary: (counts: readonly [FinalState, number][]) =>
      `Run finished: ${counts.map(([state, count]) => `${count} ${finished[state]}`).join(", ")}.`,
  },
  og: { caseStudy: "Case study", caseStudyAlt: "Project case study" },
};

export type Messages = typeof en;
