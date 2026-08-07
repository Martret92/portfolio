import type { Locale } from '@i18n/config';

export const questBoardLinks = {
  repository: 'https://github.com/Martret92/questboard',
  apiDocs: 'https://questboard-4tnl.onrender.com/api/docs/',
  openApi: 'https://questboard-4tnl.onrender.com/api/schema/',
  health: 'https://questboard-4tnl.onrender.com/health/',
} as const;

const shared = {
  stack: [
    'Python',
    'Django',
    'Django REST Framework',
    'PostgreSQL',
    'Docker',
    'Gunicorn',
  ],
  workflowStates: ['BACKLOG', 'READY', 'IN_PROGRESS', 'REVIEW', 'DONE'],
  roles: ['OWNER', 'REVIEWER', 'CONTRIBUTOR'],
  dependencyRules: [
    'Self-dependencies are rejected',
    'Dependencies must remain within one project',
    'Duplicate edges and cycles are rejected',
    'Every prerequisite must be DONE before READY',
  ],
  invariants: [
    'Assignees must belong to the project',
    'Assignment is frozen from IN_PROGRESS',
    'Self-approval is forbidden',
    'DONE is terminal',
    'Protected deletion preserves valid relationships',
    'Every project retains at least one OWNER',
  ],
  deliveryChecks: [
    'PostgreSQL 17',
    'Ruff lint and format',
    'Migration drift',
    'Django system checks',
    'OpenAPI validation',
    'Backend/API tests',
    'Docker image build',
  ],
} as const;

const localized = {
  en: {
    metadata: {
      title: 'QuestBoard — Dependency-aware Django API case study',
      description:
        'Backend-first Django REST API case study focused on dependency-aware workflows, contextual permissions, auditable transitions and PostgreSQL concurrency semantics.',
    },
    home: {
      eyebrow: 'Featured backend project',
      title: 'QuestBoard',
      summary:
        'Backend-first Django REST API for dependency-aware workflows, contextual permissions and auditable state transitions.',
      signal:
        'A tested and deployed PostgreSQL API where domain rules control what work can start and who may approve it.',
      stackLabel: 'Backend stack',
      workflowLabel: 'QuestBoard workflow',
      cta: 'Explore case study',
    },
    hero: {
      eyebrow: 'Backend-first project · Django REST API',
      heading:
        'Dependency-aware workflows with explicit permissions and auditable state transitions.',
      introduction:
        'QuestBoard is a Python and Django backend API for collaborative work with dependencies and review. Unlike basic task CRUD, it enforces what work can start, who can approve it, and keeps meaningful changes consistent and auditable.',
      backHome: 'Back to Home',
      repository: 'View repository',
      apiDocs: 'Live API Docs',
      stackLabel: 'Stack',
    },
    overview: {
      heading: 'Overview',
      copy: 'The project concentrates on backend rules that ordinary create, update and delete endpoints do not express well: workflow eligibility, project-scoped authority, dependency integrity, review separation and durable audit history.',
    },
    workflow: {
      heading: 'Explicit workflow',
      copy: 'Quest state changes use a dedicated transition operation rather than unrestricted PATCH behavior. Legal transitions carry their own permissions and preconditions, including a controlled review return to IN_PROGRESS.',
      label: 'Controlled quest state sequence',
    },
    dependencies: {
      heading: 'Dependency-aware progression',
      copy: 'Dependencies form a validated project-local graph. Planning operations reject invalid edges before insertion, while PostgreSQL constraints backstop duplicate and self-referential relationships. Prerequisites directly gate whether a BACKLOG quest may become READY.',
      rulesLabel: 'Dependency rules',
    },
    permissions: {
      heading: 'Contextual permissions and invariants',
      copy: 'Authorization is evaluated against project membership, role, assignment and workflow state. OWNER and REVIEWER authority is separated from CONTRIBUTOR execution, and an assignee cannot approve their own work.',
      rolesLabel: 'Project roles',
      invariantsLabel: 'Protected business invariants',
    },
    audit: {
      heading: 'Auditability',
      copy: 'QuestEvent persists significant creation, assignment, dependency and state mutations with actor, timestamp and structured context. A quest_id_snapshot keeps the historical identifier available after a legal quest deletion.',
    },
    concurrency: {
      heading: 'Transactions and concurrency',
      copy: 'Domain mutations use transaction.atomic. Quest rows are locked for concurrent state changes, while project-level select_for_update locks serialize graph-sensitive dependency writes and membership changes whose invariants span multiple rows.',
      transaction: 'transaction.atomic',
      questLock: 'Quest row · select_for_update',
      projectLock: 'Project row · graph and owner invariants',
    },
    challenge: {
      heading: 'Engineering challenge',
      copy: 'A PostgreSQL-specific failure exposed an invalid SELECT FOR UPDATE shape through the nullable assignee relation. The fix preserved locking: transition_quest now locks the Quest row only and resolves the nullable relation separately, keeping the transaction boundary and workflow invariants intact.',
    },
    delivery: {
      heading: 'Testing and delivery',
      copy: 'GitHub Actions exercises the backend against PostgreSQL 17 and validates code quality, migrations, Django configuration, the OpenAPI contract, domain/API tests and Docker image construction. The same Docker runtime is deployed through Gunicorn on Render with managed PostgreSQL.',
      checksLabel: 'Automated delivery gate',
    },
    footer: {
      repository: 'View repository',
      apiDocs: 'Live API Docs',
    },
  },
  es: {
    metadata: {
      title: 'QuestBoard — Caso de estudio de API Django con dependencias',
      description:
        'Caso de estudio de una API REST backend-first con Django, centrada en flujos con dependencias, permisos contextuales, transiciones auditables y concurrencia PostgreSQL.',
    },
    home: {
      eyebrow: 'Proyecto backend destacado',
      title: 'QuestBoard',
      summary:
        'API REST backend-first con Django para flujos con dependencias, permisos contextuales y transiciones de estado auditables.',
      signal:
        'Una API PostgreSQL probada y desplegada donde las reglas de dominio controlan qué trabajo puede comenzar y quién puede aprobarlo.',
      stackLabel: 'Stack backend',
      workflowLabel: 'Flujo de QuestBoard',
      cta: 'Explorar caso de estudio',
    },
    hero: {
      eyebrow: 'Proyecto backend-first · API REST con Django',
      heading:
        'Flujos con dependencias, permisos explícitos y transiciones de estado auditables.',
      introduction:
        'QuestBoard es una API backend con Python y Django para trabajo colaborativo con dependencias y revisión. A diferencia de un CRUD básico de tareas, controla qué trabajo puede comenzar, quién puede aprobarlo y mantiene los cambios relevantes de forma coherente y auditable.',
      backHome: 'Volver al inicio',
      repository: 'Ver repositorio',
      apiDocs: 'Documentación de la API',
      stackLabel: 'Stack',
    },
    overview: {
      heading: 'Resumen',
      copy: 'El proyecto se concentra en reglas backend que los endpoints habituales de creación, actualización y borrado no expresan bien: elegibilidad del flujo, autoridad dentro del proyecto, integridad de dependencias, separación de la revisión e historial de auditoría duradero.',
    },
    workflow: {
      heading: 'Flujo explícito',
      copy: 'Los cambios de estado utilizan una operación de transición dedicada en lugar de un PATCH sin restricciones. Cada transición legal aplica sus propios permisos y precondiciones, incluido un retorno controlado desde REVIEW a IN_PROGRESS.',
      label: 'Secuencia controlada de estados de una quest',
    },
    dependencies: {
      heading: 'Progresión basada en dependencias',
      copy: 'Las dependencias forman un grafo validado dentro de cada proyecto. Las operaciones de planificación rechazan aristas inválidas antes de insertarlas y las restricciones PostgreSQL refuerzan las relaciones duplicadas o autorreferenciales. Los prerrequisitos determinan directamente si una quest puede pasar de BACKLOG a READY.',
      rulesLabel: 'Reglas de dependencias',
    },
    permissions: {
      heading: 'Permisos contextuales e invariantes',
      copy: 'La autorización se evalúa según la membresía del proyecto, el rol, la asignación y el estado del flujo. La autoridad de OWNER y REVIEWER se separa de la ejecución de CONTRIBUTOR, y una persona asignada no puede aprobar su propio trabajo.',
      rolesLabel: 'Roles del proyecto',
      invariantsLabel: 'Invariantes de negocio protegidas',
    },
    audit: {
      heading: 'Auditabilidad',
      copy: 'QuestEvent persiste las mutaciones relevantes de creación, asignación, dependencias y estado con actor, fecha y contexto estructurado. quest_id_snapshot conserva el identificador histórico tras el borrado legal de una quest.',
    },
    concurrency: {
      heading: 'Transacciones y concurrencia',
      copy: 'Las mutaciones de dominio utilizan transaction.atomic. Las filas Quest se bloquean para cambios de estado concurrentes, mientras que los bloqueos select_for_update a nivel de proyecto serializan las escrituras del grafo y los cambios de membresía cuyas invariantes abarcan varias filas.',
      transaction: 'transaction.atomic',
      questLock: 'Fila Quest · select_for_update',
      projectLock: 'Fila Project · grafo e invariantes de OWNER',
    },
    challenge: {
      heading: 'Reto de ingeniería',
      copy: 'Un fallo específico de PostgreSQL reveló una forma inválida de SELECT FOR UPDATE a través de la relación nullable con assignee. La solución mantuvo el bloqueo: transition_quest bloquea únicamente la fila Quest y resuelve la relación nullable por separado, conservando el límite transaccional y las invariantes del flujo.',
    },
    delivery: {
      heading: 'Testing y entrega',
      copy: 'GitHub Actions ejecuta el backend sobre PostgreSQL 17 y valida calidad de código, migraciones, configuración de Django, contrato OpenAPI, tests de dominio/API y construcción de la imagen Docker. El mismo runtime Docker se despliega con Gunicorn en Render y PostgreSQL gestionado.',
      checksLabel: 'Control automatizado de entrega',
    },
    footer: {
      repository: 'Ver repositorio',
      apiDocs: 'Documentación de la API',
    },
  },
} as const;

export function getQuestBoardContent(locale: Locale) {
  return {
    ...localized[locale],
    ...shared,
    links: questBoardLinks,
  };
}
