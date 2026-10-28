/** Canonical technology ids → display names. Projects and skills reference ids, so spelling stays consistent. */
export const technologies = {
  aws: "AWS",
  bash: "Bash",
  "dev-containers": "Dev Containers",
  django: "Django",
  docker: "Docker",
  express: "Express",
  "docker-compose": "Docker Compose",
  flask: "Flask",
  git: "Git",
  "github-actions": "GitHub Actions",
  "github-packages": "GitHub Packages",
  keras: "Keras",
  kubernetes: "Kubernetes",
  linux: "Linux",
  metatrader5: "MetaTrader 5",
  mongodb: "MongoDB",
  nodejs: "Node.js",
  postgresql: "PostgreSQL",
  python: "Python",
  pytorch: "PyTorch",
  redis: "Redis",
  tailwind: "Tailwind CSS",
  tensorflow: "TensorFlow",
  terraform: "Terraform",
} as const satisfies Record<string, string>;

export type TechnologyId = keyof typeof technologies;

/** Display name for a technology id. */
export function techName(id: TechnologyId): string {
  return technologies[id];
}
