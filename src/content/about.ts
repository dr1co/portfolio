import { localize, type Localized, type Resolved } from "@/i18n/localize";
import type { Locale } from "@/i18n/locales";
import type { RunState } from "./lab-pipeline";
import type { TechnologyId } from "./technologies";

type AboutJobEntry = {
  id: "whoami" | "experience" | "education" | "learning";
  /** Must be true today: passed is done, running is ongoing, pending hasn't started. */
  state: RunState;
  /** Short lines shown on the job strip. */
  summary: readonly Localized[];
};

type AboutEntry = {
  lead: Localized;
  jobs: readonly AboutJobEntry[];
  story: readonly Localized[];
  experience: {
    company: string;
    context: Localized;
    title: Localized;
    period: Localized;
    highlights: readonly Localized[];
  };
  education: readonly {
    institution: Localized;
    degree: Localized;
    period: Localized;
    note?: Localized;
    href?: `/projects/${string}`;
  }[];
  /** Same technologies and order as the skills section's learning group. */
  learning: readonly { tech: TechnologyId; note: Localized }[];
  principles: readonly { title: Localized; body: Localized }[];
  achievements: readonly { year: number; title: Localized }[];
  languages: readonly { name: Localized; level: Localized }[];
  facts: readonly { body: Localized; href?: string }[];
};

export type About = Resolved<AboutEntry>;
export type AboutJob = About["jobs"][number];

// TODO(content): drafted from the owner's career master document and GitHub README. Review every field, in both languages.
export const about: AboutEntry = {
  lead: {
    en: "I'm a software engineer who likes owning the whole path from code to production. Today I build internal platforms and automation at a transport company, and I'm moving deeper into DevOps.",
    "pt-br":
      "Sou engenheiro de software e gosto de cuidar de todo o caminho do código até a produção. Hoje construo plataformas internas e automações em uma empresa de transporte, e estou me aprofundando em DevOps.",
  },
  jobs: [
    {
      id: "whoami",
      state: "passed",
      summary: [
        {
          en: "Software engineer moving into DevOps.",
          "pt-br": "Engenheiro de software migrando para DevOps.",
        },
        {
          en: "Open to remote work, including international roles.",
          "pt-br": "Aberto a trabalho remoto, inclusive internacional.",
        },
      ],
    },
    {
      id: "experience",
      state: "running",
      summary: [
        {
          en: "Systems Analyst at Princesa dos Campos since March 2025.",
          "pt-br":
            "Analista de Sistemas na Princesa dos Campos desde março de 2025.",
        },
        {
          en: "Django platform, central SSO, Airflow integrations and CI/CD.",
          "pt-br":
            "Plataforma em Django, SSO central, integrações com Airflow e CI/CD.",
        },
      ],
    },
    {
      id: "education",
      state: "running",
      summary: [
        {
          en: "B.Sc. in Software Engineering at UEPG, finishing in December 2026.",
          "pt-br":
            "Bacharelado em Engenharia de Software na UEPG, com conclusão em dezembro de 2026.",
        },
        {
          en: "Started with a 1,200-hour full-stack bootcamp.",
          "pt-br": "Comecei com um bootcamp full-stack de 1.200 horas.",
        },
      ],
    },
    {
      id: "learning",
      state: "pending",
      summary: [
        {
          en: "Next up: infrastructure as code with Terraform.",
          "pt-br": "Próximo passo: infraestrutura como código com Terraform.",
        },
        {
          en: "Then cloud, Kubernetes and observability.",
          "pt-br": "Depois, nuvem, Kubernetes e observabilidade.",
        },
      ],
    },
  ],
  story: [
    {
      en: "My first contact with programming was C++ in 2019, during my first semester of Chemical Engineering at UFPR (Federal University of Paraná). It was one of my favorite subjects that semester, but I kept going with Chemical Engineering for a while.",
      "pt-br":
        "Meu primeiro contato com programação foi com C++ em 2019, no primeiro semestre de Engenharia Química na UFPR (Universidade Federal do Paraná). Foi uma das matérias de que mais gostei naquele semestre, mas segui na Engenharia Química por mais um tempo.",
    },
    {
      en: "In 2022 I left Chemical Engineering for software. I started with a 1,200-hour online bootcamp, learning the fundamentals with HTML, CSS and JavaScript and building my first React apps. In 2023 I started a second bachelor's degree, in Software Engineering, at UEPG (State University of Ponta Grossa).",
      "pt-br":
        "Em 2022 deixei a Engenharia Química para seguir em software. Comecei com um bootcamp online de 1.200 horas, aprendendo os fundamentos com HTML, CSS e JavaScript e construindo minhas primeiras aplicações em React. Em 2023 comecei um segundo bacharelado, em Engenharia de Software, na UEPG (Universidade Estadual de Ponta Grossa).",
    },
    {
      en: "Hackathons, projects and coding challenges pulled me toward automation and DevOps. What I enjoy most now is the whole flow of a project, from the first file edit to delivering it to the people who use it.",
      "pt-br":
        "Hackathons, projetos e desafios de programação me levaram para automação e DevOps. O que mais gosto hoje é o fluxo completo de um projeto, da primeira edição de arquivo até a entrega para quem vai usar.",
    },
  ],
  experience: {
    company: "Princesa dos Campos",
    context: {
      en: "A road transport company with more than 1,000 employees, serving southern and southeastern Paraná.",
      "pt-br":
        "Empresa de transporte rodoviário com mais de 1.000 funcionários, atendendo o sul e o sudeste do Paraná.",
    },
    title: {
      en: "Systems Analyst (mid-level), automation and web systems",
      "pt-br": "Analista de Sistemas Pleno, automação e sistemas web",
    },
    period: { en: "March 2025 to now", "pt-br": "Março de 2025 até hoje" },
    highlights: [
      {
        en: "Designed the standardized Django template that every internal application is built on.",
        "pt-br":
          "Projetei o template padronizado de Django sobre o qual todas as aplicações internas são construídas.",
      },
      {
        en: "Built the company's central SSO on my own. Ten applications sign in through it, with three more planned, and other teams integrate using the documentation I wrote.",
        "pt-br":
          "Construí sozinho o SSO central da empresa. Dez aplicações fazem login por ele, com mais três planejadas, e outros times se integram usando a documentação que escrevi.",
      },
      {
        en: "Built an internal audit platform used daily by a 10-person team. The department's average SLA compliance time improved by about 30%.",
        "pt-br":
          "Construí uma plataforma interna de auditoria usada diariamente por um time de 10 pessoas. O tempo médio de cumprimento de SLA do departamento melhorou cerca de 30%.",
      },
      {
        en: "Built a charter contract system used across four branches, and cut its average API response time from 5 to 10 seconds to under 2 by indexing the columns it sorts and filters on.",
        "pt-br":
          "Construí um sistema de contratos de fretamento usado em quatro filiais e reduzi o tempo médio de resposta da API de 5 a 10 segundos para menos de 2, indexando as colunas usadas em ordenação e filtros.",
      },
      {
        en: "Wrote Python integrations, orchestrated with Apache Airflow, between the company's CRM, ERP and TMS and a third-party fueling system, replacing manual data entry.",
        "pt-br":
          "Desenvolvi integrações em Python, orquestradas com Apache Airflow, entre o CRM, o ERP e o TMS da empresa e um sistema terceirizado de abastecimento, eliminando a digitação manual de dados.",
      },
      {
        en: "Maintain CI/CD pipelines with GitHub Actions, including self-hosted runners and publishing to GitHub Packages.",
        "pt-br":
          "Mantenho pipelines de CI/CD com GitHub Actions, incluindo runners self-hosted e publicação no GitHub Packages.",
      },
      {
        en: "Deploy services with Docker and Docker Compose and monitor them with Prometheus.",
        "pt-br":
          "Faço o deploy de serviços com Docker e Docker Compose e os monitoro com Prometheus.",
      },
    ],
  },
  education: [
    {
      institution: {
        en: "UEPG, State University of Ponta Grossa",
        "pt-br": "UEPG, Universidade Estadual de Ponta Grossa",
      },
      degree: {
        en: "B.Sc. in Software Engineering",
        "pt-br": "Bacharelado em Engenharia de Software",
      },
      period: {
        en: "2023 to 2026 (expected December)",
        "pt-br": "2023 a 2026 (conclusão prevista em dezembro)",
      },
      note: {
        en: "Thesis defended in October 2026: CNN, LSTM and hybrid models on Brazilian futures, evaluated with backtesting and significance tests.",
        "pt-br":
          "TCC defendido em outubro de 2026: modelos CNN, LSTM e híbridos sobre minicontratos futuros brasileiros, avaliados com backtesting e testes de significância.",
      },
      href: "/projects/tcc-engsoftware",
    },
    {
      institution: { en: "Driven Education", "pt-br": "Driven Education" },
      degree: {
        en: "Full-stack web development bootcamp",
        "pt-br": "Bootcamp de desenvolvimento web full-stack",
      },
      period: {
        en: "March to December 2022",
        "pt-br": "Março a dezembro de 2022",
      },
      note: {
        en: "1,200 hours and more than 25 hands-on projects, working in Agile teams.",
        "pt-br":
          "1.200 horas e mais de 25 projetos práticos, trabalhando em times ágeis.",
      },
    },
  ],
  learning: [
    {
      tech: "terraform",
      note: {
        en: "Infrastructure as code, the first step on my path.",
        "pt-br": "Infraestrutura como código, o primeiro passo do meu caminho.",
      },
    },
    {
      tech: "aws",
      note: {
        en: "Cloud platforms beyond the EC2 and S3 basics I've used.",
        "pt-br": "Plataformas de nuvem além do básico de EC2 e S3 que já usei.",
      },
    },
    {
      tech: "kubernetes",
      note: {
        en: "Container orchestration, after years of Docker Compose.",
        "pt-br":
          "Orquestração de containers, depois de anos de Docker Compose.",
      },
    },
    {
      tech: "grafana",
      note: {
        en: "Observability dashboards on top of the Prometheus metrics I already collect.",
        "pt-br":
          "Dashboards de observabilidade sobre as métricas do Prometheus que já coleto.",
      },
    },
  ],
  principles: [
    {
      title: { en: "Tests first", "pt-br": "Testes primeiro" },
      body: {
        en: "I practice TDD as a habit, not a formality. Writing the test first makes me think through edge cases before they reach production.",
        "pt-br":
          "Pratico TDD como hábito, não como formalidade. Escrever o teste antes me obriga a pensar nos casos de borda antes que cheguem à produção.",
      },
    },
    {
      title: {
        en: "Find the cause before the fix",
        "pt-br": "Encontrar a causa antes da correção",
      },
      body: {
        en: "When an API became unstable, metrics and access logs showed the cause was external: an automation calling it far more than expected. Adding workers stabilized it without restricting the client.",
        "pt-br":
          "Quando uma API ficou instável, as métricas e os logs de acesso mostraram que a causa era externa: uma automação chamando muito mais do que o esperado. Adicionar workers estabilizou o serviço sem restringir o cliente.",
      },
    },
    {
      title: {
        en: "Complexity has to pay for itself",
        "pt-br": "Complexidade precisa se pagar",
      },
      body: {
        en: "Indexing the right columns was enough to fix a slow API, so I left out a cache layer. The system's availability needs didn't justify the extra moving part.",
        "pt-br":
          "Indexar as colunas certas bastou para resolver uma API lenta, então deixei de fora uma camada de cache. As necessidades de disponibilidade do sistema não justificavam mais uma peça.",
      },
    },
    {
      title: {
        en: "Ownership includes the docs",
        "pt-br": "Responsabilidade inclui a documentação",
      },
      body: {
        en: "I build things end to end, from the design to the documentation other teams need to use them.",
        "pt-br":
          "Construo de ponta a ponta, do design à documentação que outros times precisam para usar o que entrego.",
      },
    },
    {
      title: {
        en: "The business problem comes first",
        "pt-br": "O problema de negócio vem primeiro",
      },
      body: {
        en: "I try to understand why a delivery matters to the people who use it, not only what code it needs.",
        "pt-br":
          "Procuro entender por que uma entrega importa para quem vai usá-la, e não só qual código ela exige.",
      },
    },
  ],
  achievements: [
    {
      year: 2023,
      title: {
        en: "5th of 50 teams at the Copel Hackathon, selected for the final pitch to the company's board. I designed the machine learning architecture of our computer vision proposal.",
        "pt-br":
          "5º lugar entre 50 times no Hackathon da Copel, selecionado para o pitch final à diretoria da empresa. Projetei a arquitetura de machine learning da nossa proposta de visão computacional.",
      },
    },
    {
      year: 2019,
      title: {
        en: "Bronze medal at the Brazilian Rubik's Cube Championship (4x4 and one-handed 3x3).",
        "pt-br":
          "Medalha de bronze no Campeonato Brasileiro de Cubo Mágico (4x4 e 3x3 com uma mão).",
      },
    },
    {
      year: 2018,
      title: {
        en: "Gold medal at the Brazilian Astronomy and Astronautics Olympiad (OBA).",
        "pt-br":
          "Medalha de ouro na Olimpíada Brasileira de Astronomia e Astronáutica (OBA).",
      },
    },
    {
      year: 2018,
      title: {
        en: "Bronze medal at the Kangaroo Mathematics Olympiad.",
        "pt-br": "Medalha de bronze na Olimpíada Canguru de Matemática.",
      },
    },
    {
      year: 2017,
      title: {
        en: "Bronze medals at the OBA and the Kangaroo Mathematics Olympiad.",
        "pt-br":
          "Medalhas de bronze na OBA e na Olimpíada Canguru de Matemática.",
      },
    },
  ],
  languages: [
    {
      name: { en: "Portuguese", "pt-br": "Português" },
      level: { en: "Native", "pt-br": "Nativo" },
    },
    {
      name: { en: "English", "pt-br": "Inglês" },
      level: { en: "Fluent", "pt-br": "Fluente" },
    },
    {
      name: { en: "Spanish", "pt-br": "Espanhol" },
      level: { en: "Intermediate", "pt-br": "Intermediário" },
    },
    {
      name: { en: "German", "pt-br": "Alemão" },
      level: {
        en: "Intermediate, self-taught",
        "pt-br": "Intermediário, autodidata",
      },
    },
    {
      name: { en: "Hungarian", "pt-br": "Húngaro" },
      level: {
        en: "Basic, currently studying",
        "pt-br": "Básico, estudando atualmente",
      },
    },
  ],
  facts: [
    {
      body: {
        en: "I've been speedcubing since 2016, though I'm retired now.",
        "pt-br": "Pratico speedcubing desde 2016, mas hoje estou aposentado.",
      },
      href: "https://www.worldcubeassociation.org/persons/2016LIPS01",
    },
    {
      body: {
        en: "I've studied classical piano on and off since I was 6, and today I also study music production, mostly jazz. It never made me a fast typist.",
        "pt-br":
          "Estudo piano clássico, com pausas, desde os 6 anos, e hoje também estudo produção musical, principalmente jazz. Isso nunca me fez digitar rápido.",
      },
    },
  ],
};

/** About page content with its texts in `locale`. */
export function getAbout(locale: Locale): About {
  return localize(about, locale);
}
