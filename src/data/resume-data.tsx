import {
 DivLogo,
 InetumLogo,
} from "@/images/logos";
import { GitHubIcon, LinkedInIcon, XIcon } from "@/components/icons";

export const RESUME_DATA = {
  name: "Roberto Castillo",
  initials: "RC",
  location: "México",
  locationLink: "https://www.google.com/maps/place/mexico",
  about:
    "QA Engineer",
  summary:
    "Experienced QA Engineer with a proven track record across 15+ projects in diverse industries, including e-commerce, logistics, healthcare, finance, food & beverage, and manufacturing. Expertise includes leading over 6 projects with full ownership of the QA process — from defining test strategies and creating comprehensive test plans to executing manual and automated tests. Skilled in a wide range of testing types such as functional, integration, system, user acceptance (UAT), regression, performance, security, accessibility, and exploratory testing. Proficient in tools and technologies including Playwright, Postman, K6, Git, GitHub, GitHub Actions, Azure DevOps, CI/CD, JIRA, ClickUp, Asana, and Figma. Strong technical foundation with experience in HTML, CSS, JavaScript, TypeScript, SQL, AI testing, and data visualization tools like Power BI and Tableau.",
  avatarUrl: "https://github.com/Defused15.png",
  personalWebsiteUrl: "",
  contact: {
    email: "rtc18130984@gmail.com",
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
    /*  {
        name: "X",
        url: "https://x.com/BartoszJarocki",
        icon: XIcon,
      },*/
    ],
  },
  education: [
    {
      school: "University Instituto Tecnológico de La Laguna",
      degree: "Bachelor of Mechatronic Engineering",
      start: "2018",
      end: "2022",
    },
  ],
  work: [
    {
      company: "Inetum",
      link: "https://parabol.co",
      badges: ["Remote"],
      title: "Quality Engineer",
      logo: InetumLogo,
      start: "2025",
      end: null,
 description: [
  "Led the review and analysis of software requirements to ensure clarity, completeness, and testability.",
  "Created detailed test plans including test strategies that defined scope, objectives, types of testing, resources, and schedules.",
  "Designed and wrote the complete test suite with test cases based on functional requirements, applying diverse testing techniques.",
  "Developed and implemented automated tests, integrating them into CI/CD pipelines to enable scheduled regression testing.",
  "Managed and prioritized bug tracking, ensuring accurate logging and follow-up of issues during the QA process.",
  "Performed integration testing, system testing, and user acceptance testing (UAT) to validate functionality and performance.",
  "Created detailed supporting documentation to facilitate and back QA processes and team understanding.",
  "Generated detailed testing reports to communicate results, issues, and quality metrics to stakeholders.",
  "Conducted performance testing, including spike and load scenarios, to evaluate scalability and system reliability.",
  "Executed accessibility testing to ensure compliance with ADA standards and inclusive software design.",
  "Collaborated closely with cross-functional teams, leading QA efforts and aligning testing activities with development and product goals."
],


    },
    {
  company: "Divelement",
  link: "https://divelement.io/",
  badges: ["Remote"],
  title: "QA Engineer",
  logo: DivLogo,
  start: "2023",
  end: 2025,
 description: [
  "Reviewing and analyzing the software requirements for clarity, completeness, testability, and consistency.",
  "Creating detailed test plans that outlines the test strategy, objectives, schedule, resources, tools, and environments needed for testing.",
  "Designing and writing test cases and test scripts based on the software requirements and design documents. This also includes the creation of test data.",
  "Running the test cases on the software, which includes functional testing, integration testing, system testing, and user acceptance testing.",
  "Implementing automated testing scripts and frameworks for efficient and consistent testing cycles, encompassing strategy development, script creation, framework setup, and integration with continuous integration/deployment pipelines.",
  "Recording, tracking, and managing defects found during testing. This includes prioritizing defects based on severity and impact.",
  "Conducting repeated testing of the software to ensure that newly developed features or bug fixes haven't adversely affected existing functionalities.",
  "Assessing the software performance in terms of speed, scalability, and stability under different conditions.",
  "Testing the software from an end-user perspective to ensure it is intuitive, easy to use, and meets user requirements.",
  "Reviewing all related documentation for accuracy and completeness, and testing the software against the documented requirements.",
  "Collaborate with cross-functional teams, to understand requirements and provide feedback on software quality."
],
}

  ],
  skills: [
    "HTML",
    "CSS",
    "JavaScript",
    "TypeScript",
    "SQL",
    "Manual Testing",
    "Automation Testing",
    "Functional Testing",
    "Integration Testing",
    "System Testing",
    "User Acceptance Testing (UAT)",
    "Non-Functional Testing",
    "Penetration Testing",
    "Security Testing",
    "Accessibility Testing",
    "Performance Testing",
    "AI Testing",
    "Regression Testing",
    "Smoke Testing",
    "Sanity Testing",
    "Exploratory Testing",
    "Test Planning",
    "Test Case Design",
    "Test Execution",
    "Playwright",
    "K6",
    "Postman (API testing)",
    "Git",
    "GitHub",
    "Github Actions",
    "Azure DevOps",
    "CI/CD",
    "JIRA",
    "Clickup",
    "Asana",
    "Agile Development",
    "Figma",
    "Power BI",
    "Tableau",
  ]
  ,
  
  projects: [
    {
      title: "QA Playground Test Automation",
      techStack: [
        "Playwright",
        "Github Actions",
      ],
      description:
        "The QA Playground page has Mini Web Apps that I use to showcase my test skills. I have created a GitHub repository that contains the code for the test automation and CI/CD pipeline.",
      logo: "",
      link: {
        label: "github.com",
        href: "https://github.com/Defused15/QA-Playground-Tests",
      },
    },
  ],

} as const;
