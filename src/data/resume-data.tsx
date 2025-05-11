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
    "Experienced QA Engineer with a track record of success in over 10 projects across diverse industries, including e-commerce, logistics, and healthcare. Proficient in manual and automated testing, penetration testing (pentesting), and creating comprehensive test plans to ensure software reliability and security. Expertise includes designing and executing test cases, managing defects, and conducting a wide range of tests, including functional, integration, system, user acceptance, and performance testing. Skilled in using tools like Playwright, K6, Postman, Git/GitHub, and JIRA, with strong knowledge of HTML, CSS, JavaScript, TypeScript, and SQL. A collaborative professional adept at thriving in Agile environments, delivering secure, user-focused, and high-quality software solutions.",
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
      description: 
      "In this role, I was responsible for reviewing and analyzing software requirements to ensure clarity, completeness, testability, and consistency. I created detailed test plans outlining the testing strategy, objectives, schedule, required resources, tools, and testing environments. Based on the software requirements and design documents, I designed and wrote test cases and scripts, including the creation of test data. I executed test cases across various stages such as functional, integration, system, and user acceptance testing. I also implemented automated testing scripts and frameworks to streamline and standardize testing cycles, integrating them with continuous integration and deployment pipelines. Defects identified during testing were thoroughly documented, tracked, and managed, with prioritization based on severity and impact. Regression testing was performed regularly to ensure new features or fixes did not introduce new issues. I assessed software performance in terms of speed, scalability, and stability under different conditions, and tested the product from an end-user perspective to validate usability and alignment with user expectations. Additionally, I reviewed related documentation for accuracy and consistency and collaborated closely with cross-functional teams to understand requirements and provide feedback on software quality throughout the development lifecycle.",
    },
    {
      company: "Divelement",
      link: "https://divelement.io/",
      badges: ["Remote"],
      title: "QA Engineer",
      logo: DivLogo,
      start: "2023",
      end: 2025,
      description: 
      "In this role, I was responsible for reviewing and analyzing software requirements to ensure clarity, completeness, testability, and consistency. I created detailed test plans outlining the testing strategy, objectives, schedule, required resources, tools, and testing environments. Based on the software requirements and design documents, I designed and wrote test cases and scripts, including the creation of test data. I executed test cases across various stages such as functional, integration, system, and user acceptance testing. I also implemented automated testing scripts and frameworks to streamline and standardize testing cycles, integrating them with continuous integration and deployment pipelines. Defects identified during testing were thoroughly documented, tracked, and managed, with prioritization based on severity and impact. Regression testing was performed regularly to ensure new features or fixes did not introduce new issues. I assessed software performance in terms of speed, scalability, and stability under different conditions, and tested the product from an end-user perspective to validate usability and alignment with user expectations. Additionally, I reviewed related documentation for accuracy and consistency and collaborated closely with cross-functional teams to understand requirements and provide feedback on software quality throughout the development lifecycle.",
    },

  ],
  skills: [
    "JavaScript",
    "TypeScript",
    "React/Next.js/Remix",
    "Node.js",
    "GraphQL",
    "Relay",
    "WebRTC",
  ],
  
  projects: [
    {
      title: "Parabol",
      techStack: [
        "Full Stack Developer",
        "TypeScript",
        "React",
        "Node.js",
        "GraphQL",
      ],
      description:
        "The Agile meeting co-pilot that delivers better meetings with less effort",
      logo: DivLogo,
      link: {
        label: "github.com",
        href: "https://parabol.co/",
      },
    },
    {
      title: "Evercast",
      techStack: [
        "Lead Frontend Developer",
        "TypeScript",
        "React",
        "Node.js",
        "GraphQL",
      ],
      description:
        "Creative collaboration platform that combines video conferencing and HD media streaming",
      logo: DivLogo,
      link: {
        label: "evercast.us",
        href: "https://www.evercast.us/",
      },
    },
 
  ],

} as const;
