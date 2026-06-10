import {
  DivLogo,
  InetumLogo,
  MilwaukeeLogo,
} from "@/images/logos";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";

type Project = {
  title: string;
  techStack: readonly string[];
  description: string;
  logo: string;
  link?: {
    label: string;
    href: string;
  };
  githubLink?: string;
};

export const RESUME_DATA = {
  name: "Roberto Castillo",
  initials: "RC",
  location: "México",
  locationLink: "https://www.google.com/maps/place/mexico",
  about: "QA Engineer | SDET AI Augmented",
  summary:
    "QA Engineer with 3+ years of experience contributing to and leading end-to-end quality strategies across 15+ projects in e-commerce, healthcare, logistics and finance within fast-paced IT consulting environments. Proven ability to own the full testing lifecycle from requirements analysis and shift-left validation to CI/CD integration, API testing and defect triage, adapting quickly across industries, teams and tech stacks. Combines strong automation skills (Playwright, Cypress, Jest) and API testing expertise (Postman, Pact) with hands-on experience in enterprise platforms such as Salesforce, HubSpot and Stripe. Leverages AI-augmented workflows including multi-agent systems, custom agent skills and autonomous CI/CD remediation workflows using Claude Code and MCP to accelerate delivery and reduce manual intervention. Comfortable working with distributed, international teams and contributing beyond QA when needed.",
  avatarUrl: "https://github.com/Defused15.png",
  personalWebsiteUrl: "",
  contact: {
    email: "rct18130984@gmail.com",
    tel: "+528711053221",
    social: [
      {
        name: "GitHub",
        url: "https://github.com/Defused15",
        icon: GitHubIcon,
      },
      {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/rocastil/",
        icon: LinkedInIcon,
      },
    ],
  },
  education: [
    {
      school: "Instituto Tecnológico de La Laguna",
      degree: "Bachelor of Mechatronic Engineering",
      start: "2018",
      end: "2022",
    },
  ],
  work: [
    {
      company: "Inetum",
      link: "https://www.inetum.com/es",
      badges: ["Remote"],
      title: "Quality Engineer",
      logo: InetumLogo,
      start: "2025",
      end: null,
      description: [
        "Led the end-to-end quality strategy for a Sitecore-based CMS platform, covering functional, SIT, UAT, regression and accessibility testing phases.",
        "Applied shift-left practices by reviewing UI/UX designs and analyzing tickets for ambiguities prior to development, preventing late-stage rework by resolving requirement gaps early.",
        "Authored test plans and strategies for each release cycle, defining scope, entry/exit criteria, risk coverage and environment requirements aligned with sprint goals and business objectives.",
        "Designed and executed test cases using equivalence partitioning, boundary value analysis and exploratory techniques, ensuring comprehensive coverage across all user-facing workflows and edge cases.",
        "Integrated Playwright E2E and regression automation into Azure DevOps pipelines, reducing manual regression effort and enabling reliable continuous delivery across release cycles.",
        "Identified and tracked WCAG 2.1 accessibility violations using Axe and Google Lighthouse, coordinating with developers to remediate findings and achieve ADA compliance across all platform pages.",
        "Designed and executed spike and load test scenarios with K6, identifying performance bottlenecks under peak traffic conditions and validating system stability thresholds before each production release.",
        "Triaged defects and managed work items in Azure Boards, prioritizing by severity and business impact and coordinating sprint planning to maintain release cadence and quality gates.",
        "Produced QA documentation including test plans, test case repositories, defect taxonomy guidelines and release checklists to standardize quality practices across the team.",
        "Validated Salesforce Marketing Cloud lead records by verifying field mapping, data types and workflow triggers, ensuring data integrity across marketing automation pipelines.",
      ],
    },
    {
      company: "Divelement",
      link: "https://divelement.io/",
      badges: ["Remote"],
      title: "QA Engineer",
      logo: DivLogo,
      start: "2023",
      end: "2025",
      description: [
        "Owned end-to-end QA delivery across multiple concurrent client projects in e-commerce, healthcare and logistics, adapting test strategies to diverse tech stacks and delivery rhythms.",
        "Analyzed requirements for clarity, completeness and testability, translating them into test plans that defined strategy, scope, environments and entry/exit criteria aligned with each project's goals.",
        "Delivered manual and automated test coverage across functional, integration, system and UAT phases, including test data creation and regression suites, consistently surfacing critical defects before production releases.",
        "Engineered and maintained Playwright automation frameworks using Page Object Model (POM), integrated into CI/CD pipelines to ensure consistent and repeatable regression coverage across every release.",
        "Conducted API testing with Postman across REST integrations and ran OWASP ZAP scans and dependency checks to identify vulnerabilities and validate secure data handling across projects.",
        "Validated performance, scalability and stability under varying load conditions using K6, uncovering bottlenecks and stability risks ahead of production deployments.",
        "Owned defect triage in JIRA, prioritizing issues by severity and business impact to keep delivery on track.",
        "Validated content rendering, data integrity and workflow behavior across CMS-driven applications built on Contentful, Sanity, Netlify and Drupal.",
        "Collaborated with developers and PMs in Agile Scrum sprints to define acceptance criteria and validate deliverables against product requirements.",
      ],
    },
    {
      company: "Milwaukee Tools",
      link: "https://www.milwaukeetool.com",
      badges: ["On-site"],
      title: "QA & Testing Intern",
      logo: MilwaukeeLogo,
      start: "2022",
      end: "2022",
      description: [
        "Developed a C# application supporting 200+ concurrent users managing 800+ daily records in SQL Server, designing the full database schema and serving as sole QA owner across functional, regression and data validation testing.",
        "Validated data accuracy directly in SQL Server by writing queries to verify record integrity, detect anomalies and confirm correct storage across all database operations.",
        "Built Power BI dashboards to support laboratory management, productivity analysis, and executive reporting, translating raw operational data into actionable business insights.",
      ],
    },
  ],
  skills: [
    {
      category: "Programming",
      items: ["JavaScript", "TypeScript", "HTML", "CSS", "SQL"],
    },
    {
      category: "Testing Frameworks & Tools",
      items: ["Playwright", "Cypress", "Jest", "Postman", "Bruno", "Insomnia", "Pact", "Swagger / OpenAPI"],
    },
    {
      category: "Performance & Security",
      items: ["K6", "JMeter", "Blazemeter", "OWASP ZAP", "OWASP Dependency Check", "Burp Suite"],
    },
    {
      category: "Accessibility & Observability",
      items: ["Axe", "Google Lighthouse", "Sentry"],
    },
    {
      category: "CI/CD & DevOps",
      items: ["Azure DevOps", "GitHub Actions", "Git", "GitHub", "Docker"],
    },
    {
      category: "Project Management",
      items: ["JIRA", "Asana", "ClickUp", "Azure Boards", "Azure Test Plans", "Qase", "Agile"],
    },
    {
      category: "Platforms & Integrations",
      items: ["Salesforce Marketing Cloud", "HubSpot", "Sitecore", "Contentful", "Sanity", "Netlify", "Drupal", "Stripe", "Google Analytics", "Mixpanel"],
    },
    {
      category: "AI Tools",
      items: ["Claude Code", "Anthropic API", "Model Context Protocol (MCP)", "AI-Powered Testing"],
    },
    {
      category: "Data & Design",
      items: ["Power BI", "Tableau", "Excel", "Figma", "Adobe Creative Suite"],
    },
    {
      category: "Testing Methodologies",
      items: ["Functional Testing", "Integration Testing", "System Testing", "UAT", "Regression Testing", "Smoke Testing", "Sanity Testing", "Cross-browser Testing", "Performance Testing", "Accessibility Testing (ADA / WCAG 2.1)", "Security Testing (OWASP)", "REST API Testing", "Exploratory Testing", "Test Strategy & Planning", "Test Automation Framework Design"],
    },
  ],
  certifications: [
    {
      title: "Claude Code in Action",
      issuer: "Anthropic",
      year: "2026",
      url: "https://verify.skilljar.com/c/q968tshgyfc9",
    },
    {
      title: "Introduction to Agent Skills",
      issuer: "Anthropic",
      year: "2026",
      url: "https://verify.skilljar.com/c/pevyfncx8rbp",
    },
    {
      title: "Introduction to Model Context Protocol",
      issuer: "Anthropic",
      year: "2026",
      url: "https://verify.skilljar.com/c/nrdyumuk4zqg",
    },
    {
      title: "Mobile App Metrics & Optimization",
      issuer: "Platzi",
      year: "2025",
      url: "https://platzi.com/p/roberto.castillo6549/curso/11930-course/diploma/detalle/",
    },
    {
      title: "Google Data Analytics",
      issuer: "Cisco",
      year: "2025",
      url: "https://www.credly.com/users/roberto-castillo.7a5e2dcd/badges/credly",
    },
    {
      title: "Bug Bounty & Web Security Testing",
      issuer: "Udemy",
      year: "2024",
      url: "https://www.udemy.com/certificate/UC-ca2d1e93-8ffb-4c40-8260-560e8b6e2653/",
    },
    {
      title: "Google Cloud Skills Boost",
      issuer: "Google",
      year: "2023",
      url: "https://www.cloudskillsboost.google/public_profiles/a2e36a7b-5b82-49c3-a098-153eec5e545f",
    },
    {
      title: "Google Data Analytics",
      issuer: "Coursera",
      year: "2022",
      url: "https://coursera.org/share/8761afde9926f90f13b641f355e4bcd3",
    },
  ],
  languages: [
    { language: "English", proficiency: "C1 Proficient" },
    { language: "Spanish", proficiency: "Native" },
    { language: "Italian", proficiency: "Basic" },
  ],
  projects: [
    {
      title: "QA Test Hub",
      techStack: ["JavaScript", "GitHub Actions", "GitHub Pages"],
      description:
        "Aggregated test dashboard that collects JSON reports from multiple QA project repos via the GitHub API and rebuilds a unified live dashboard on every push. Supports Playwright and Jest reporters.",
      logo: "",
      link: {
        label: "qa.rcastillo.dev",
        href: "https://qa.rcastillo.dev",
      },
      githubLink: "https://github.com/Defused15/test-hub",
    },
    {
      title: "QA Playground Test Automation",
      techStack: ["Playwright", "Github Actions"],
      description:
        "The QA Playground page has Mini Web Apps that I use to showcase my test skills. I have created a GitHub repository that contains the code for the test automation and CI/CD pipeline.",
      logo: "",
      link: {
        label: "defused15.github.io",
        href: "https://defused15.github.io/QA-Playground-Tests/dashboard.html",
      },
      githubLink: "https://github.com/Defused15/QA-Playground-Tests",
    },
    {
      title: "Restful Booker API Testing",
      techStack: ["Postman", "Newman", "GitHub Actions"],
      description:
        "Postman collection for the Restful Booker API covering happy path, negative, edge, security, and performance scenarios. Automated via Newman and GitHub Actions with HTML reports published to GitHub Pages.",
      logo: "",
      link: {
        label: "defused15.github.io",
        href: "https://defused15.github.io/restful-booker-api-testing/",
      },
      githubLink: "https://github.com/Defused15/restful-booker-api-testing",
    },
    {
      title: "Minimalist CV",
      techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Jest", "Stryker", "GitHub Actions"],
      description:
        "Personal CV web app forked from an open-source template and extended with dark mode support and an unit testing suite. Features 96 unit tests with 73.26% line coverage and a 75.47% mutation score validated with Stryker Mutator.",
      logo: "",
      link: {
        label: "defused15.github.io",
        href: "https://rcastillo.dev",
      },
      githubLink: "https://github.com/Defused15/roberto-castillo-terrazas-cv",
    },
  ] as Project[],
} as const;