import { RESUME_DATA_EN } from "./resume-data.en";
import type { ResumeData } from "./resume-data.types";

const EN = RESUME_DATA_EN;

export const RESUME_DATA_ES: ResumeData = {
  ...EN,
  about: "QA Engineer | SDET potenciado con IA",
  summary:
    "QA Engineer con más de 3 años de experiencia contribuyendo y liderando estrategias de calidad end-to-end en más de 15 proyectos de e-commerce, salud, logística y finanzas, en entornos de consultoría de TI de ritmo acelerado. Capacidad comprobada para hacerme cargo de todo el ciclo de vida de pruebas, desde el análisis de requerimientos y la validación shift-left hasta la integración en CI/CD, las pruebas de API y el triage de defectos, adaptándome rápidamente a distintas industrias, equipos y stacks tecnológicos. Combino sólidas habilidades de automatización (Playwright, Cypress, Jest) y dominio de pruebas de API (Postman, Pact) con experiencia práctica en plataformas empresariales como Salesforce, HubSpot y Stripe. Aprovecho flujos de trabajo potenciados con IA, como sistemas multiagente, agent skills personalizadas y flujos autónomos de remediación en CI/CD con Claude Code y MCP, para acelerar la entrega y reducir la intervención manual. Me desenvuelvo con soltura en equipos distribuidos e internacionales y aporto más allá de QA cuando se necesita.",
  education: [
    {
      ...EN.education[0],
      degree: "Ingeniería Mecatrónica",
    },
  ],
  work: [
    {
      ...EN.work[0],
      badges: ["Remoto"],
      title: "Quality Engineer",
      description: [
        "Lideré la estrategia de calidad end-to-end de una plataforma CMS basada en Sitecore, abarcando las fases de pruebas funcionales, SIT, UAT, regresión y accesibilidad.",
        "Apliqué prácticas shift-left revisando diseños de UI/UX y analizando tickets en busca de ambigüedades antes del desarrollo, evitando retrabajo en etapas tardías al resolver a tiempo las brechas en los requerimientos.",
        "Elaboré planes y estrategias de prueba para cada ciclo de release, definiendo alcance, criterios de entrada/salida, cobertura de riesgos y requerimientos de ambientes, alineados con los objetivos del sprint y del negocio.",
        "Diseñé y ejecuté casos de prueba mediante partición de equivalencia, análisis de valores límite y técnicas exploratorias, asegurando una cobertura integral de todos los flujos de usuario y edge cases.",
        "Integré la automatización E2E y de regresión con Playwright en pipelines de Azure DevOps, reduciendo el esfuerzo de regresión manual y habilitando una entrega continua confiable a lo largo de los ciclos de release.",
        "Identifiqué y di seguimiento a violaciones de accesibilidad WCAG 2.1 con Axe y Google Lighthouse, coordinando su corrección con los desarrolladores para lograr el cumplimiento de ADA en todas las páginas de la plataforma.",
        "Diseñé y ejecuté escenarios de pruebas de pico y de carga con K6, identificando cuellos de botella de rendimiento en condiciones de tráfico máximo y validando los umbrales de estabilidad del sistema antes de cada release a producción.",
        "Hice el triage de defectos y gestioné work items en Azure Boards, priorizando por severidad e impacto en el negocio y coordinando la planeación de sprints para mantener la cadencia de releases y los quality gates.",
        "Generé documentación de QA que incluye planes de prueba, repositorios de casos de prueba, lineamientos de taxonomía de defectos y checklists de release para estandarizar las prácticas de calidad en el equipo.",
        "Validé registros de leads en Salesforce Marketing Cloud verificando el mapeo de campos, los tipos de datos y los triggers de workflows, asegurando la integridad de los datos en los pipelines de automatización de marketing.",
      ],
    },
    {
      ...EN.work[1],
      badges: ["Remoto"],
      title: "QA Engineer",
      description: [
        "Gestioné la entrega de QA end-to-end en varios proyectos simultáneos de clientes de e-commerce, salud y logística, adaptando las estrategias de prueba a diversos stacks tecnológicos y ritmos de entrega.",
        "Analicé los requerimientos en cuanto a claridad, completitud y testeabilidad, traduciéndolos en planes de prueba que definían estrategia, alcance, ambientes y criterios de entrada/salida alineados con los objetivos de cada proyecto.",
        "Proporcioné cobertura de pruebas manuales y automatizadas en las fases funcional, de integración, de sistema y UAT, incluyendo la creación de datos de prueba y suites de regresión, detectando de forma constante defectos críticos antes de los releases a producción.",
        "Desarrollé y mantuve frameworks de automatización con Playwright usando Page Object Model (POM), integrados en pipelines de CI/CD para asegurar una cobertura de regresión consistente y repetible en cada release.",
        "Realicé pruebas de API con Postman sobre integraciones REST y ejecuté escaneos con OWASP ZAP y revisiones de dependencias para identificar vulnerabilidades y validar el manejo seguro de datos en todos los proyectos.",
        "Validé el rendimiento, la escalabilidad y la estabilidad bajo distintas condiciones de carga con K6, detectando cuellos de botella y riesgos de estabilidad antes de los despliegues a producción.",
        "Fui responsable del triage de defectos en JIRA, priorizando los issues por severidad e impacto en el negocio para mantener la entrega en tiempo.",
        "Validé el renderizado de contenido, la integridad de datos y el comportamiento de los flujos en aplicaciones basadas en CMS construidas con Contentful, Sanity, Netlify y Drupal.",
        "Colaboré con desarrolladores y PMs en sprints de Agile Scrum para definir criterios de aceptación y validar los entregables contra los requerimientos del producto.",
      ],
    },
    {
      ...EN.work[2],
      badges: ["Presencial"],
      title: "Practicante de QA y Testing",
      description: [
        "Desarrollé una aplicación en C# que daba soporte a más de 200 usuarios concurrentes que gestionaban más de 800 registros diarios en SQL Server; diseñé el esquema completo de la base de datos y fui el único responsable de QA en pruebas funcionales, de regresión y de validación de datos.",
        "Validé la exactitud de los datos directamente en SQL Server escribiendo queries para verificar la integridad de los registros, detectar anomalías y confirmar el almacenamiento correcto en todas las operaciones de base de datos.",
        "Construí dashboards en Power BI para apoyar la gestión del laboratorio, el análisis de productividad y los reportes ejecutivos, transformando datos operativos en bruto en información accionable para el negocio.",
      ],
    },
  ],
  skills: [
    { ...EN.skills[0], category: "Programación" },
    { ...EN.skills[1], category: "Frameworks y herramientas de testing" },
    { ...EN.skills[2], category: "Rendimiento y seguridad" },
    { ...EN.skills[3], category: "Accesibilidad y observabilidad" },
    { ...EN.skills[4], category: "CI/CD y DevOps" },
    { ...EN.skills[5], category: "Gestión de proyectos" },
    { ...EN.skills[6], category: "Plataformas e integraciones" },
    { ...EN.skills[7], category: "Herramientas de IA" },
    { ...EN.skills[8], category: "Datos y diseño" },
    { ...EN.skills[9], category: "Metodologías de testing" },
  ],
  languages: [
    { language: "Inglés", proficiency: "C1 Avanzado" },
    { language: "Español", proficiency: "Nativo" },
    { language: "Italiano", proficiency: "Básico" },
  ],
  projects: [
    {
      ...EN.projects[0],
      description:
        "Dashboard de pruebas agregado que recopila reportes JSON de varios repositorios de proyectos de QA mediante la API de GitHub y reconstruye un dashboard unificado en vivo con cada push. Compatible con los reporters de Playwright y Jest.",
    },
    {
      ...EN.projects[1],
      description:
        "La página QA Playground tiene mini aplicaciones web que uso para demostrar mis habilidades de testing. Creé un repositorio en GitHub que contiene el código de la automatización de pruebas y del pipeline de CI/CD.",
    },
    {
      ...EN.projects[2],
      description:
        "Colección de Postman para la API de Restful Booker que cubre escenarios de happy path, negativos, edge cases, de seguridad y de rendimiento. Automatizada con Newman y GitHub Actions, con reportes HTML publicados en GitHub Pages.",
    },
    {
      ...EN.projects[3],
      description:
        "Aplicación web de CV personal, creada a partir de un fork de una plantilla open source y ampliada con soporte para modo oscuro y una suite de pruebas unitarias. Incluye 96 pruebas unitarias con 73.26% de cobertura de líneas y un mutation score de 75.47% validado con Stryker Mutator.",
    },
  ],
  ui: {
    sections: {
      about: "Acerca de",
      work: "Experiencia laboral",
      education: "Educación",
      skills: "Habilidades",
      certifications: "Certificaciones y cursos",
      languages: "Idiomas",
      projects: "Proyectos",
    },
    present: "Actual",
    githubRepo: "Repo en GitHub",
    theme: {
      toggle: "Cambiar tema",
      light: "Claro",
      dark: "Oscuro",
      system: "Sistema",
    },
    languageToggle: "Cambiar idioma",
  },
};
