import {DivLogo, InetumLogo, MilwaukeeLogo} from '@/images/logos';
import {GitHubIcon, LinkedInIcon} from '@/components/icons';
import type {ResumeData} from './resume-data.types';
import type {EncodedPhone} from '@/lib/decode-phone';

export const RESUME_DATA_EN: ResumeData = {
  name: 'Roberto Castillo',
  initials: 'RC',
  locations: [
    {name: 'Spain', link: 'https://www.google.com/maps/place/Spain'},
    {name: 'Mexico', link: 'https://www.google.com/maps/place/Mexico'},
  ],
  about: 'QA Engineer | AI-Augmented SDET',
  summary:
    'QA Engineer with {years} of experience contributing to and leading end-to-end quality strategies across 15+ projects in e-commerce, healthcare, logistics and finance within fast-paced IT consulting environments. Proven ability to own the full testing lifecycle, from requirements analysis and shift-left validation to CI/CD integration and defect triage, adapting quickly across industries, teams and tech stacks. Combines strong automation skills (Playwright, Cypress, Jest) and API testing expertise (Postman, Pact) with hands-on experience in enterprise platforms such as Salesforce, HubSpot and Stripe. Uses AI-augmented workflows, including multi-agent systems, custom agent skills and autonomous CI/CD remediation built with Claude Code and MCP, to accelerate delivery and reduce manual intervention. Comfortable working with distributed, international teams and contributing beyond QA when needed.',
  avatarUrl: '/avatar.jpg',
  contact: {
    email: 'rct18130984@gmail.com',
    // +34 610 831 754 and +52 871 105 3221, encoded (see src/lib/decode-phone.ts).
    phones: ['NDU3MTM4MDE2NDMr', 'MTIyMzUwMTE3ODI1Kw=='] as EncodedPhone[],
    social: [
      {
        name: 'GitHub',
        url: 'https://github.com/Defused15',
        icon: GitHubIcon,
      },
      {
        name: 'LinkedIn',
        url: 'https://www.linkedin.com/in/rocastil/',
        icon: LinkedInIcon,
      },
    ],
  },
  education: [
    {
      school: 'Universidad de Almería',
      degree:
        "Master's Degree in Computer Engineering (Big Data specialization)",
      start: '2026-10',
      end: null,
    },
    {
      school: 'Instituto Tecnológico de La Laguna',
      degree: 'Bachelor of Engineering in Mechatronics',
      start: '2018-08',
      end: '2022-12',
    },
  ],
  work: [
    {
      company: 'Inetum',
      link: 'https://www.inetum.com/es',
      badges: ['Remote'],
      title: 'Quality Engineer',
      logo: InetumLogo,
      start: '2025-03',
      end: null,
      description: [
        'Led the end-to-end quality strategy for a Sitecore-based CMS platform, covering functional, SIT, UAT, regression and accessibility testing.',
        'Applied shift-left practices, reviewing UI/UX designs and analyzing tickets for ambiguities before development to resolve requirement gaps early and prevent late-stage rework.',
        'Authored test plans and strategies for each release cycle, defining scope, entry/exit criteria, risk coverage and environment requirements aligned with sprint goals and business objectives.',
        'Designed and executed test cases using equivalence partitioning, boundary value analysis and exploratory techniques, ensuring coverage of all user-facing workflows and edge cases.',
        'Integrated Playwright E2E and regression automation into Azure DevOps pipelines, reducing manual regression effort and enabling reliable continuous delivery across release cycles.',
        'Identified and tracked WCAG 2.1 accessibility violations using axe and Google Lighthouse, coordinating with developers to remediate findings and achieve ADA compliance across all platform pages.',
        'Built and ran spike and load test scenarios with k6, identifying performance bottlenecks under peak traffic conditions and validating system stability thresholds before each production release.',
        'Triaged defects and managed work items in Azure Boards, prioritizing them by severity and business impact, and coordinated sprint planning to maintain release cadence and quality gates.',
        'Produced QA documentation including test plans, test case repositories, defect taxonomy guidelines and release checklists to standardize quality practices across the team.',
        'Validated Salesforce Marketing Cloud lead records by verifying field mapping, data types and workflow triggers, ensuring data integrity across marketing automation pipelines.',
      ],
    },
    {
      company: 'Divelement',
      link: 'https://divelement.io/',
      badges: ['Remote'],
      title: 'QA Engineer',
      logo: DivLogo,
      start: '2023-01',
      end: '2025-03',
      description: [
        'Owned end-to-end QA delivery across multiple concurrent client projects in e-commerce, healthcare and logistics, adapting test strategies to diverse tech stacks and delivery rhythms.',
        "Analyzed requirements for clarity, completeness and testability, translating them into test plans that defined strategy, scope, environments and entry/exit criteria aligned with each project's goals.",
        'Delivered manual and automated test coverage across functional, integration, system and UAT phases, including test data creation and regression suites, consistently surfacing critical defects before production releases.',
        'Built and maintained Playwright automation frameworks using the Page Object Model (POM) and integrated them into CI/CD pipelines for consistent, repeatable regression coverage on every release.',
        'Conducted API testing with Postman across REST integrations and ran OWASP ZAP scans and dependency checks to identify vulnerabilities and validate secure data handling across projects.',
        'Ran k6 load tests under varying conditions to validate performance, scalability and stability, uncovering bottlenecks and risks ahead of production deployments.',
        'Led defect triage in Jira, prioritizing issues by severity and business impact to keep delivery on track.',
        'Tested content rendering, data integrity and workflow behavior across CMS-driven applications built on Contentful, Sanity, Netlify CMS (Decap) and Drupal.',
        'Collaborated with developers and PMs in Agile Scrum sprints to define acceptance criteria and validate deliverables against product requirements.',
      ],
    },
    {
      company: 'Milwaukee Tool',
      link: 'https://www.milwaukeetool.com',
      badges: ['On-site'],
      title: 'QA & Testing Intern',
      logo: MilwaukeeLogo,
      start: '2022-04',
      end: '2022-12',
      description: [
        'Developed a C# application backed by SQL Server that supported 200+ concurrent users managing 800+ records daily; designed the full database schema and served as sole QA owner for functional, regression and data validation testing.',
        'Wrote SQL Server queries to verify data accuracy and record integrity, detect anomalies and confirm correct storage across all database operations.',
        'Built Power BI dashboards to support laboratory management, productivity analysis and executive reporting, translating raw operational data into actionable business insights.',
      ],
    },
  ],
  skills: [
    {
      category: 'Programming',
      items: ['JavaScript', 'TypeScript', 'HTML', 'CSS', 'SQL'],
    },
    {
      category: 'Testing Frameworks & Tools',
      items: [
        'Playwright',
        'Cypress',
        'Jest',
        'Postman',
        'Bruno',
        'Insomnia',
        'Pact',
        'Swagger / OpenAPI',
      ],
    },
    {
      category: 'Performance & Security',
      items: [
        'k6',
        'JMeter',
        'BlazeMeter',
        'OWASP ZAP',
        'OWASP Dependency-Check',
        'Burp Suite',
      ],
    },
    {
      category: 'Accessibility & Observability',
      items: ['axe', 'Google Lighthouse', 'Sentry'],
    },
    {
      category: 'CI/CD & DevOps',
      items: ['Azure DevOps', 'GitHub Actions', 'Git', 'GitHub', 'Docker'],
    },
    {
      category: 'Project Management',
      items: [
        'Jira',
        'Asana',
        'ClickUp',
        'Azure Boards',
        'Azure Test Plans',
        'Qase',
        'Agile',
      ],
    },
    {
      category: 'Platforms & Integrations',
      items: [
        'Salesforce Marketing Cloud',
        'HubSpot',
        'Sitecore',
        'Contentful',
        'Sanity',
        'Netlify CMS (Decap)',
        'Drupal',
        'Stripe',
        'Google Analytics',
        'Mixpanel',
      ],
    },
    {
      category: 'AI Tools',
      items: [
        'Claude Code',
        'Anthropic API',
        'Model Context Protocol (MCP)',
        'AI-Powered Testing',
      ],
    },
    {
      category: 'Data & Design',
      items: ['Power BI', 'Tableau', 'Excel', 'Figma', 'Adobe Creative Suite'],
    },
    {
      category: 'Testing Methodologies',
      items: [
        'Functional Testing',
        'Integration Testing',
        'System Testing',
        'UAT',
        'Regression Testing',
        'Smoke Testing',
        'Sanity Testing',
        'Cross-Browser Testing',
        'Performance Testing',
        'Accessibility Testing (ADA / WCAG 2.1)',
        'Security Testing (OWASP)',
        'REST API Testing',
        'Exploratory Testing',
        'Test Strategy & Planning',
        'Test Automation Framework Design',
      ],
    },
  ],
  certifications: [
    {
      title: 'Claude Code in Action',
      issuer: 'Anthropic',
      year: '2026',
      url: 'https://verify.skilljar.com/c/q968tshgyfc9',
      verified: true,
    },
    {
      title: 'Introduction to Agent Skills',
      issuer: 'Anthropic',
      year: '2026',
      url: 'https://verify.skilljar.com/c/pevyfncx8rbp',
      verified: true,
    },
    {
      title: 'Introduction to Model Context Protocol',
      issuer: 'Anthropic',
      year: '2026',
      url: 'https://verify.skilljar.com/c/nrdyumuk4zqg',
      verified: true,
    },
    {
      title: 'Data Analytics Essentials',
      issuer: 'Cisco',
      year: '2025',
      url: 'https://www.credly.com/badges/02a73076-2bf0-4c6f-89a1-1beabdff4b0b',
      verified: true,
    },
    {
      title: 'Introduction to Data Science',
      issuer: 'Cisco',
      year: '2025',
      url: 'https://www.credly.com/badges/9d0114a7-eb43-4102-932b-a69626b5a028',
      verified: true,
    },
    {
      title: 'Prompt Design in Vertex AI Skill Badge',
      issuer: 'Google Cloud',
      year: '2025',
      url: 'https://www.credly.com/badges/d3e3f07f-8d25-42c5-a10e-55cc26293449',
      verified: true,
    },
    {
      title: 'Mobile App Metrics & Optimization',
      issuer: 'Platzi',
      year: '2025',
      url: 'https://platzi.com/p/roberto.castillo6549/curso/11930-course/diploma/detalle/',
      verified: true,
    },
    {
      title: 'Bug Bounty & Web Security Testing',
      issuer: 'Udemy',
      year: '2024',
      url: 'https://www.udemy.com/certificate/UC-ca2d1e93-8ffb-4c40-8260-560e8b6e2653/',
      verified: true,
    },
    {
      title: 'Google Cloud Skills Boost',
      issuer: 'Google',
      year: '2023',
      url: 'https://www.cloudskillsboost.google/public_profiles/a2e36a7b-5b82-49c3-a098-153eec5e545f',
      verified: true,
    },
    {
      title: 'Google Data Analytics',
      issuer: 'Coursera',
      year: '2022',
      url: 'https://coursera.org/share/8761afde9926f90f13b641f355e4bcd3',
      verified: true,
    },
  ],
  languages: [
    {language: 'English', proficiency: 'C1 (Advanced)'},
    {language: 'Spanish', proficiency: 'Native'},
    {language: 'Italian', proficiency: 'Basic'},
  ],
  projects: [
    {
      title: 'QA Test Hub',
      techStack: ['JavaScript', 'GitHub Actions', 'GitHub Pages'],
      description:
        'Unified test dashboard that collects JSON reports from multiple QA repos via the GitHub API and rebuilds live on every push. Supports Playwright and Jest reporters.',
      link: {
        label: 'qa.rcastillo.dev',
        href: 'https://qa.rcastillo.dev',
      },
      githubLink: 'https://github.com/Defused15/test-hub',
    },
    {
      title: 'QA Playground Test Automation',
      techStack: ['Playwright', 'GitHub Actions'],
      description:
        'Playwright test automation suite for the QA Playground mini web apps, built to showcase test automation skills, with a GitHub Actions CI/CD pipeline and a published test dashboard.',
      link: {
        label: 'defused15.github.io',
        href: 'https://defused15.github.io/QA-Playground-Tests/dashboard.html',
      },
      githubLink: 'https://github.com/Defused15/QA-Playground-Tests',
    },
    {
      title: 'Restful Booker API Testing',
      techStack: ['Postman', 'Newman', 'GitHub Actions'],
      description:
        'Postman collection for the Restful Booker API covering happy-path, negative, edge-case, security and performance scenarios. Automated via Newman and GitHub Actions with HTML reports published to GitHub Pages.',
      link: {
        label: 'defused15.github.io',
        href: 'https://defused15.github.io/restful-booker-api-testing/',
      },
      githubLink: 'https://github.com/Defused15/restful-booker-api-testing',
    },
    {
      title: 'Minimalist CV',
      techStack: [
        'Next.js',
        'TypeScript',
        'Tailwind CSS',
        'Jest',
        'Stryker',
        'GitHub Actions',
      ],
      description:
        'Personal CV web app forked from an open-source template and extended with dark mode support and a unit testing suite. Features 140+ unit tests across the EN and ES versions, validated with Stryker Mutator mutation testing.',
      link: {
        label: 'rcastillo.dev',
        href: 'https://rcastillo.dev',
      },
      githubLink: 'https://github.com/Defused15/roberto-castillo-terrazas-cv',
    },
  ],
  ui: {
    sections: {
      about: 'About',
      work: 'Work Experience',
      education: 'Education',
      skills: 'Skills',
      certifications: 'Certifications & Courses',
      languages: 'Languages',
      projects: 'Projects',
    },
    present: 'Present',
    verified: 'Verified',
    githubRepo: 'GitHub repo',
    theme: {
      toggle: 'Switch theme',
      light: 'Light',
      dark: 'Dark',
      system: 'System',
    },
    languageToggle: 'Switch language',
    contact: {
      email: 'Send an email',
      call: 'Call',
      showPhones: 'Show phone numbers',
      copy: 'Copy',
      copyEmail: 'Copy email address',
      copied: 'Copied ✓',
      profiles: {
        GitHub: 'GitHub profile',
        LinkedIn: 'LinkedIn profile',
      },
      print: 'Print or save as PDF',
      saveContact: 'Save contact',
    },
    print: {
      qrCaption: 'Live version: rcastillo.dev',
    },
    notFound: {
      title: 'Page not found',
      description: "The page you're looking for doesn't exist.",
      backHome: 'Back to the CV',
    },
    skipToContent: 'Skip to content',
    error: {
      title: 'Something went wrong',
      description:
        'An unexpected error occurred. You can try again or go back to the CV.',
      retry: 'Try again',
      backHome: 'Back to the CV',
    },
    privacy: {
      link: 'Privacy',
      title: 'Privacy',
      intro:
        "This is my personal CV site. Here is what I measure when you visit it, and what I don't.",
      sections: [
        {
          title: 'Who I am',
          paragraphs: [
            "I'm Roberto Castillo and this site is mine. If you have a question about your data, write to me at {email}.",
          ],
        },
        {
          title: 'What I measure',
          paragraphs: [
            "I use PostHog, hosted in its EU cloud in Frankfurt, to count page visits and how long they last, including visits to pages that don't exist. PostHog doesn't store your IP address: it's removed as soon as the visit arrives. It also collects basic page-speed measurements. Sessions are not recorded and no visitor profiles are built.",
            "I also count which links and buttons on the CV get used (contact details, including copying the email or a phone number, revealing the phone numbers and saving the contact card, profiles, projects, certificates, language, theme and printing, from the print button or the browser) to see which parts are useful. When a phone number is copied or called, I only keep the country of the number. I don't record what you type, where you move the mouse, or anything you do outside this site.",
            'Vercel Web Analytics also counts page visits, in aggregate and without cookies, and shows roughly which country they come from without storing your IP address. Vercel hosts the site, so its servers keep standard logs (IP address and browser type) to deliver the pages.',
          ],
        },
        {
          title: 'No cookies',
          paragraphs: [
            'This site sets no cookies. Your browser only keeps the language and theme you pick (in localStorage), so they stay the same next time. You can clear them in your browser settings.',
          ],
        },
        {
          title: 'Why',
          paragraphs: [
            'I want to know how many people look at my CV and which parts they use. The legal basis is my legitimate interest (GDPR art. 6(1)(f)).',
          ],
        },
        {
          title: 'Where the data lives',
          paragraphs: [
            'PostHog keeps the data in the EU. Vercel is a US company, so its part relies on the EU–US Data Privacy Framework and standard contractual clauses.',
          ],
        },
        {
          title: 'How long',
          paragraphs: [
            "The analytics data has no IP addresses, names, cookies or contact details. It is kept no longer than each provider's standard retention period, and I don't sell it or pass it to anyone else.",
          ],
        },
        {
          title: 'Your rights',
          paragraphs: [
            'You can ask me to show, correct or delete your data, or to stop or limit its use. Just write to {email}. You can also complain to the Spanish Data Protection Agency (AEPD) at {aepd}.',
          ],
        },
      ],
      lastUpdatedLabel: 'Last updated',
      lastUpdated: 'November 18, 2026',
    },
  },
};
