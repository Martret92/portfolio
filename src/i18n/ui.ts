import type { Locale } from './config';

const ui = {
  en: {
    language: {
      navigationLabel: 'Language selection',
      switchTo: 'Español',
      current: 'English',
    },
    foundation: {
      title: 'Portfolio',
      heading: 'Localization foundation',
      description:
        'The English route is generated statically. Portfolio content arrives in the next milestones.',
    },
    home: {
      title: 'Developer portfolio — temporary home',
      description:
        'Temporary portfolio home introducing the developer and featured work.',
      siteIdentity: 'Developer Name',
      siteIdentityStatus: 'Placeholder identity',
      navigationLabel: 'Primary navigation',
      navigation: {
        home: 'Home',
        featuredWork: 'Featured work',
      },
      eyebrow: 'Portfolio draft',
      heading: 'Software work, presented with clarity.',
      introduction:
        'This is temporary introductory copy for validating the portfolio structure and bilingual experience.',
      projectCta: 'Explore featured work',
      featuredWorkLabel: 'Featured work',
      projectLink: 'View DevData Generator project route',
      footer: 'Temporary portfolio foundation.',
    },
    caseStudy: {
      titleSuffix: 'Temporary case study',
      label: 'Case-study shell',
      backHome: 'Back to Home',
      viewMode: {
        label: 'Choose a project perspective',
        explanation:
          'Both perspectives remain available below. Choose one to emphasize it.',
      },
      sections: {
        overview: {
          title: 'Overview',
          placeholder:
            'Temporary overview placeholder. Project details will be added in a later milestone.',
        },
        product: {
          title: 'Product view',
          placeholder:
            'Temporary Product View placeholder. No product claims are included yet.',
        },
        system: {
          title: 'System view',
          placeholder:
            'Temporary System View placeholder. Technical structure is intentionally deferred.',
        },
        decisions: {
          title: 'Technical decisions',
          placeholder:
            'Temporary decisions placeholder. Verified technical context will be added later.',
        },
      },
    },
    architectureExplorer: {
      title: 'Temporary architecture explorer',
      description:
        'Generic demonstration structure only. It does not represent the verified project architecture.',
      detailsLabel: 'Selected component details',
      connectionsLabel: 'Temporary connections',
      category: 'Placeholder layer',
      connection: 'Temporary structural connection',
      nodes: {
        interface: {
          label: 'Interface',
          description:
            'Temporary placeholder for an entry point in a generic system.',
        },
        application: {
          label: 'Application',
          description:
            'Temporary placeholder for a generic application component.',
        },
        data: {
          label: 'Data',
          description: 'Temporary placeholder for a generic data component.',
        },
      },
    },
    decisionDisclosure: {
      heading: 'Temporary decision examples',
      items: {
        boundary: {
          title: 'Temporary decision example',
          summary: 'Generic summary for demonstrating progressive disclosure.',
          detail:
            'This is provisional demonstration content. A verified project decision will replace it after project inspection.',
          tradeoffLabel: 'Tradeoff placeholder',
          tradeoffValue:
            'No project-specific tradeoff is asserted in this temporary example.',
        },
        alternative: {
          title: 'Second temporary decision example',
          summary:
            'Another neutral example showing that disclosures can remain open together.',
          detail:
            'This placeholder demonstrates the reusable structure only and does not describe a DevData decision.',
        },
      },
    },
  },
  es: {
    language: {
      navigationLabel: 'Selección de idioma',
      switchTo: 'English',
      current: 'Español',
    },
    foundation: {
      title: 'Portfolio',
      heading: 'Base de localización',
      description:
        'La ruta en español se genera de forma estática. El contenido del portfolio llegará en los siguientes hitos.',
    },
    home: {
      title: 'Portfolio de desarrollo — inicio temporal',
      description:
        'Inicio temporal del portfolio para presentar a la persona desarrolladora y el trabajo destacado.',
      siteIdentity: 'Nombre de desarrollo',
      siteIdentityStatus: 'Identidad provisional',
      navigationLabel: 'Navegación principal',
      navigation: {
        home: 'Inicio',
        featuredWork: 'Trabajo destacado',
      },
      eyebrow: 'Borrador del portfolio',
      heading: 'Trabajo de software presentado con claridad.',
      introduction:
        'Este texto introductorio es temporal y sirve para validar la estructura del portfolio y la experiencia bilingüe.',
      projectCta: 'Explorar trabajo destacado',
      featuredWorkLabel: 'Trabajo destacado',
      projectLink: 'Ver la ruta del proyecto DevData Generator',
      footer: 'Base temporal del portfolio.',
    },
    caseStudy: {
      titleSuffix: 'Caso de estudio temporal',
      label: 'Estructura del caso de estudio',
      backHome: 'Volver al inicio',
      viewMode: {
        label: 'Elegir una perspectiva del proyecto',
        explanation:
          'Ambas perspectivas siguen disponibles. Elige una para destacarla.',
      },
      sections: {
        overview: {
          title: 'Resumen',
          placeholder:
            'Marcador temporal del resumen. Los detalles del proyecto se añadirán en un hito posterior.',
        },
        product: {
          title: 'Vista de producto',
          placeholder:
            'Marcador temporal de la Vista de producto. Todavía no se incluyen afirmaciones sobre el producto.',
        },
        system: {
          title: 'Vista de sistema',
          placeholder:
            'Marcador temporal de la Vista de sistema. La estructura técnica se reserva para más adelante.',
        },
        decisions: {
          title: 'Decisiones técnicas',
          placeholder:
            'Marcador temporal de decisiones. El contexto técnico verificado se añadirá más adelante.',
        },
      },
    },
    architectureExplorer: {
      title: 'Explorador temporal de arquitectura',
      description:
        'Estructura genérica de demostración. No representa la arquitectura verificada del proyecto.',
      detailsLabel: 'Detalles del componente seleccionado',
      connectionsLabel: 'Conexiones temporales',
      category: 'Capa provisional',
      connection: 'Conexión estructural temporal',
      nodes: {
        interface: {
          label: 'Interfaz',
          description:
            'Marcador temporal para un punto de entrada de un sistema genérico.',
        },
        application: {
          label: 'Aplicación',
          description:
            'Marcador temporal para un componente de aplicación genérico.',
        },
        data: {
          label: 'Datos',
          description:
            'Marcador temporal para un componente de datos genérico.',
        },
      },
    },
    decisionDisclosure: {
      heading: 'Ejemplos temporales de decisiones',
      items: {
        boundary: {
          title: 'Ejemplo temporal de decisión',
          summary: 'Resumen genérico para demostrar la divulgación progresiva.',
          detail:
            'Este contenido es provisional. Una decisión verificada del proyecto lo sustituirá después de inspeccionarlo.',
          tradeoffLabel: 'Marcador temporal de contrapartida',
          tradeoffValue:
            'Este ejemplo temporal no afirma ninguna contrapartida específica del proyecto.',
        },
        alternative: {
          title: 'Segundo ejemplo temporal de decisión',
          summary:
            'Otro ejemplo neutral que muestra que varias secciones pueden permanecer abiertas.',
          detail:
            'Este marcador demuestra únicamente la estructura reutilizable y no describe una decisión de DevData.',
        },
      },
    },
  },
} as const satisfies Record<Locale, object>;

export function useTranslations(locale: Locale) {
  return ui[locale];
}
