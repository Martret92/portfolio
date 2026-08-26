import type { Locale } from '../i18n/config';

export const professionalLinks = {
  email: 'jaime.martret@gmail.com',
  github: 'https://github.com/Martret92',
  linkedin: 'https://www.linkedin.com/in/jaime-martret/',
  credential:
    'https://www.credly.com/badges/77c61d68-3aea-4011-83ba-060dbde3f766/public_url',
} as const;

export const publicCvPath = '/jaime-martret-full-stack-cv.pdf';

const professionalProfiles = {
  en: {
    metadata: {
      title: 'Jaime Martret — Junior Full Stack Developer',
      description:
        'Junior Full Stack Developer based in Barcelona, focused on backend development, REST APIs, data modelling and maintainable web applications.',
    },
    identity: 'Jaime Martret',
    navigationLabel: 'Primary navigation',
    navigation: {
      home: 'Home',
      work: 'Work',
      stack: 'Stack',
      about: 'About',
      cv: 'CV',
      contact: 'Contact',
    },
    hero: {
      eyebrow: 'Full Stack Developer · Backend-oriented',
      heading:
        'Build reliable systems and turn them into real product experiences.',
      introduction:
        'I build backend-oriented web applications around clear APIs, reliable data models and maintainable architecture, then connect those systems to useful product experiences.',
      workCta: 'View my work',
      cvCta: 'View CV',
      contactCta: 'Contact me',
    },
    about: {
      heading: 'About',
      paragraphs: [
        'I’m interested in understanding how a product works beyond its interface: how data is validated, how responsibilities are organised and how consistency is maintained across the system.',
        'I’m currently completing the IFCD0112 professional certificate and building practical projects involving frontend, backend, databases, testing, Docker and CI/CD. My previous professional experience has also given me a strong foundation in organisation, customer service, coordination and day-to-day operations.',
      ],
    },
    capabilities: {
      heading: 'Technical capabilities',
      introduction:
        'A capability map grounded in the systems, interfaces and delivery workflows shown above.',
      groups: [
        {
          title: 'Backend',
          description:
            'APIs, application rules, realtime coordination and relational data.',
          items: [
            'Python',
            'Django REST Framework',
            'Node.js',
            'Express',
            'REST APIs',
            'Socket.IO',
            'PostgreSQL',
            'SQL',
          ],
          evidence:
            'Explicit domain rules, contextual permissions, server authority and durable persistence.',
        },
        {
          title: 'Frontend',
          description:
            'Responsive, accessible interfaces that make application state understandable.',
          items: [
            'JavaScript',
            'TypeScript',
            'React',
            'Astro',
            'HTML',
            'CSS',
            'Responsive Design',
          ],
          evidence:
            'Static editorial delivery, browser-native workflows and realtime product feedback.',
        },
        {
          title: 'Engineering',
          description:
            'Tests, containers and delivery checks that keep changes reproducible.',
          items: [
            'Git',
            'Docker',
            'Testing',
            'GitHub Actions',
            'CI/CD',
            'OpenAPI',
            'Linux',
          ],
          evidence:
            'Automated quality gates, PostgreSQL integration, container builds and documented API contracts.',
        },
      ],
    },
    experience: {
      heading: 'Professional experience',
      entries: [
        {
          company: 'BonÀrea',
          role: 'Cashier / Stock Replenisher',
          meta: 'Barcelona · Nov 2024 – Present',
          summary:
            'Customer service, stock replenishment, checkout and point-of-sale organisation.',
        },
        {
          company: 'Bluespace Self-Storage',
          role: 'Junior Store Manager',
          meta: 'L’Hospitalet de Llobregat · May 2018 – Aug 2019',
          summary:
            'Operational and commercial management, CRM, inventory, billing, forecasting and reporting.',
        },
        {
          company: 'Starbucks Coffee Company',
          role: 'Supervisor',
          meta: 'Barcelona · Oct 2015 – Apr 2018',
          summary:
            'Team coordination and training, daily operations, SAP and reporting.',
        },
      ],
    },
    education: {
      heading: 'Education and certification',
      entries: [
        {
          title:
            'IFCD0112 — Object-oriented programming and relational databases',
          institution: 'Grup CIEF, Barcelona',
          dates: 'Mar 2026 – Nov 2026',
          status: 'In progress',
        },
        {
          title: 'Microsoft Certified: Azure AI Fundamentals (AI-900)',
          institution: 'Microsoft',
          dates: 'Jul 2026',
          status: 'View verified credential',
          href: professionalLinks.credential,
          accessibleLabel:
            'View verified Microsoft Azure AI Fundamentals credential',
        },
        {
          title: 'University studies in Electronic Systems',
          institution: 'Universitat Politècnica de Catalunya',
          dates: '2011–2015',
          status: 'Studies not completed',
        },
      ],
    },
    contact: {
      heading: 'Contact',
      introduction:
        'I’m open to junior Full Stack and backend-oriented opportunities where I can continue learning, contribute to real products and strengthen my engineering practice.',
      emailLabel: 'Email',
      githubLabel: 'GitHub profile',
      linkedinLabel: 'LinkedIn profile',
      cvLabel: 'Download CV',
    },
    footer: 'Jaime Martret · Junior Full Stack Developer · Barcelona',
  },
  es: {
    metadata: {
      title: 'Jaime Martret — Desarrollador Full Stack Junior',
      description:
        'Desarrollador Full Stack Junior en Barcelona, orientado a backend, APIs REST, modelado de datos y aplicaciones web mantenibles.',
    },
    identity: 'Jaime Martret',
    navigationLabel: 'Navegación principal',
    navigation: {
      home: 'Inicio',
      work: 'Proyectos',
      stack: 'Stack',
      about: 'Sobre mí',
      cv: 'CV',
      contact: 'Contacto',
    },
    hero: {
      eyebrow: 'Desarrollador Full Stack · Orientación backend',
      heading:
        'Construyo sistemas fiables y los convierto en experiencias de producto reales.',
      introduction:
        'Desarrollo aplicaciones web con orientación backend mediante APIs claras, modelos de datos fiables y una arquitectura mantenible, y conecto esos sistemas con experiencias de producto útiles.',
      workCta: 'Ver mi trabajo',
      cvCta: 'Ver CV',
      contactCta: 'Contactar',
    },
    about: {
      heading: 'Sobre mí',
      paragraphs: [
        'Me interesa comprender cómo funciona un producto más allá de su interfaz: cómo se validan los datos, cómo se organizan las responsabilidades y cómo se mantiene la coherencia entre las distintas partes del sistema.',
        'Actualmente curso el certificado profesional IFCD0112 y desarrollo proyectos prácticos con frontend, backend, bases de datos, testing, Docker y CI/CD. Mi experiencia profesional anterior también me ha dado una base sólida en organización, atención al cliente, coordinación y operativa diaria.',
      ],
    },
    capabilities: {
      heading: 'Capacidades técnicas',
      introduction:
        'Un mapa de capacidades basado en los sistemas, interfaces y flujos de entrega mostrados arriba.',
      groups: [
        {
          title: 'Backend',
          description:
            'APIs, reglas de aplicación, coordinación realtime y datos relacionales.',
          items: [
            'Python',
            'Django REST Framework',
            'Node.js',
            'Express',
            'APIs REST',
            'Socket.IO',
            'PostgreSQL',
            'SQL',
          ],
          evidence:
            'Reglas de dominio explícitas, permisos contextuales, autoridad del servidor y persistencia duradera.',
        },
        {
          title: 'Frontend',
          description:
            'Interfaces responsive y accesibles que hacen comprensible el estado de la aplicación.',
          items: [
            'JavaScript',
            'TypeScript',
            'React',
            'Astro',
            'HTML',
            'CSS',
            'Diseño responsive',
          ],
          evidence:
            'Entrega editorial estática, flujos nativos del navegador y feedback de producto realtime.',
        },
        {
          title: 'Ingeniería',
          description:
            'Tests, contenedores y controles de entrega que mantienen los cambios reproducibles.',
          items: [
            'Git',
            'Docker',
            'Testing',
            'GitHub Actions',
            'CI/CD',
            'OpenAPI',
            'Linux',
          ],
          evidence:
            'Quality gates automatizados, integración PostgreSQL, builds de contenedores y contratos de API documentados.',
        },
      ],
    },
    experience: {
      heading: 'Experiencia profesional',
      entries: [
        {
          company: 'BonÀrea',
          role: 'Reponedor / Cajero',
          meta: 'Barcelona · Nov. 2024 – Actualidad',
          summary:
            'Atención al cliente, reposición, caja y organización del punto de venta.',
        },
        {
          company: 'Bluespace Self-Storage',
          role: 'Jr. Store Manager',
          meta: 'L’Hospitalet de Llobregat · May. 2018 – Ago. 2019',
          summary:
            'Gestión operativa y comercial, CRM, inventario, facturación, previsiones y reporting.',
        },
        {
          company: 'Starbucks Coffee Company',
          role: 'Supervisor',
          meta: 'Barcelona · Oct. 2015 – Abr. 2018',
          summary:
            'Coordinación y formación de equipos, operativa diaria, SAP y reporting.',
        },
      ],
    },
    education: {
      heading: 'Formación y certificación',
      entries: [
        {
          title:
            'IFCD0112 — Programación con lenguajes orientados a objetos y bases de datos relacionales',
          institution: 'Grup CIEF, Barcelona',
          dates: 'Mar. 2026 – Nov. 2026',
          status: 'En curso',
        },
        {
          title: 'Microsoft Certified: Azure AI Fundamentals (AI-900)',
          institution: 'Microsoft',
          dates: 'Jul. 2026',
          status: 'Ver credencial verificada',
          href: professionalLinks.credential,
          accessibleLabel:
            'Ver credencial verificada Microsoft Azure AI Fundamentals',
        },
        {
          title: 'Estudios universitarios en Sistemas Electrónicos',
          institution: 'Universitat Politècnica de Catalunya',
          dates: '2011–2015',
          status: 'Estudios no finalizados',
        },
      ],
    },
    contact: {
      heading: 'Contacto',
      introduction:
        'Estoy abierto a oportunidades junior Full Stack y con orientación backend en las que pueda seguir aprendiendo, contribuir a productos reales y reforzar mi práctica de ingeniería.',
      emailLabel: 'Correo electrónico',
      githubLabel: 'Perfil de GitHub',
      linkedinLabel: 'Perfil de LinkedIn',
      cvLabel: 'Descargar CV',
    },
    footer: 'Jaime Martret · Desarrollador Full Stack Junior · Barcelona',
  },
} as const satisfies Record<Locale, object>;

export function getProfessionalProfile(locale: Locale) {
  return professionalProfiles[locale];
}
