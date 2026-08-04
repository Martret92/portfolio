import type { Locale } from '../../i18n/config';

export const duckyArenaRepository = 'https://github.com/Martret92/DuckyArena';

const shared = {
  stack: [
    'React',
    'JavaScript',
    'Node.js',
    'Express',
    'PostgreSQL',
    'Docker',
    'REST API',
  ],
  architectureLayers: [
    'React client',
    'feature service',
    'shared API client',
    'Express routes',
    'middleware',
    'controllers',
    'models',
    'PostgreSQL',
  ],
  infrastructure: ['backend', 'PostgreSQL', 'pgAdmin'],
  endpoints: [
    'GET /api/profiles/:id/dashboard',
    'GET /api/profiles/:id/stats',
    'GET /api/profiles/:id/inventory',
    'GET /api/ranking',
    'GET /api/characters/:id/abilities',
  ],
  constraints: [
    'UNIQUE (match_id, profile_id)',
    'UNIQUE (profile_id, cosmetic_id)',
    'UNIQUE (profile_id, quest_id)',
    'CHECK (profile_id <> friend_id)',
  ],
} as const;

const localized = {
  en: {
    metadata: {
      title: 'DuckyArena — Collaborative full stack case study',
      description:
        'A collaborative educational game case study focused on backend architecture, REST API design, PostgreSQL integrity, Docker and React integration.',
    },
    home: {
      eyebrow: 'Selected project · Collaborative work',
      title: 'DuckyArena',
      summary:
        'Collaborative full stack educational game. Backend-focused contribution across REST API design, PostgreSQL integrity, Docker infrastructure and React integration.',
      stackLabel: 'Project stack',
      cta: 'Explore case study',
    },
    hero: {
      eyebrow: 'Collaborative full stack project · Backend & integration focus',
      heading:
        'Evolving a collaborative game backend into a more structured full stack system.',
      introduction:
        'DuckyArena is an educational multiplayer game project built with React, Node.js, Express, PostgreSQL and Docker. My contribution focused on backend architecture, API design, database integrity, infrastructure and frontend integration.',
      backHome: 'Back to Home',
    },
    context: {
      heading: 'Project context',
      copy: 'DuckyArena began as a three-person educational project. The system was developed collaboratively across backend modules, database design and application features. My work focused primarily on backend architecture, API design, integration and technical consolidation.',
    },
    contribution: {
      heading: 'My contribution',
      paragraphs: [
        'My main contribution was on the backend and integration side of the project. I implemented and expanded REST endpoints, refactored controllers to move PostgreSQL queries into dedicated model layers, introduced reusable validation and error middleware, strengthened database integrity constraints, and Dockerized the backend with automatic PostgreSQL initialization.',
        'As the project evolved, I also added aggregate read endpoints for frontend use cases and implemented the first React-to-API integration path through a shared HTTP client and feature-specific service.',
      ],
    },
    architecture: {
      heading: 'System architecture',
      copy: 'The current system follows a lightweight client-server architecture. React consumes the REST API through a shared HTTP client, while the backend separates routing, HTTP handling and SQL access into distinct layers.',
      flowLabel: 'Application request path',
      infrastructureHeading: 'Local infrastructure',
      infrastructureLabel: 'Docker Compose services',
      composeLabel: 'Docker Compose',
      healthcheck: 'backend waits for PostgreSQL health check',
      initialization: 'database/init.sql initializes PostgreSQL',
    },
    evidenceHeading: 'Technical evidence',
    evidence: {
      separation: {
        label: 'Evidence 01 · Backend structure',
        heading: 'Separating HTTP from data access',
        copy: 'Some backend modules originally executed PostgreSQL queries directly inside controllers. I refactored these modules so controllers handled request/response concerns while dedicated model files owned SQL access.',
        before: 'Before',
        after: 'After',
        http: 'HTTP handling',
        sql: 'SQL access',
      },
      endpoints: {
        label: 'Evidence 02 · API design',
        heading: 'Designing API responses around frontend needs',
        copy: 'I added aggregate read endpoints for use cases such as profile dashboards, player statistics, inventory, rankings and character abilities, reducing the need for the frontend to reconstruct related data from multiple basic requests.',
      },
      integrity: {
        label: 'Evidence 03 · Data integrity',
        heading: 'Enforcing data invariants in PostgreSQL',
        copy: 'I strengthened relationship tables with database-level constraints that prevent duplicate or invalid states.',
      },
      middleware: {
        label: 'Evidence 04 · API consistency',
        heading: 'Centralising repeated API concerns',
        copy: 'I introduced reusable ID validation and shared 404/error middleware so common validation and error behaviour did not need to be duplicated across individual routes.',
        limitation:
          'Some inherited controllers still return direct HTTP 500 responses; error handling is not yet fully centralised.',
        steps: [
          'request',
          'ID validation',
          'route / controller',
          '404 / error handling',
        ],
      },
      docker: {
        label: 'Evidence 05 · Infrastructure',
        heading: 'Making local backend setup reproducible',
        copy: 'I Dockerized the Express backend and configured PostgreSQL initialization through database/init.sql, with service health checks coordinating backend startup.',
      },
      integration: {
        label: 'Evidence 06 · Frontend integration',
        heading: 'Connecting the first frontend feature to the API',
        copy: 'I introduced a reusable HTTP client and a character-specific service, then connected the React characters page to the REST API with loading, error, retry and request-cancellation handling.',
        steps: [
          'CharactersPage',
          'charactersService',
          'apiClient',
          'GET /api/characters',
        ],
      },
    },
    status: {
      heading: 'Current status',
      copy: 'DuckyArena is still under active development. The backend and PostgreSQL model cover the current game domains, the React application has its initial navigation and the first API-backed feature is connected. Authentication, broader frontend integration, automated tests and CI are still pending.',
    },
    continuation: {
      heading: 'Independent continuation',
      copy: 'The project originated in a shared repository. I later continued its technical development in a separate repository to maintain a clearer development path and continue evolving the architecture independently.',
    },
    repositoryCta: 'View repository',
  },
  es: {
    metadata: {
      title: 'DuckyArena — Caso de estudio full stack colaborativo',
      description:
        'Caso de estudio de un videojuego educativo colaborativo centrado en arquitectura backend, API REST, integridad PostgreSQL, Docker e integración con React.',
    },
    home: {
      eyebrow: 'Proyecto seleccionado · Trabajo colaborativo',
      title: 'DuckyArena',
      summary:
        'Videojuego educativo full stack colaborativo. Contribución centrada en diseño de API REST, integridad PostgreSQL, infraestructura Docker e integración con React.',
      stackLabel: 'Stack del proyecto',
      cta: 'Explorar caso de estudio',
    },
    hero: {
      eyebrow:
        'Proyecto full stack colaborativo · Foco en backend e integración',
      heading:
        'Evolucionando un backend colaborativo hacia un sistema full stack más estructurado.',
      introduction:
        'DuckyArena es un proyecto educativo de videojuego multijugador construido con React, Node.js, Express, PostgreSQL y Docker. Mi contribución se centró en arquitectura backend, diseño de API, integridad de datos, infraestructura e integración con el frontend.',
      backHome: 'Volver al inicio',
    },
    context: {
      heading: 'Contexto del proyecto',
      copy: 'DuckyArena nació como un proyecto educativo colaborativo de tres personas. El sistema se desarrolló de forma compartida entre módulos de backend, diseño de base de datos y funcionalidades de aplicación. Mi trabajo se centró principalmente en arquitectura backend, diseño de API, integración y consolidación técnica.',
    },
    contribution: {
      heading: 'Mi contribución',
      paragraphs: [
        'Mi contribución principal se centró en el backend y la integración del proyecto. Implementé y amplié endpoints REST, refactoricé controladores para mover las consultas PostgreSQL a capas de modelos dedicadas, introduje middleware reutilizable de validación y errores, reforcé las restricciones de integridad de la base de datos y dockericé el backend con inicialización automática de PostgreSQL.',
        'A medida que evolucionó el proyecto, también añadí endpoints agregados orientados a necesidades del frontend e implementé la primera integración React–API mediante un cliente HTTP compartido y un servicio específico de funcionalidad.',
      ],
    },
    architecture: {
      heading: 'Arquitectura del sistema',
      copy: 'El sistema actual sigue una arquitectura cliente-servidor ligera. React consume la API REST mediante un cliente HTTP compartido, mientras que el backend separa rutas, gestión HTTP y acceso SQL en capas diferenciadas.',
      flowLabel: 'Ruta de una petición de la aplicación',
      infrastructureHeading: 'Infraestructura local',
      infrastructureLabel: 'Servicios de Docker Compose',
      composeLabel: 'Docker Compose',
      healthcheck: 'el backend espera al health check de PostgreSQL',
      initialization: 'database/init.sql inicializa PostgreSQL',
    },
    evidenceHeading: 'Evidencia técnica',
    evidence: {
      separation: {
        label: 'Evidencia 01 · Estructura backend',
        heading: 'Separación entre HTTP y acceso a datos',
        copy: 'Algunos módulos del backend ejecutaban originalmente consultas PostgreSQL directamente desde los controladores. Refactoricé esos módulos para que los controladores gestionaran las responsabilidades HTTP y los modelos dedicados concentraran el acceso SQL.',
        before: 'Antes',
        after: 'Después',
        http: 'Gestión HTTP',
        sql: 'Acceso SQL',
      },
      endpoints: {
        label: 'Evidencia 02 · Diseño de API',
        heading: 'Diseño de respuestas orientadas al frontend',
        copy: 'Añadí endpoints agregados para casos de uso como dashboard de perfil, estadísticas de jugador, inventario, ranking y habilidades de personajes, reduciendo la necesidad de que el frontend reconstruyera datos relacionados mediante múltiples peticiones básicas.',
      },
      integrity: {
        label: 'Evidencia 03 · Integridad de datos',
        heading: 'Integridad de datos en PostgreSQL',
        copy: 'Reforcé las tablas de relaciones con restricciones a nivel de base de datos para impedir estados duplicados o inválidos.',
      },
      middleware: {
        label: 'Evidencia 04 · Consistencia de API',
        heading: 'Centralización de responsabilidades repetidas',
        copy: 'Introduje validación reutilizable de IDs y middleware compartido de 404/errores para evitar duplicar comportamientos comunes entre rutas individuales.',
        limitation:
          'Algunos controladores heredados todavía devuelven respuestas HTTP 500 directas; la gestión de errores aún no está completamente centralizada.',
        steps: [
          'petición',
          'validación de ID',
          'ruta / controlador',
          'gestión 404 / errores',
        ],
      },
      docker: {
        label: 'Evidencia 05 · Infraestructura',
        heading: 'Entorno backend reproducible',
        copy: 'Dockericé el backend Express y configuré la inicialización de PostgreSQL mediante database/init.sql, utilizando health checks para coordinar el arranque de los servicios.',
      },
      integration: {
        label: 'Evidencia 06 · Integración frontend',
        heading: 'Primera integración del frontend con la API',
        copy: 'Introduje un cliente HTTP reutilizable y un servicio específico para personajes, y conecté la página React de personajes con la API REST gestionando estados de carga, error, reintento y cancelación de peticiones.',
        steps: [
          'CharactersPage',
          'charactersService',
          'apiClient',
          'GET /api/characters',
        ],
      },
    },
    status: {
      heading: 'Estado actual',
      copy: 'DuckyArena sigue en desarrollo activo. El backend y el modelo PostgreSQL cubren los dominios actuales del juego, la aplicación React cuenta con navegación inicial y la primera funcionalidad conectada a la API ya está integrada. La autenticación, una integración más amplia del frontend, los tests automatizados y CI siguen pendientes.',
    },
    continuation: {
      heading: 'Continuación independiente',
      copy: 'El proyecto se originó en un repositorio compartido. Más adelante continué su desarrollo técnico en un repositorio separado para mantener una evolución más clara y seguir desarrollando la arquitectura de forma independiente.',
    },
    repositoryCta: 'Ver repositorio',
  },
} as const satisfies Record<Locale, object>;

export function getDuckyArenaContent(locale: Locale) {
  return {
    ...localized[locale],
    ...shared,
    repository: duckyArenaRepository,
  };
}
