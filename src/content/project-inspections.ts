import type { Locale } from '../i18n/config';
import { validateProjectInspectionModel } from '../lib/inspection';
import type { ProjectId } from './projects';
import type {
  ProductSystemMapping,
  ProjectInspectionModel,
  InspectionEvidence,
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
    type: 'dependency',
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
const evidenceIds = [
  'generation-boundary',
  'configuration-invalidation',
  'multiple-output-representations',
] as const;

const evidenceTechnicalContent = {
  'generation-boundary': {
    snippets: [
      {
        startLine: 1,
        code: "import { fakerES as faker } from '@faker-js/faker'",
      },
      {
        startLine: 144,
        code: `export function generateData({
  templateId,
  selectedFields,
  numberRecords,
}) {
  const generateRecord = recordGenerators[templateId]

  return Array.from({ length: numberRecords }, (_, index) =>
    generateRecord(selectedFields, index),
  )
}`,
      },
    ],
  },
  'configuration-invalidation': {
    snippets: [
      {
        startLine: 91,
        code: `setSelectedTemplate(templateId)
setSelectedFields(newTemplate.fields.map((field) => field.id))
setGeneratedData([])`,
      },
      {
        startLine: 96,
        code: `const handleFieldChange = (fieldId) => {
  setSelectedFields((currentFields) =>
    currentFields.includes(fieldId)
      ? currentFields.filter((id) => id !== fieldId)
      : [...currentFields, fieldId],
  )
  setGeneratedData([])
}`,
      },
      {
        startLine: 105,
        code: `const handleNumberRecordsChange = (value) => {
  setNumberRecords(value)
  setGeneratedData([])
}`,
      },
    ],
  },
  'multiple-output-representations': {
    formats: [
      {
        id: 'json',
        label: 'JSON',
        content: `[
  {
    "nombre": "Ana Torres",
    "email": "ana.torres@example.com"
  }
]`,
      },
      {
        id: 'csv',
        label: 'CSV',
        content: `"nombre";"email"
"Ana Torres";"ana.torres@example.com"`,
      },
      {
        id: 'sql',
        label: 'SQL',
        content:
          "INSERT INTO usuarios (nombre, email) VALUES ('Ana Torres', 'ana.torres@example.com');",
      },
    ],
  },
} as const;

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
      },
      faker: {
        label: 'Faker',
        role: 'Provides fake values used by generation.',
      },
      'generated-data': {
        label: 'generatedData',
        role: 'Stores the current generated records as the shared result of one generation.',
        invalidationTriggers: [
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
        implementationNotes: [
          'Table preview and JSON preview consume the same generatedData.',
        ],
        relatedDecisionIds: ['single-generated-result'],
      },
      export: {
        label: 'Export',
        role: 'Routes generatedData into copy and download transformations.',
        relatedDecisionIds: ['single-generated-result'],
      },
      serializers: {
        label: 'Output serializers',
        role: 'Transforms generatedData into JSON, CSV or SQL output.',
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
    evidence: {
      'generation-boundary': {
        type: 'source',
        placementProductId: 'generate',
        relatedNodeIds: ['generate-data', 'faker'],
        provenance: 'src/utils/generateData.js',
        title: 'Generation stays behind one utility boundary',
        annotation:
          'The utility imports Faker, selects the configured record generator and creates the requested records through generateData().',
      },
      'configuration-invalidation': {
        type: 'source',
        placementProductId: 'result',
        relatedNodeIds: ['configuration-state', 'generated-data'],
        provenance: 'src/App.jsx',
        title: 'Configuration changes clear the shared result',
        annotation:
          'Template, selected-field and quantity handlers each clear generatedData after changing configuration.',
      },
      'multiple-output-representations': {
        type: 'output',
        placementProductId: 'export',
        relatedNodeIds: ['generated-data', 'export', 'serializers'],
        provenance: 'Illustrative Users record',
        title: 'One result, three serialized representations',
        annotation:
          'The same illustrative record is shown as JSON, semicolon-delimited CSV and a downloadable SQL INSERT statement.',
        illustrativeLabel: 'Illustrative data, not a recorded execution',
      },
    },
    connectionLabels: {
      flow: 'Data flow',
      dependency: 'Dependency',
      invalidation: 'Invalidates when configuration changes',
    },
    labels: {
      perspectiveLegend: 'Project perspective',
      productPerspective: 'Product',
      systemPerspective: 'System',
      productHeading: 'How the product works',
      productIntroduction:
        'A compact view of configuring, generating, inspecting and reusing one dataset.',
      inspectSystemLabel: 'Inspect system',
      systemHeading: 'How the same flow is structured',
      systemIntroduction:
        'Open the product flow to inspect the state, generation boundary and downstream consumers beneath it.',
      exampleLabel: 'Illustrative configuration',
      inspectorHeading: 'Inspector',
      inspectorEmpty: 'Select a node to inspect its role and relationships.',
      roleLabel: 'Role',
      relationshipsLabel: 'Relationships',
      relationshipLabels: {
        producedBy: 'Produced by',
        produces: 'Produces',
        consumedBy: 'Consumed by',
        receivesFrom: 'Receives from',
        dependsOn: 'Depends on',
        usedBy: 'Used by',
        invalidatedBy: 'Invalidated by',
        invalidates: 'Invalidates',
        flowsTo: 'Flows to',
        relatedTo: 'Related to',
      },
      invalidationTriggersLabel: 'When',
      whyItMattersLabel: 'Why it matters',
      implementationNotesLabel: 'Implementation notes',
      relatedDecisionsLabel: 'Why this design?',
      topologyHeading: 'System flow',
      invalidationHeading: 'Separate invalidation rule',
      decisionsHeading: 'Related technical decisions',
      decisionsIntroduction:
        'Open either verified decision when its context is useful.',
      decisionItemLabel: 'Decision',
      decisionContextLabel: 'Context',
      decisionLabel: 'Decision',
      consequenceLabel: 'Consequence',
      evidenceTypeLabels: { source: 'Source', output: 'Output' },
      viewEvidenceLabel: 'View evidence',
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
    example: ['Users', '3 records', '4 fields'],
    productVisual: {
      src: '/images/projects/devdata/devdata-product-overview.png',
      optimizedSrc: '/images/projects/devdata/devdata-product-overview.jpg',
      width: 1440,
      height: 1205,
      alt: 'DevData Generator configured with the Users template and three generated records shown in a table.',
      caption:
        'The real DevData interface connects dataset configuration, generation, preview and export in one workflow.',
    },
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
      },
      faker: {
        label: 'Faker',
        role: 'Proporciona los valores ficticios usados durante la generación.',
      },
      'generated-data': {
        label: 'generatedData',
        role: 'Guarda los registros actuales como resultado compartido de una generación.',
        invalidationTriggers: [
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
        implementationNotes: [
          'La tabla y la vista JSON consumen el mismo generatedData.',
        ],
        relatedDecisionIds: ['single-generated-result'],
      },
      export: {
        label: 'Exportación',
        role: 'Dirige generatedData hacia las transformaciones de copia y descarga.',
        relatedDecisionIds: ['single-generated-result'],
      },
      serializers: {
        label: 'Serializadores de salida',
        role: 'Transforma generatedData en salida JSON, CSV o SQL.',
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
    evidence: {
      'generation-boundary': {
        type: 'source',
        placementProductId: 'generate',
        relatedNodeIds: ['generate-data', 'faker'],
        provenance: 'src/utils/generateData.js',
        title: 'La generación queda tras un único límite de utilidad',
        annotation:
          'La utilidad importa Faker, elige el generador de registros configurado y crea los registros solicitados mediante generateData().',
      },
      'configuration-invalidation': {
        type: 'source',
        placementProductId: 'result',
        relatedNodeIds: ['configuration-state', 'generated-data'],
        provenance: 'src/App.jsx',
        title: 'Los cambios de configuración borran el resultado compartido',
        annotation:
          'Los manejadores de plantilla, campos seleccionados y cantidad borran generatedData tras cambiar la configuración.',
      },
      'multiple-output-representations': {
        type: 'output',
        placementProductId: 'export',
        relatedNodeIds: ['generated-data', 'export', 'serializers'],
        provenance: 'Registro de Usuarios ilustrativo',
        title: 'Un resultado, tres representaciones serializadas',
        annotation:
          'El mismo registro ilustrativo se muestra como JSON, CSV delimitado por punto y coma y una sentencia INSERT SQL descargable.',
        illustrativeLabel: 'Datos ilustrativos, no una ejecución registrada',
      },
    },
    connectionLabels: {
      flow: 'Flujo de datos',
      dependency: 'Dependencia',
      invalidation: 'Invalida al cambiar la configuración',
    },
    labels: {
      perspectiveLegend: 'Perspectiva del proyecto',
      productPerspective: 'Producto',
      systemPerspective: 'Sistema',
      productHeading: 'Cómo funciona el producto',
      productIntroduction:
        'Una vista compacta de cómo configurar, generar, inspeccionar y reutilizar un dataset.',
      inspectSystemLabel: 'Inspeccionar sistema',
      systemHeading: 'Cómo se estructura el mismo flujo',
      systemIntroduction:
        'Abre el flujo de producto para inspeccionar el estado, el límite de generación y sus consumidores.',
      exampleLabel: 'Configuración ilustrativa',
      inspectorHeading: 'Inspector',
      inspectorEmpty:
        'Selecciona un nodo para inspeccionar su función y relaciones.',
      roleLabel: 'Función',
      relationshipsLabel: 'Relaciones',
      relationshipLabels: {
        producedBy: 'Producido por',
        produces: 'Produce',
        consumedBy: 'Usado por',
        receivesFrom: 'Recibe de',
        dependsOn: 'Depende de',
        usedBy: 'Usado por',
        invalidatedBy: 'Invalidado por',
        invalidates: 'Invalida',
        flowsTo: 'Fluye hacia',
        relatedTo: 'Relacionado con',
      },
      invalidationTriggersLabel: 'Cuándo',
      whyItMattersLabel: 'Por qué importa',
      implementationNotesLabel: 'Notas de implementación',
      relatedDecisionsLabel: '¿Por qué este diseño?',
      topologyHeading: 'Flujo del sistema',
      invalidationHeading: 'Regla de invalidación separada',
      decisionsHeading: 'Decisiones técnicas relacionadas',
      decisionsIntroduction:
        'Abre cualquiera de las decisiones verificadas cuando necesites su contexto.',
      decisionItemLabel: 'Decisión',
      decisionContextLabel: 'Contexto',
      decisionLabel: 'Decisión',
      consequenceLabel: 'Consecuencia',
      evidenceTypeLabels: { source: 'Fuente', output: 'Salida' },
      viewEvidenceLabel: 'Ver evidencia',
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
    example: ['Usuarios', '3 registros', '4 campos'],
    productVisual: {
      src: '/images/projects/devdata/devdata-product-overview.png',
      optimizedSrc: '/images/projects/devdata/devdata-product-overview.jpg',
      width: 1440,
      height: 1205,
      alt: 'DevData Generator configurado con la plantilla Usuarios y tres registros generados mostrados en una tabla.',
      caption:
        'La interfaz real de DevData conecta la configuración del dataset, la generación, la vista previa y la exportación en un mismo flujo.',
    },
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
  const evidence: readonly InspectionEvidence[] = evidenceIds.map((id) => {
    if (id === 'multiple-output-representations') {
      return {
        id,
        ...content.evidence[id],
        ...evidenceTechnicalContent[id],
      };
    }
    return {
      id,
      ...content.evidence[id],
      ...evidenceTechnicalContent[id],
    };
  });
  const model: ProjectInspectionModel = {
    projectId: 'devdata-generator',
    productElements,
    systemNodes,
    connections: localizedConnections,
    mappings,
    decisions,
    evidence,
    productVisual: content.productVisual,
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
