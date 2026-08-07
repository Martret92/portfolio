import type { Locale } from './config';

const ui = {
  en: {
    accessibility: {
      skipToContent: 'Skip to main content',
    },
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
      featuredProject: {
        eyebrow: 'Selected project',
        title: 'DevData Generator',
        summary:
          'Configure realistic datasets once, inspect one generated result and reuse it across table, JSON, CSV and SQL.',
        workflowLabel: 'Workflow',
        workflowSummary:
          'Choose a template, fields and quantity, then generate a reusable dataset.',
        resultLabel: 'Shared result',
        resultSummary:
          'One validated configuration produces one shared generatedData result for every preview and export path.',
        topologyLabel: 'DevData system flow',
        configureLabel: 'Configure',
        generateLabel: 'Generate',
        generatedDataLabel: 'generatedData',
        previewLabel: 'Preview',
        exportLabel: 'Export',
        cta: 'Explore case study',
      },
    },
    caseStudy: {
      metadata: {
        title: 'DevData Generator — Data generation case study',
        description:
          'A browser-based data generation case study focused on one shared generated result, predictable invalidation and reusable JSON, CSV and SQL outputs.',
      },
      label: 'Featured project',
      backHome: 'Back to Home',
      repositoryCta: 'View repository',
      scopeNote:
        'Runs entirely in the browser; no backend or database is required.',
      viewMode: {
        label: 'Choose a project perspective',
        explanation:
          'Both perspectives remain available below. Choose one to emphasize it.',
      },
      sections: {
        overview: {
          title: 'Overview',
          copy: 'DevData Generator is a browser-based tool for configuring realistic fake datasets and reusing one generated result across table, JSON, CSV and SQL outputs.',
        },
        product: {
          title: 'Product view',
          description:
            'Configure a dataset once, then inspect and reuse the generated result.',
        },
        system: {
          title: 'System view',
          description:
            'Inspect how one validated configuration produces the shared generated result.',
        },
        decisions: {
          title: 'Technical decisions',
          description:
            'Explore why the generated result is shared and invalidated when configuration changes.',
        },
      },
      editorial: {
        howItWorks: {
          title: 'How it works',
          copy: 'A validated configuration crosses one generation boundary, then the shared result branches into preview and export paths.',
          validateLabel: 'Validate',
          dependencyLabel: 'Faker dependency',
          previewDetail: 'Table / JSON',
          exportDetail: 'JSON / CSV / SQL',
          topologyLabel:
            'Configure flows to Validate, then Generate, then generatedData. generatedData branches to Preview and Export. Faker is a dependency of Generate.',
        },
        sharedResult: {
          title: 'One generated result',
          copy: 'One generation produces one reusable generatedData result. Table preview, JSON preview, clipboard copy and every download reuse those same records.',
          usesLabel: 'The same result is used by',
          uses: [
            'Table preview',
            'JSON preview',
            'Clipboard copy',
            'Downloads and exports',
          ],
        },
        invalidation: {
          title: 'Predictable invalidation',
          copy: 'Changing the dataset configuration clears the previous generated result so stale records are not presented as current.',
          triggersLabel: 'generatedData is cleared when',
        },
        outputs: {
          title: 'Output formats',
          copy: 'The same generatedData is serialized into three reusable representations.',
        },
        architecture: {
          title: 'Browser-only architecture',
          copy: 'React coordinates the workflow in the browser. The generation utility uses Faker, then serializers and browser-native APIs transform and deliver the shared result.',
          reactLabel: 'React',
          generationLabel: 'Generation utility + Faker',
          deliveryLabel: 'Serializers + Browser APIs',
          boundaryNote: 'No backend or database is required.',
          sqlNote: 'SQL is generated as downloadable text; it is not executed.',
        },
        sourceLabel: 'Verified source',
        illustrativeOutputLabel: 'Illustrative output',
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
    accessibility: {
      skipToContent: 'Saltar al contenido principal',
    },
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
      featuredProject: {
        eyebrow: 'Proyecto seleccionado',
        title: 'DevData Generator',
        summary:
          'Configura datasets realistas una vez, inspecciona un único resultado generado y reutilízalo en tabla, JSON, CSV y SQL.',
        workflowLabel: 'Flujo',
        workflowSummary:
          'Elige una plantilla, los campos y la cantidad, y genera un dataset reutilizable.',
        resultLabel: 'Resultado compartido',
        resultSummary:
          'Una configuración validada produce un único resultado generatedData compartido por todas las vistas y exportaciones.',
        topologyLabel: 'Flujo del sistema de DevData',
        configureLabel: 'Configurar',
        generateLabel: 'Generar',
        generatedDataLabel: 'generatedData',
        previewLabel: 'Vista previa',
        exportLabel: 'Exportar',
        cta: 'Explorar caso de estudio',
      },
    },
    caseStudy: {
      metadata: {
        title: 'DevData Generator — Caso de estudio de generación de datos',
        description:
          'Caso de estudio de generación de datos en el navegador centrado en un único resultado compartido, invalidación predecible y salidas reutilizables en JSON, CSV y SQL.',
      },
      label: 'Proyecto destacado',
      backHome: 'Volver al inicio',
      repositoryCta: 'Ver repositorio',
      scopeNote:
        'Se ejecuta completamente en el navegador; no requiere backend ni base de datos.',
      viewMode: {
        label: 'Elegir una perspectiva del proyecto',
        explanation:
          'Ambas perspectivas siguen disponibles. Elige una para destacarla.',
      },
      sections: {
        overview: {
          title: 'Resumen',
          copy: 'DevData Generator es una herramienta ejecutada en el navegador para configurar datasets ficticios realistas y reutilizar un único resultado generado en salidas de tabla, JSON, CSV y SQL.',
        },
        product: {
          title: 'Vista de producto',
          description:
            'Configura un dataset una vez y después inspecciona y reutiliza el resultado generado.',
        },
        system: {
          title: 'Vista de sistema',
          description:
            'Inspecciona cómo una configuración validada produce el resultado generado compartido.',
        },
        decisions: {
          title: 'Decisiones técnicas',
          description:
            'Explora por qué se comparte el resultado generado y se invalida cuando cambia la configuración.',
        },
      },
      editorial: {
        howItWorks: {
          title: 'Cómo funciona',
          copy: 'Una configuración validada cruza un único límite de generación y el resultado compartido se ramifica hacia las vistas previas y las exportaciones.',
          validateLabel: 'Validar',
          dependencyLabel: 'Dependencia de Faker',
          previewDetail: 'Tabla / JSON',
          exportDetail: 'JSON / CSV / SQL',
          topologyLabel:
            'Configurar fluye hacia Validar, después Generar y finalmente generatedData. generatedData se ramifica hacia Vista previa y Exportar. Faker es una dependencia de Generar.',
        },
        sharedResult: {
          title: 'Un único resultado generado',
          copy: 'Una generación produce un único resultado generatedData reutilizable. La vista de tabla, la vista JSON, la copia al portapapeles y todas las descargas reutilizan esos mismos registros.',
          usesLabel: 'El mismo resultado se utiliza en',
          uses: [
            'Vista de tabla',
            'Vista JSON',
            'Copia al portapapeles',
            'Descargas y exportaciones',
          ],
        },
        invalidation: {
          title: 'Invalidación predecible',
          copy: 'Cambiar la configuración del dataset borra el resultado generado anterior para que los registros obsoletos no se presenten como actuales.',
          triggersLabel: 'generatedData se borra cuando cambian',
        },
        outputs: {
          title: 'Formatos de salida',
          copy: 'El mismo generatedData se serializa en tres representaciones reutilizables.',
        },
        architecture: {
          title: 'Arquitectura solo en el navegador',
          copy: 'React coordina el flujo en el navegador. La utilidad de generación usa Faker y, después, los serializadores y las APIs nativas del navegador transforman y entregan el resultado compartido.',
          reactLabel: 'React',
          generationLabel: 'Utilidad de generación + Faker',
          deliveryLabel: 'Serializadores + APIs del navegador',
          boundaryNote: 'No requiere backend ni base de datos.',
          sqlNote: 'SQL se genera como texto descargable; no se ejecuta.',
        },
        sourceLabel: 'Fuente verificada',
        illustrativeOutputLabel: 'Salida ilustrativa',
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
