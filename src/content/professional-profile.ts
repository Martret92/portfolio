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
      about: 'About',
      contact: 'Contact',
    },
    hero: {
      eyebrow: 'Full Stack Developer · Backend-oriented',
      heading:
        'I build web applications on clear, maintainable technical foundations.',
      introduction:
        'I’m Jaime Martret, a junior Full Stack Developer based in Barcelona. I work mainly with Python, Django, JavaScript, React, SQL and PostgreSQL, with a particular interest in backend development, REST APIs, data modelling and software quality.',
      workCta: 'Explore selected work',
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
      groups: [
        {
          title: 'Backend and data',
          items: [
            'Python',
            'Django',
            'Node.js',
            'Express',
            'REST APIs',
            'PostgreSQL',
            'SQL',
          ],
        },
        {
          title: 'Frontend',
          items: [
            'JavaScript',
            'TypeScript',
            'React',
            'HTML',
            'CSS',
            'Responsive Design',
          ],
        },
        {
          title: 'Engineering workflow',
          items: [
            'Git',
            'GitHub',
            'Docker',
            'Testing',
            'GitHub Actions',
            'CI/CD',
          ],
        },
      ],
      secondary:
        'Also used: Vite, Bootstrap, MySQL, SQLite, Linux and Postman.',
    },
    experience: {
      heading: 'Previous professional experience',
      entries: [
        {
          company: 'BonÀrea',
          role: 'Store assistant / Cashier',
          meta: 'Barcelona · Nov 2024 – Jan 2026',
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
      about: 'Sobre mí',
      contact: 'Contacto',
    },
    hero: {
      eyebrow: 'Desarrollador Full Stack · Orientación backend',
      heading:
        'Construyo aplicaciones web sobre bases técnicas claras y mantenibles.',
      introduction:
        'Soy Jaime Martret, desarrollador Full Stack Junior en Barcelona. Trabajo principalmente con Python, Django, JavaScript, React, SQL y PostgreSQL, con especial interés en backend, APIs REST, modelado de datos y calidad del software.',
      workCta: 'Explorar trabajo seleccionado',
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
      groups: [
        {
          title: 'Backend y datos',
          items: [
            'Python',
            'Django',
            'Node.js',
            'Express',
            'APIs REST',
            'PostgreSQL',
            'SQL',
          ],
        },
        {
          title: 'Frontend',
          items: [
            'JavaScript',
            'TypeScript',
            'React',
            'HTML',
            'CSS',
            'Diseño responsive',
          ],
        },
        {
          title: 'Flujo de ingeniería',
          items: [
            'Git',
            'GitHub',
            'Docker',
            'Testing',
            'GitHub Actions',
            'CI/CD',
          ],
        },
      ],
      secondary:
        'También he utilizado: Vite, Bootstrap, MySQL, SQLite, Linux y Postman.',
    },
    experience: {
      heading: 'Experiencia profesional anterior',
      entries: [
        {
          company: 'BonÀrea',
          role: 'Reponedor / Cajero',
          meta: 'Barcelona · Nov. 2024 – Ene. 2026',
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
