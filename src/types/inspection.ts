export type Perspective = 'product' | 'system';

export interface ProductElement {
  readonly id: string;
  readonly label: string;
  readonly summary: string;
  readonly layoutPosition:
    | 'primary-start'
    | 'primary-middle'
    | 'primary-end'
    | 'secondary-start'
    | 'secondary-end';
}

export interface SystemNodeInspection {
  readonly role: string;
  readonly invalidationTriggers?: readonly string[];
  readonly whyItMatters?: readonly string[];
  readonly implementationNotes?: readonly string[];
  readonly relatedDecisionIds?: readonly string[];
}

export interface SystemNode {
  readonly id: string;
  readonly label: string;
  readonly kind:
    | 'input'
    | 'process'
    | 'dependency'
    | 'state'
    | 'consumer'
    | 'serializer'
    | 'platform';
  readonly inspection: SystemNodeInspection;
}

export interface SystemConnection {
  readonly id: string;
  readonly from: string;
  readonly to: string;
  readonly label: string;
  readonly type: 'flow' | 'dependency' | 'invalidation';
}

export type RelationshipDirection = 'incoming' | 'outgoing';

export interface NodeRelationship {
  readonly connection: SystemConnection;
  readonly direction: RelationshipDirection;
  readonly targetNodeId: string;
}

export type RelationshipSemantic =
  | 'producedBy'
  | 'produces'
  | 'consumedBy'
  | 'receivesFrom'
  | 'dependsOn'
  | 'usedBy'
  | 'invalidatedBy'
  | 'invalidates'
  | 'flowsTo'
  | 'relatedTo';

export interface RelationshipGroup {
  readonly semantic: RelationshipSemantic;
  readonly relationships: readonly NodeRelationship[];
}

export interface ProductSystemMapping {
  readonly productId: string;
  readonly systemNodeIds: readonly string[];
}

export interface InspectionDecision {
  readonly id: string;
  readonly title: string;
  readonly summary: string;
  readonly context: string;
  readonly decision: string;
  readonly consequence: string;
}

export interface ProjectInspectionLabels {
  readonly perspectiveLegend: string;
  readonly productPerspective: string;
  readonly systemPerspective: string;
  readonly productHeading: string;
  readonly productIntroduction: string;
  readonly systemHeading: string;
  readonly systemIntroduction: string;
  readonly exampleLabel: string;
  readonly inspectorHeading: string;
  readonly inspectorEmpty: string;
  readonly roleLabel: string;
  readonly relationshipsLabel: string;
  readonly relationshipLabels: Readonly<Record<RelationshipSemantic, string>>;
  readonly invalidationTriggersLabel: string;
  readonly whyItMattersLabel: string;
  readonly implementationNotesLabel: string;
  readonly relatedDecisionsLabel: string;
  readonly topologyHeading: string;
  readonly invalidationHeading: string;
  readonly decisionsHeading: string;
  readonly decisionsIntroduction: string;
  readonly decisionContextLabel: string;
  readonly decisionLabel: string;
  readonly consequenceLabel: string;
  readonly kindLabels: Readonly<Record<SystemNode['kind'], string>>;
}

export interface ProjectInspectionModel {
  readonly projectId: string;
  readonly productElements: readonly ProductElement[];
  readonly systemNodes: readonly SystemNode[];
  readonly connections: readonly SystemConnection[];
  readonly mappings: readonly ProductSystemMapping[];
  readonly decisions: readonly InspectionDecision[];
  readonly example: readonly string[];
  readonly labels: ProjectInspectionLabels;
}
