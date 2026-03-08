import {
  DivLogo,
  InetumLogo,
  MilwaukeeLogo,
} from "@/images/logos";
import { GitHubIcon, LinkedInIcon, XIcon } from "@/components/icons";

export const RESUME_DATA = {
  name: "Roberto Castillo",
  initials: "RC",
  location: "México",
  locationLink: "https://www.google.com/maps/place/mexico",
  about: "QA Engineer",
  summary:
    "QA Engineer with 3+ years of experience in end-to-end quality tests across 15+ projects in e-commerce, healthcare, logistics, and finance, leading 7 of them end-to-end. Proven ability to own the full testing lifecycle, covering everything from requirements analysis and test design to CI/CD integration and defect triage, in fast-paced consulting environments where adaptability and autonomy are critical. Combines strong automation skills (Playwright, Cypress, Jest) with hands-on experience in enterprise platforms such as Salesforce Marketing Cloud and Sitecore, consistently aligning quality efforts with product goals and client expectations. Leverages AI-assisted workflows, including Claude Code, to accelerate test development and improve overall efficiency. Comfortable working with distributed, international teams and contributing beyond QA when needed.",
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
        "Led the end-to-end quality strategy for a Sitecore-based CMS platform, covering unit, functional, SIT, UAT, automated, and accessibility testing.",
        "Created detailed test plans including test strategies that defined scope, objectives, types of testing, resources, and schedules.",
        "Designed and wrote the complete test suite with test cases based on functional requirements, applying diverse testing techniques.",
        "Built and maintained Playwright automation scripts integrated into Azure DevOps pipelines for continuous validation.",
        "Used Google Lighthouse to ensure ADA compliance and WCAG 2.1 standards.",
        "Conducted performance testing including spike and load scenarios to evaluate scalability and reliability.",
        "Managed work items, defect tracking, and sprint planning through Azure DevOps, prioritizing issues based on severity and impact.",
        "Created detailed supporting documentation to facilitate and back QA processes and team understanding.",
        "Generated detailed testing reports to communicate results, issues, and quality metrics to stakeholders.",
        "Validated Salesforce Marketing Cloud lead records, ensuring data integrity and accuracy across marketing workflows.",
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
        "Reviewed software requirements for clarity, completeness, and testability, then translated them into detailed test plans covering strategy, scope, environments, and schedules.",
        "Designed and executed manual and automated test cases across functional, integration, system, and UAT phases, including test data creation and regression coverage.",
        "Built and maintained automation frameworks using Playwright and integrated them into CI/CD pipelines for consistent, repeatable testing cycles.",
        "Tracked and triaged defects in JIRA, prioritizing by severity and impact.",
        "Assessed performance, scalability, and stability under varying conditions using K6.",
        "Validated content-driven applications across multiple CMS platforms including Contentful, Sanity, Netlify, and Drupal.",
        "Collaborated closely with cross-functional teams to align quality efforts with product goals and deliver clear, actionable feedback throughout the development lifecycle.",
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
        "Developed a C# application supporting 200+ simultaneous users to manage and store 800+ daily records in a SQL Server database, ensuring performance and reliability at scale.",
        "Designed the underlying database schema using normalized tables, views, and primary/foreign keys, accommodating 100,000+ records with efficient querying and data export capabilities.",
        "Built Power BI dashboards to support laboratory management, productivity analysis, and executive reporting, translating raw operational data into actionable business insights.",
      ],
    },
  ],
  skills: [
    // Programming Languages
    "JavaScript",
    "TypeScript",
    "HTML",
    "CSS",
    "SQL",
    // Testing Tools & Frameworks
    "Playwright",
    "Cypress",
    "Jest",
    "Postman",
    "K6",
    "Google Lighthouse",
    "Burp Suite",
    // CI/CD & DevOps
    "Azure DevOps",
    "GitHub Actions",
    "CI/CD",
    "Git",
    "GitHub",
    // Project Management
    "JIRA",
    "Asana",
    "ClickUp",
    // CMS & Marketing Platforms
    "Sitecore",
    "Salesforce Marketing Cloud",
    "Contentful",
    "Sanity",
    "Drupal",
    // AI Tools
    "Claude Code",
    "AI-Powered Testing",
    // Data & Design
    "Power BI",
    "Tableau",
    "Figma",
    // Testing Types
    "Automation Testing",
    "Functional Testing",
    "Integration Testing",
    "System Testing",
    "User Acceptance Testing (UAT)",
    "Regression Testing",
    "Performance Testing",
    "Accessibility Testing (ADA / WCAG 2.1)",
    "Security Testing (OWASP)",
    "Exploratory Testing",
    // Leadership & Strategy
    "Test Strategy & Planning",
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
  projects: [
    {
      title: "QA Playground Test Automation",
      techStack: ["Playwright", "Github Actions"],
      description:
        "The QA Playground page has Mini Web Apps that I use to showcase my test skills. I have created a GitHub repository that contains the code for the test automation and CI/CD pipeline.",
      logo: "",
      link: {
        label: "github.com",
        href: "https://github.com/Defused15/QA-Playground-Tests",
      },
    },
    {
      title: "Minimalist CV",
      techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Jest", "Stryker", "GitHub Actions"],
      description:
        "Personal CV web app forked from an open-source template and extended with dark mode support and a full testing suite. Features 77 unit tests with 73.86% line coverage and a 75.47% mutation score validated with Stryker Mutator.",
      logo: "",
      link: {
        label: "github.com",
        href: "https://github.com/Defused15/roberto-castillo-terrazas-cv",
      },
    },
  ],
} as const;