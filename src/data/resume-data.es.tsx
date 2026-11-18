import {RESUME_DATA_EN} from './resume-data.en';
import type {ResumeData} from './resume-data.types';

const EN = RESUME_DATA_EN;

export const RESUME_DATA_ES: ResumeData = {
  ...EN,
  locations: [
    {...EN.locations[0], name: 'España'},
    {...EN.locations[1], name: 'México'},
  ],
  about: 'QA Engineer | SDET potenciado con IA',
  summary:
    'QA Engineer con {years} de experiencia participando en y liderando estrategias de calidad end-to-end en más de 15 proyectos de e-commerce, salud, logística y finanzas, en entornos dinámicos de consultoría de TI. Tengo capacidad comprobada para hacerme cargo de todo el ciclo de vida de pruebas, desde el análisis de requerimientos y la validación shift-left hasta la integración en CI/CD y el triage de defectos, adaptándome rápidamente a distintas industrias, equipos y stacks tecnológicos. Combino sólidas habilidades de automatización (Playwright, Cypress, Jest) y dominio de pruebas de API (Postman, Pact) con experiencia práctica en plataformas empresariales como Salesforce, HubSpot y Stripe. Aprovecho flujos de trabajo potenciados con IA, como sistemas multiagente, agent skills personalizadas y corrección autónoma de fallas en CI/CD con Claude Code y MCP, para acelerar la entrega y reducir la intervención manual. Me desenvuelvo con soltura en equipos distribuidos e internacionales y aporto más allá de QA cuando se necesita.',
  education: [
    {
      ...EN.education[0],
      degree:
        'Máster Universitario en Ingeniería Informática (especialidad en Big Data)',
    },
    {
      ...EN.education[1],
      degree: 'Ingeniería Mecatrónica',
    },
  ],
  work: [
    {
      ...EN.work[0],
      badges: ['Remoto'],
      title: 'Quality Engineer',
      description: [
        'Lideré la estrategia de calidad end-to-end de una plataforma CMS basada en Sitecore, abarcando pruebas funcionales, SIT, UAT, de regresión y de accesibilidad.',
        'Apliqué prácticas shift-left revisando diseños de UI/UX y analizando tickets en busca de ambigüedades antes del desarrollo, evitando retrabajo en etapas tardías al resolver a tiempo los huecos en los requerimientos.',
        'Elaboré planes y estrategias de prueba para cada ciclo de release, definiendo alcance, criterios de entrada/salida, cobertura de riesgos y requerimientos de ambientes, alineados con los objetivos del sprint y del negocio.',
        'Diseñé y ejecuté casos de prueba mediante partición de equivalencia, análisis de valores límite y técnicas exploratorias, asegurando la cobertura de todos los flujos de usuario y edge cases.',
        'Integré la automatización E2E y de regresión con Playwright en pipelines de Azure DevOps, reduciendo el esfuerzo de regresión manual y permitiendo una entrega continua confiable a lo largo de los ciclos de release.',
        'Identifiqué y di seguimiento a incumplimientos de accesibilidad WCAG 2.1 con axe y Google Lighthouse, coordinando su corrección con los desarrolladores para lograr el cumplimiento de la ADA en todas las páginas de la plataforma.',
        'Creé y ejecuté escenarios de pruebas de pico y de carga con k6, identificando cuellos de botella de rendimiento en condiciones de tráfico máximo y validando los umbrales de estabilidad del sistema antes de cada release a producción.',
        'Realicé el triage de defectos y gestioné work items en Azure Boards, priorizándolos por severidad e impacto en el negocio, y coordiné la planeación de sprints para mantener la cadencia de releases y los quality gates.',
        'Redacté documentación de QA, incluyendo planes de prueba, repositorios de casos de prueba, lineamientos de taxonomía de defectos y checklists de release para estandarizar las prácticas de calidad en el equipo.',
        'Validé registros de leads en Salesforce Marketing Cloud verificando el mapeo de campos, los tipos de datos y los triggers de workflows, asegurando la integridad de los datos en los pipelines de automatización de marketing.',
      ],
    },
    {
      ...EN.work[1],
      badges: ['Remoto'],
      title: 'QA Engineer',
      description: [
        'Me hice cargo de la entrega de QA end-to-end en varios proyectos simultáneos de clientes de e-commerce, salud y logística, adaptando las estrategias de prueba a distintos stacks tecnológicos y ritmos de trabajo.',
        'Analicé los requerimientos en cuanto a claridad, completitud y testeabilidad, traduciéndolos en planes de prueba que definían estrategia, alcance, ambientes y criterios de entrada/salida alineados con los objetivos de cada proyecto.',
        'Cubrí con pruebas manuales y automatizadas las fases funcional, de integración, de sistema y de UAT, incluida la creación de datos de prueba y suites de regresión, y detecté de forma constante defectos críticos antes de los releases a producción.',
        'Desarrollé y mantuve frameworks de automatización con Playwright usando el patrón Page Object Model (POM) y los integré en pipelines de CI/CD para lograr una cobertura de regresión consistente y repetible en cada release.',
        'Realicé pruebas de API con Postman sobre integraciones REST y ejecuté escaneos con OWASP ZAP y revisiones de dependencias para identificar vulnerabilidades y validar el manejo seguro de datos en los distintos proyectos.',
        'Ejecuté pruebas de carga con k6 bajo distintas condiciones para validar el rendimiento, la escalabilidad y la estabilidad, detectando cuellos de botella y riesgos antes de los despliegues a producción.',
        'Lideré el triage de defectos en Jira, priorizando los issues por severidad e impacto en el negocio para cumplir las entregas en tiempo y forma.',
        'Probé el renderizado de contenido, la integridad de datos y el comportamiento de los flujos en aplicaciones basadas en CMS construidas con Contentful, Sanity, Netlify CMS (Decap) y Drupal.',
        'Colaboré con desarrolladores y PMs en sprints de Agile Scrum para definir criterios de aceptación y validar que los entregables cumplieran con los requerimientos del producto.',
      ],
    },
    {
      ...EN.work[2],
      badges: ['Presencial'],
      title: 'Practicante de QA y Testing',
      description: [
        'Desarrollé una aplicación en C# que daba soporte a más de 200 usuarios concurrentes que gestionaban más de 800 registros diarios en SQL Server; diseñé el esquema completo de la base de datos y fui el único responsable de QA en pruebas funcionales, de regresión y de validación de datos.',
        'Escribí queries en SQL Server para verificar la exactitud de los datos y la integridad de los registros, detectar anomalías y confirmar el almacenamiento correcto en todas las operaciones de base de datos.',
        'Construí dashboards en Power BI para apoyar la gestión del laboratorio, el análisis de productividad y los reportes ejecutivos, convirtiendo datos operativos sin procesar en información accionable para el negocio.',
      ],
    },
  ],
  skills: [
    {...EN.skills[0], category: 'Programación'},
    {...EN.skills[1], category: 'Frameworks y herramientas de testing'},
    {...EN.skills[2], category: 'Rendimiento y seguridad'},
    {...EN.skills[3], category: 'Accesibilidad y observabilidad'},
    {...EN.skills[4], category: 'CI/CD y DevOps'},
    {...EN.skills[5], category: 'Gestión de proyectos'},
    {...EN.skills[6], category: 'Plataformas e integraciones'},
    {...EN.skills[7], category: 'Herramientas de IA'},
    {...EN.skills[8], category: 'Datos y diseño'},
    {...EN.skills[9], category: 'Metodologías de testing'},
  ],
  languages: [
    {language: 'Inglés', proficiency: 'C1 (Avanzado)'},
    {language: 'Español', proficiency: 'Nativo'},
    {language: 'Italiano', proficiency: 'Básico'},
  ],
  projects: [
    {
      ...EN.projects[0],
      description:
        'Dashboard que consolida resultados de pruebas: recopila reportes JSON de varios repositorios de proyectos de QA mediante la API de GitHub y se reconstruye en vivo con cada push. Compatible con los reporters de Playwright y Jest.',
    },
    {
      ...EN.projects[1],
      description:
        'Suite de automatización de pruebas con Playwright para las mini aplicaciones web de QA Playground, creada para demostrar habilidades de automatización de pruebas, con un pipeline de CI/CD en GitHub Actions y un dashboard de pruebas publicado.',
    },
    {
      ...EN.projects[2],
      description:
        'Colección de Postman para la API de Restful Booker que cubre escenarios de happy path, negativos, de edge cases, de seguridad y de rendimiento. Automatizada con Newman y GitHub Actions, con reportes HTML publicados en GitHub Pages.',
    },
    {
      ...EN.projects[3],
      description:
        'Aplicación web de CV personal, creada a partir de un fork de una plantilla open source y ampliada con soporte para modo oscuro y una suite de pruebas unitarias. Incluye más de 140 pruebas unitarias en las versiones EN y ES, validadas con mutation testing mediante Stryker Mutator.',
    },
  ],
  ui: {
    sections: {
      about: 'Acerca de',
      work: 'Experiencia laboral',
      education: 'Educación',
      skills: 'Habilidades',
      certifications: 'Certificaciones y cursos',
      languages: 'Idiomas',
      projects: 'Proyectos',
    },
    present: 'Actual',
    verified: 'Verificado',
    githubRepo: 'Repo en GitHub',
    theme: {
      toggle: 'Cambiar tema',
      light: 'Claro',
      dark: 'Oscuro',
      system: 'Sistema',
    },
    languageToggle: 'Cambiar idioma',
    contact: {
      email: 'Enviar un correo',
      call: 'Llamar al',
      showPhones: 'Ver teléfonos',
      copy: 'Copiar',
      copyEmail: 'Copiar correo',
      copied: 'Copiado ✓',
      profiles: {
        GitHub: 'Perfil de GitHub',
        LinkedIn: 'Perfil de LinkedIn',
      },
      print: 'Imprimir o guardar como PDF',
      saveContact: 'Guardar contacto',
    },
    print: {
      qrCaption: 'Versión en línea: rcastillo.dev',
    },
    notFound: {
      title: 'Página no encontrada',
      description: 'La página que buscas no existe.',
      backHome: 'Volver al CV',
    },
    skipToContent: 'Saltar al contenido',
    error: {
      title: 'Algo salió mal',
      description:
        'Ocurrió un error inesperado. Puedes intentarlo de nuevo o volver al CV.',
      retry: 'Intentar de nuevo',
      backHome: 'Volver al CV',
    },
    privacy: {
      link: 'Privacidad',
      title: 'Privacidad',
      intro:
        'Esta es la web de mi CV. Aquí te cuento qué mido cuando la visitas y qué no.',
      sections: [
        {
          title: 'Quién soy',
          paragraphs: [
            'Soy Roberto Castillo y esta web es mía. Si tienes cualquier duda sobre tus datos, escríbeme a {email}.',
          ],
        },
        {
          title: 'Qué mido',
          paragraphs: [
            'Uso PostHog, en su nube europea de Frankfurt, para contar las visitas y cuánto duran, también las que llegan a páginas que no existen. PostHog no guarda tu dirección IP: la elimina en cuanto llega la visita. También recoge mediciones básicas de la velocidad de carga. No se graban sesiones ni se crean perfiles de visitantes.',
            'También cuento qué enlaces y botones del CV se usan (contacto, incluido copiar el correo o un teléfono, mostrar los teléfonos y guardar la tarjeta de contacto, perfiles, proyectos, certificados, idioma, tema e impresión, desde el botón de imprimir o desde el navegador) para saber qué partes resultan útiles. Cuando se copia o se llama a un teléfono, solo guardo el país del número. No registro lo que escribes, por dónde mueves el ratón ni lo que haces fuera de este sitio.',
            'Vercel Web Analytics también cuenta visitas, de forma agregada y sin cookies, y muestra aproximadamente desde qué país llegan sin guardar tu dirección IP. Vercel aloja la web, así que sus servidores guardan los registros habituales (IP y tipo de navegador) para poder servir las páginas.',
          ],
        },
        {
          title: 'Sin cookies',
          paragraphs: [
            'Esta web no usa cookies. Tu navegador solo recuerda el idioma y el tema que eliges (en localStorage), para que sigan igual la próxima vez. Puedes borrarlos desde los ajustes del navegador.',
          ],
        },
        {
          title: 'Para qué',
          paragraphs: [
            'Quiero saber cuánta gente ve mi CV y qué partes usa. La base legal es mi interés legítimo (art. 6.1.f del RGPD).',
          ],
        },
        {
          title: 'Dónde están los datos',
          paragraphs: [
            'PostHog guarda los datos en la UE. Vercel es una empresa de EE. UU., así que su parte se apoya en el Marco de Privacidad de Datos UE-EE. UU. y en cláusulas contractuales tipo.',
          ],
        },
        {
          title: 'Cuánto tiempo',
          paragraphs: [
            'Los datos de analítica no incluyen direcciones IP, nombres, cookies ni datos de contacto. Se guardan como mucho el plazo estándar de cada proveedor, y no los vendo ni se los paso a nadie.',
          ],
        },
        {
          title: 'Tus derechos',
          paragraphs: [
            'Puedes pedirme que te enseñe, corrija o borre tus datos, o que deje de usarlos o limite su uso. Solo tienes que escribirme a {email}. También puedes reclamar ante la Agencia Española de Protección de Datos (AEPD) en {aepd}.',
          ],
        },
      ],
      lastUpdatedLabel: 'Última actualización',
      lastUpdated: '18 de noviembre de 2026',
    },
  },
};
