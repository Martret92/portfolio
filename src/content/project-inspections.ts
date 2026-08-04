import type { Locale } from '../i18n/config';
import { validateProjectInspectionModel } from '../lib/inspection';
import type { ProjectId } from './projects';
import type {
  ProductSystemMapping,
  ProjectInspectionModel,
  SystemConnection,
  SystemNode,
  SystemNodeInspection,
} from '../types/inspection';

const connections = [
  {
    id: 'configuration-validation',
    from: 'configuration-state',
    to: 'validation',
    type: 'flow',
  },
  {
    id: 'validation-generation',
    from: 'validation',
    to: 'generate-data',
    type: 'flow',
  },
  {
    id: 'faker-generation',
    from: 'faker',
    to: 'generate-data',
    type: 'flow',
  },
  {
    id: 'generation-result',
    from: 'generate-data',
    to: 'generated-data',
    type: 'flow',
  },
  {
    id: 'result-preview',
    from: 'generated-data',
    to: 'preview',
    type: 'flow',
  },
  {
    id: 'result-export',
    from: 'generated-data',
    to: 'export',
    type: 'flow',
  },
  {
    id: 'export-serializers',
    from: 'export',
    to: 'serializers',
    type: 'flow',
  },
  {
    id: 'serializers-browser',
    from: 'serializers',
    to: 'browser-apis',
    type: 'flow',
  },
  {
    id: 'configuration-invalidates-result',
    from: 'configuration-state',
    to: 'generated-data',
    type: 'invalidation',
  },
] as const;

const mappings = [
  { productId: 'configure', systemNodeIds: ['configuration-state'] },
  {
    productId: 'generate',
    systemNodeIds: ['validation', 'generate-data', 'faker'],
  },
  { productId: 'result', systemNodeIds: ['generated-data'] },
  { productId: 'preview', systemNodeIds: ['preview'] },
  {
    productId: 'export',
    systemNodeIds: ['export', 'serializers', 'browser-apis'],
  },
] as const satisfies readonly ProductSystemMapping[];

const productLayoutPositions = {
  configure: 'primary-start',
  generate: 'primary-middle',
  result: 'primary-end',
  preview: 'secondary-start',
  export: 'secondary-end',
} as const;
const productIds = Object.keys(
  productLayoutPositions,
) as readonly (keyof typeof productLayoutPositions)[];
const decisionIds = [
  'single-generated-result',
  'invalidate-stale-result',
] as const;

const localized = {
  en: {
    productElements: {
      configure: {
        label: 'Configure dataset',
        summary: 'Choose template, fields and number of records.',
      },
      generate: {
        label: 'Generate',
        summary: 'Create the configured fake records.',
      },
      result: {
        label: 'Generated dataset',
        summary: 'The records produced from the current configuration.',
      },
      preview: {
        label: 'Inspect result',
        summary: 'View the same records as a table or JSON.',
      },
      export: {
        label: 'Reuse result',
        summary: 'Copy or download the generated records as JSON, CSV or SQL.',
      },
    },
    nodes: {
      'configuration-state': {
        label: 'Configuration state',
        role: 'Holds selected template, fields and record quantity.',
        implementationNotes: [
          'App coordinates the shared workflow state.',
          'No Redux or other global state library is used.',
        ],
      },
      validation: {
        label: 'Validation',
        role: 'Checks quantity and whether at least one field is selected.',
      },
      'generate-data': {
        label: 'generateData()',
        role: 'Creates the configured records using the generator associated with the selected template.',
        consumes: ['Configuration state', 'Faker'],
      },
      faker: {
        label: 'Faker',
        role: 'Provides fake values used by generation.',
        consumedBy: ['generateData()'],
      },
      'generated-data': {
        label: 'generatedData',
        role: 'Stores the current generated records as the shared result of one generation.',
        producedBy: ['generateData()'],
        consumedBy: ['Preview', 'Export'],
        invalidatedWhen: [
          'Template changes',
          'Selected fields change',
          'Quantity changes',
        ],
        whyItMatters: [
          'All visible and downloadable outputs represent the same generation.',
        ],
        relatedDecisionIds: [
          'single-generated-result',
          'invalidate-stale-result',
        ],
      },
      preview: {
        label: 'Preview',
        role: 'Presents generatedData as Table or formatted JSON.',
        consumes: ['generatedData'],
        implementationNotes: [
          'Table preview and JSON preview consume the same generatedData.',
        ],
        relatedDecisionIds: ['single-generated-result'],
      },
      export: {
        label: 'Export',
        role: 'Routes generatedData into copy and download transformations.',
        consumes: ['generatedData'],
        relatedDecisionIds: ['single-generated-result'],
      },
      serializers: {
        label: 'Output serializers',
        role: 'Transforms generatedData into JSON, CSV or SQL output.',
        consumes: ['generatedData'],
        implementationNotes: [
          'JSON preview, copy and download reuse the same JSON serializer.',
          'CSV and SQL use dedicated serializers.',
          'SQL output is downloaded as INSERT statements; it is not executed.',
          'The app has no database.',
        ],
      },
      'browser-apis': {
        label: 'Browser APIs',
        role: 'Handles clipboard and file downloads in the browser.',
        consumes: ['Serialized output'],
        implementationNotes: ['File download uses browser-native APIs.'],
      },
    },
    decisions: {
      'single-generated-result': {
        title: 'Why one shared generated result?',
        summary: 'Preview and exports reuse one generated dataset.',
        context: 'Preview and exports need to represent the same generation.',
        decision:
          'Generate once, store the result in generatedData, and let downstream consumers reuse it.',
        consequence: 'Preview and export paths do not regenerate Faker data.',
      },
      'invalidate-stale-result': {
        title: 'Why clear results after configuration changes?',
        summary:
          'A changed configuration invalidates the previously generated records.',
        context:
          'Old generated data no longer corresponds to a changed template, field or quantity configuration.',
        decision: 'Clear generatedData when those inputs change.',
        consequence:
          'The UI returns to the empty, result-needed state until the user generates again.',
      },
    },
    connectionLabels: {
      flow: 'Data flow',
      invalidation: 'Invalidates when configuration changes',
    },
    labels: {
      perspectiveLegend: 'Inspect the project perspective',
      productPerspective: 'Product',
      systemPerspective: 'System',
      productHeading: 'How the product works',
      productIntroduction:
        'A compact view of configuring, generating, inspecting and reusing one dataset.',
      systemHeading: 'How the same flow is structured',
      systemIntroduction:
        'Open the product flow to inspect the state, generation boundary and downstream consumers beneath it.',
      exampleLabel: 'Illustrative configuration',
      inspectorHeading: 'Inspector',
      inspectorEmpty: 'Select a node to inspect its role.',
      roleLabel: 'Role',
      producedByLabel: 'Produced by',
      consumesLabel: 'Consumes',
      consumedByLabel: 'Consumed by',
      invalidatedWhenLabel: 'Invalidated when',
      whyItMattersLabel: 'Why it matters',
      implementationNotesLabel: 'Implementation notes',
      relatedDecisionsLabel: 'Related decisions',
      topologyHeading: 'System flow',
      invalidationHeading: 'Separate invalidation rule',
      decisionsHeading: 'Related technical decisions',
      decisionsIntroduction:
        'Open either verified decision when its context is useful.',
      decisionContextLabel: 'Context',
      decisionLabel: 'Decision',
      consequenceLabel: 'Consequence',
      kindLabels: {
        input: 'Input state',
        process: 'Process',
        dependency: 'Dependency',
        state: 'Shared state',
        consumer: 'Consumer',
        serializer: 'Serializer',
        platform: 'Platform',
      },
    },
    example: ['Users', '10 records', '6 fields'],
  },
  es: {
    productElements: {
      configure: {
        label: 'Configurar dataset',
        summary: 'Elegir plantilla, campos y número de registros.',
      },
      generate: {
        label: 'Generar',
        summary: 'Crear los registros ficticios configurados.',
      },
      result: {
        label: 'Dataset generado',
        summary: 'Los registros producidos con la configuración actual.',
      },
      preview: {
        label: 'Inspeccionar resultado',
        summary: 'Ver los mismos registros como tabla o JSON.',
      },
      export: {
        label: 'Reutilizar resultado',
        summary:
          'Copiar o descargar los registros generados como JSON, CSV o SQL.',
      },
    },
    nodes: {
      'configuration-state': {
        label: 'Estado de configuración',
        role: 'Mantiene la plantilla, los campos y la cantidad de registros seleccionados.',
        implementationNotes: [
          'App coordina el estado compartido del flujo.',
          'No se usa Redux ni otra biblioteca de estado global.',
        ],
      },
      validation: {
        label: 'Validación',
        role: 'Comprueba la cantidad y que haya al menos un campo seleccionado.',
      },
      'generate-data': {
        label: 'generateData()',
        role: 'Crea los registros configurados usando el generador asociado a la plantilla seleccionada.',
        consumes: ['Estado de configuración', 'Faker'],
      },
      faker: {
        label: 'Faker',
        role: 'Proporciona los valores ficticios usados durante la generación.',
        consumedBy: ['generateData()'],
      },
      'generated-data': {
        label: 'generatedData',
        role: 'Guarda los registros actuales como resultado compartido de una generación.',
        producedBy: ['generateData()'],
        consumedBy: ['Vista previa', 'Exportación'],
        invalidatedWhen: [
          'Cambia la plantilla',
          'Cambian los campos seleccionados',
          'Cambia la cantidad',
        ],
        whyItMatters: [
          'Todas las salidas visibles y descargables representan la misma generación.',
        ],
        relatedDecisionIds: [
          'single-generated-result',
          'invalidate-stale-result',
        ],
      },
      preview: {
        label: 'Vista previa',
        role: 'Presenta generatedData como tabla o JSON con formato.',
        consumes: ['generatedData'],
        implementationNotes: [
          'La tabla y la vista JSON consumen el mismo generatedData.',
        ],
        relatedDecisionIds: ['single-generated-result'],
      },
      export: {
        label: 'Exportación',
        role: 'Dirige generatedData hacia las transformaciones de copia y descarga.',
        consumes: ['generatedData'],
        relatedDecisionIds: ['single-generated-result'],
      },
      serializers: {
        label: 'Serializadores de salida',
        role: 'Transforma generatedData en salida JSON, CSV o SQL.',
        consumes: ['generatedData'],
        implementationNotes: [
          'La vista, copia y descarga JSON reutilizan el mismo serializador JSON.',
          'CSV y SQL usan serializadores dedicados.',
          'La salida SQL se descarga como sentencias INSERT; no se ejecuta.',
          'La aplicación no tiene base de datos.',
        ],
      },
      'browser-apis': {
        label: 'APIs del navegador',
        role: 'Gestiona el portapapeles y las descargas de archivos en el navegador.',
        consumes: ['Salida serializada'],
        implementationNotes: [
          'La descarga de archivos usa APIs nativas del navegador.',
        ],
      },
    },
    decisions: {
      'single-generated-result': {
        title: '¿Por qué un único resultado generado compartido?',
        summary:
          'La vista previa y las exportaciones reutilizan el mismo dataset generado.',
        context:
          'La vista previa y las exportaciones deben representar la misma generación.',
        decision:
          'Generar una vez, guardar el resultado en generatedData y reutilizarlo en los consumidores posteriores.',
        consequence:
          'Las rutas de vista previa y exportación no vuelven a generar datos con Faker.',
      },
      'invalidate-stale-result': {
        title: '¿Por qué borrar el resultado al cambiar la configuración?',
        summary:
          'Una configuración modificada invalida los registros generados anteriormente.',
        context:
          'Los datos anteriores dejan de corresponder con una plantilla, campos o cantidad modificados.',
        decision: 'Borrar generatedData cuando cambian esas entradas.',
        consequence:
          'La interfaz vuelve al estado vacío, pendiente de generar, hasta una nueva generación.',
      },
    },
    connectionLabels: {
      flow: 'Flujo de datos',
      invalidation: 'Invalida al cambiar la configuración',
    },
    labels: {
      perspectiveLegend: 'Inspeccionar la perspectiva del proyecto',
      productPerspective: 'Producto',
      systemPerspective: 'Sistema',
      productHeading: 'Cómo funciona el producto',
      productIntroduction:
        'Una vista compacta de cómo configurar, generar, inspeccionar y reutilizar un dataset.',
      systemHeading: 'Cómo se estructura el mismo flujo',
      systemIntroduction:
        'Abre el flujo de producto para inspeccionar el estado, el límite de generación y sus consumidores.',
      exampleLabel: 'Configuración ilustrativa',
      inspectorHeading: 'Inspector',
      inspectorEmpty: 'Selecciona un nodo para inspeccionar su función.',
      roleLabel: 'Función',
      producedByLabel: 'Producido por',
      consumesLabel: 'Consume',
      consumedByLabel: 'Consumido por',
      invalidatedWhenLabel: 'Se invalida cuando',
      whyItMattersLabel: 'Por qué importa',
      implementationNotesLabel: 'Notas de implementación',
      relatedDecisionsLabel: 'Decisiones relacionadas',
      topologyHeading: 'Flujo del sistema',
      invalidationHeading: 'Regla de invalidación separada',
      decisionsHeading: 'Decisiones técnicas relacionadas',
      decisionsIntroduction:
        'Abre cualquiera de las decisiones verificadas cuando necesites su contexto.',
      decisionContextLabel: 'Contexto',
      decisionLabel: 'Decisión',
      consequenceLabel: 'Consecuencia',
      kindLabels: {
        input: 'Estado de entrada',
        process: 'Proceso',
        dependency: 'Dependencia',
        state: 'Estado compartido',
        consumer: 'Consumidor',
        serializer: 'Serializador',
        platform: 'Plataforma',
      },
    },
    example: ['Usuarios', '10 registros', '6 campos'],
  },
} as const;

const nodeDefinitions = [
  ['configuration-state', 'input'],
  ['validation', 'process'],
  ['generate-data', 'process'],
  ['faker', 'dependency'],
  ['generated-data', 'state'],
  ['preview', 'consumer'],
  ['export', 'consumer'],
  ['serializers', 'serializer'],
  ['browser-apis', 'platform'],
] as const satisfies readonly [string, SystemNode['kind']][];

function createModel(locale: Locale): ProjectInspectionModel {
  const content = localized[locale];
  const productElements = productIds.map((id) => ({
    id,
    ...content.productElements[id],
    layoutPosition: productLayoutPositions[id],
  }));
  const systemNodes: readonly SystemNode[] = nodeDefinitions.map(
    ([id, kind]) => {
      const node = content.nodes[id] as SystemNodeInspection & {
        readonly label: string;
      };
      const { label, ...inspection } = node;

      return {
        id,
        kind,
        label,
        inspection,
      };
    },
  );
  const localizedConnections: readonly SystemConnection[] = connections.map(
    (connection) => ({
      ...connection,
      label: content.connectionLabels[connection.type],
    }),
  );
  const decisions = decisionIds.map((id) => ({
    id,
    ...content.decisions[id],
  }));
  const model: ProjectInspectionModel = {
    projectId: 'devdata-generator',
    productElements,
    systemNodes,
    connections: localizedConnections,
    mappings,
    decisions,
    example: content.example,
    labels: content.labels,
  };

  validateProjectInspectionModel(model);
  return model;
}

const devDataInspectionModels = {
  en: createModel('en'),
  es: createModel('es'),
} as const satisfies Record<Locale, ProjectInspectionModel>;

export function getProjectInspectionModel(
  projectId: ProjectId,
  locale: Locale,
): ProjectInspectionModel {
  if (projectId !== 'devdata-generator') {
    throw new Error(
      `Missing inspection model for project ${String(projectId)}`,
    );
  }

  return devDataInspectionModels[locale];
}
