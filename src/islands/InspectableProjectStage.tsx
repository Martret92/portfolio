import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';

import {
  getActiveConnectionIds,
  getConnectedSystemNodeIds,
  getMappedProductId,
  getMappedSystemNodeIds,
  getRelationshipGroups,
  getSystemNode,
} from '../lib/inspection';
import type {
  InspectionDecision,
  InspectionEvidence,
  OutputEvidence,
  Perspective,
  ProductElement,
  ProjectInspectionModel,
  SystemConnection,
  SystemNode,
  SourceEvidence,
} from '../types/inspection';

import '../styles/inspectable-project.css';

interface Props {
  readonly model: ProjectInspectionModel;
}

interface InspectorProps extends Props {
  readonly selectedNode: SystemNode | undefined;
  readonly className?: string;
  readonly onNavigateNode: (nodeId: string) => void;
  readonly onNavigateDecision: (decisionId: string) => void;
}

function ProductVisualFrame({
  model,
  onInspectSystem,
}: Props & { readonly onInspectSystem?: () => void }) {
  return (
    <figure className="product-visual" data-product-visual>
      <picture>
        <source srcSet={model.productVisual.optimizedSrc} type="image/jpeg" />
        <img
          src={model.productVisual.src}
          width={model.productVisual.width}
          height={model.productVisual.height}
          alt={model.productVisual.alt}
          fetchPriority="high"
        />
      </picture>
      <figcaption>{model.productVisual.caption}</figcaption>
      {onInspectSystem ? (
        <button
          type="button"
          className="product-visual__inspect"
          onClick={onInspectSystem}
          data-inspect-system
        >
          <span aria-hidden="true">→</span>
          {model.labels.inspectSystemLabel}
        </button>
      ) : null}
    </figure>
  );
}

type CausalConnectorKind = 'forward' | 'branch';

function CausalConnector({
  kind,
  productId,
  connectionIds,
  activeConnectionIds,
  idPrefix,
}: {
  readonly kind: CausalConnectorKind;
  readonly productId: string;
  readonly connectionIds: readonly string[];
  readonly activeConnectionIds: ReadonlySet<string>;
  readonly idPrefix: string;
}) {
  const active = connectionIds.some((id) => activeConnectionIds.has(id));
  const markerId = `${idPrefix}-${productId}-flow-arrow`;

  return (
    <svg
      className={`causal-connector causal-connector--${kind}`}
      viewBox={kind === 'branch' ? '0 0 180 60' : '0 0 100 100'}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      data-causal-connector={productId}
      data-connection-state={active ? 'active' : 'default'}
      data-connection-ids={connectionIds.join(' ')}
    >
      <defs>
        <marker
          id={markerId}
          viewBox="0 0 8 8"
          refX="7"
          refY="4"
          markerWidth="8"
          markerHeight="8"
          orient="auto"
        >
          <path d="M0 0 8 4 0 8Z" />
        </marker>
      </defs>
      {kind === 'branch' ? (
        <>
          <path
            className="causal-connector__desktop"
            d="M129 2V20H42V52"
            markerEnd={`url(#${markerId})`}
            data-connection-id={connectionIds[0]}
          />
          <path
            className="causal-connector__desktop"
            d="M129 20V52"
            markerEnd={`url(#${markerId})`}
            data-connection-id={connectionIds[1]}
          />
          <path
            className="causal-connector__mobile"
            d="M50 2V20L25 50V90"
            markerEnd={`url(#${markerId})`}
            data-connection-id={connectionIds[0]}
          />
          <path
            className="causal-connector__mobile"
            d="M50 20L75 50V90"
            markerEnd={`url(#${markerId})`}
            data-connection-id={connectionIds[1]}
          />
        </>
      ) : (
        <>
          <path
            className="causal-connector__desktop"
            d="M2 50H90"
            markerEnd={`url(#${markerId})`}
            data-connection-id={connectionIds[0]}
          />
          <path
            className="causal-connector__mobile"
            d="M50 2V90"
            markerEnd={`url(#${markerId})`}
            data-connection-id={connectionIds[0]}
          />
        </>
      )}
    </svg>
  );
}

function DetailList({
  label,
  values,
}: {
  readonly label: string;
  readonly values: readonly string[] | undefined;
}) {
  if (!values?.length) return null;

  return (
    <div>
      <dt>{label}</dt>
      <dd>
        <ul>
          {values.map((value) => (
            <li key={value}>{value}</li>
          ))}
        </ul>
      </dd>
    </div>
  );
}

function ArtifactFrame({
  model,
  evidence,
  children,
}: Props & {
  readonly evidence: InspectionEvidence;
  readonly children: ReactNode;
}) {
  return (
    <figure
      className="evidence-artifact"
      data-evidence-artifact={evidence.id}
      data-evidence-type={evidence.type}
    >
      <figcaption>
        <span>{model.labels.evidenceTypeLabels[evidence.type]}</span>
        <code>{evidence.provenance}</code>
        <strong>{evidence.title}</strong>
      </figcaption>
      <div className="evidence-artifact__content">{children}</div>
      <p className="evidence-artifact__annotation">{evidence.annotation}</p>
    </figure>
  );
}

function SourceArtifact({
  model,
  evidence,
}: Props & { readonly evidence: SourceEvidence }) {
  return (
    <details
      className="source-artifact"
      data-evidence-artifact={evidence.id}
      data-evidence-type={evidence.type}
    >
      <summary>
        <span>{model.labels.evidenceTypeLabels.source}</span>
        <code>{evidence.provenance}</code>
        <strong>{evidence.title}</strong>
        <small>{model.labels.viewEvidenceLabel}</small>
      </summary>
      <div className="source-artifact__body">
        {evidence.snippets.map((snippet) => (
          <div className="source-excerpt" key={snippet.startLine}>
            <span aria-hidden="true">{snippet.startLine}</span>
            <pre>
              <code>{snippet.code}</code>
            </pre>
          </div>
        ))}
        <p className="evidence-artifact__annotation">{evidence.annotation}</p>
      </div>
    </details>
  );
}

function OutputArtifact({
  model,
  evidence,
}: Props & { readonly evidence: OutputEvidence }) {
  return (
    <ArtifactFrame model={model} evidence={evidence}>
      <p className="evidence-artifact__illustrative">
        {evidence.illustrativeLabel}
      </p>
      <div className="output-formats">
        {evidence.formats.map((format) => (
          <section key={format.id}>
            <h4>{format.label}</h4>
            <pre>
              <code>{format.content}</code>
            </pre>
          </section>
        ))}
      </div>
    </ArtifactFrame>
  );
}

function EvidenceArtifact({
  model,
  evidence,
}: Props & { readonly evidence: InspectionEvidence }) {
  return evidence.type === 'source' ? (
    <SourceArtifact model={model} evidence={evidence} />
  ) : (
    <OutputArtifact model={model} evidence={evidence} />
  );
}

function StaticRelationshipDetails({
  model,
  node,
}: Props & { readonly node: SystemNode }) {
  const groups = getRelationshipGroups(
    model.connections,
    model.systemNodes,
    node.id,
  );
  if (!groups.length) return null;

  return (
    <div>
      <dt>{model.labels.relationshipsLabel}</dt>
      <dd>
        {groups.map((group) => (
          <section key={group.semantic}>
            <h5>{model.labels.relationshipLabels[group.semantic]}</h5>
            <ul>
              {group.relationships.map((relationship) => (
                <li key={relationship.connection.id}>
                  {
                    getSystemNode(model.systemNodes, relationship.targetNodeId)
                      ?.label
                  }
                </li>
              ))}
            </ul>
          </section>
        ))}
      </dd>
    </div>
  );
}

function RelationshipTarget({
  node,
  onActivate,
}: {
  readonly node: SystemNode;
  readonly onActivate: (nodeId: string) => void;
}) {
  return (
    <button
      type="button"
      className="relationship-target"
      onClick={() => onActivate(node.id)}
      data-relationship-target={node.id}
    >
      <span aria-hidden="true">→</span>
      {node.label}
    </button>
  );
}

function Inspector({
  model,
  selectedNode,
  className,
  onNavigateNode,
  onNavigateDecision,
}: InspectorProps) {
  const relatedDecisions = selectedNode?.inspection.relatedDecisionIds
    ?.map((id) => model.decisions.find((decision) => decision.id === id))
    .filter((decision): decision is InspectionDecision => Boolean(decision));
  const relationshipGroups = selectedNode
    ? getRelationshipGroups(
        model.connections,
        model.systemNodes,
        selectedNode.id,
      )
    : [];

  return (
    <aside className={`inspection-inspector ${className ?? ''}`} data-inspector>
      <p className="inspection-kicker">{model.labels.inspectorHeading}</p>
      {!selectedNode ? (
        <p data-inspector-empty>{model.labels.inspectorEmpty}</p>
      ) : (
        <div
          className="inspection-inspector__content"
          data-inspector-node={selectedNode.id}
          key={selectedNode.id}
        >
          <h3>{selectedNode.label}</h3>
          <dl className="inspection-details">
            <div>
              <dt>{model.labels.roleLabel}</dt>
              <dd>{selectedNode.inspection.role}</dd>
            </div>
            {relationshipGroups.length ? (
              <div className="inspection-relationships">
                <dt>{model.labels.relationshipsLabel}</dt>
                <dd>
                  {relationshipGroups.map((group) => (
                    <section key={group.semantic}>
                      <h4>{model.labels.relationshipLabels[group.semantic]}</h4>
                      <ul>
                        {group.relationships.map((relationship) => {
                          const target = getSystemNode(
                            model.systemNodes,
                            relationship.targetNodeId,
                          );
                          return target ? (
                            <li key={relationship.connection.id}>
                              <RelationshipTarget
                                node={target}
                                onActivate={onNavigateNode}
                              />
                            </li>
                          ) : null;
                        })}
                      </ul>
                    </section>
                  ))}
                </dd>
              </div>
            ) : null}
            <DetailList
              label={model.labels.invalidationTriggersLabel}
              values={selectedNode.inspection.invalidationTriggers}
            />
            <DetailList
              label={model.labels.whyItMattersLabel}
              values={selectedNode.inspection.whyItMatters}
            />
            <DetailList
              label={model.labels.implementationNotesLabel}
              values={selectedNode.inspection.implementationNotes}
            />
            {relatedDecisions?.length ? (
              <div>
                <dt>{model.labels.relatedDecisionsLabel}</dt>
                <dd>
                  <ul>
                    {relatedDecisions.map((decision) => (
                      <li key={decision.id}>
                        <button
                          type="button"
                          className="decision-target"
                          onClick={() => onNavigateDecision(decision.id)}
                          data-decision-target={decision.id}
                        >
                          <span aria-hidden="true">→</span>
                          {decision.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            ) : null}
          </dl>
        </div>
      )}
    </aside>
  );
}

function SystemNodeControl({
  model,
  node,
  selectedNodeId,
  connectedNodeIds,
  onSelectNode,
  registerNode,
}: Props & {
  readonly node: SystemNode;
  readonly selectedNodeId: string | null;
  readonly connectedNodeIds: ReadonlySet<string>;
  readonly onSelectNode: (nodeId: string) => void;
  readonly registerNode: (
    nodeId: string,
    element: HTMLButtonElement | null,
  ) => void;
}) {
  const state =
    node.id === selectedNodeId
      ? 'selected'
      : connectedNodeIds.has(node.id)
        ? 'connected'
        : selectedNodeId
          ? 'dimmed'
          : 'default';

  return (
    <button
      className="system-node"
      type="button"
      aria-pressed={node.id === selectedNodeId}
      onClick={() => onSelectNode(node.id)}
      data-system-node={node.id}
      data-node-state={state}
      ref={(element) => registerNode(node.id, element)}
    >
      <span>{model.labels.kindLabels[node.kind]}</span>
      <strong>{node.label}</strong>
    </button>
  );
}

function LocalTopology({
  connections,
  nodes,
  activeConnectionIds,
  label,
}: {
  readonly connections: readonly SystemConnection[];
  readonly nodes: readonly SystemNode[];
  readonly activeConnectionIds: ReadonlySet<string>;
  readonly label: string;
}) {
  if (!connections.length) return null;

  return (
    <ul className="local-topology" aria-label={label}>
      {connections.map((connection) => (
        <li
          key={connection.id}
          data-local-connection={connection.id}
          data-connection-type={connection.type}
          data-connection-state={
            activeConnectionIds.has(connection.id) ? 'active' : 'default'
          }
        >
          <span>{getSystemNode(nodes, connection.from)?.label}</span>
          {connection.type !== 'dependency' ? (
            <span className="visually-hidden">{connection.label}</span>
          ) : null}
          <span aria-hidden="true">→</span>
          <span>{getSystemNode(nodes, connection.to)?.label}</span>
          {connection.type === 'dependency' ? (
            <small className="local-topology__type">{connection.label}</small>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

function InspectableGroup({
  model,
  product,
  index,
  perspective,
  selectedNodeId,
  connectedNodeIds,
  activeConnectionIds,
  onSelectNode,
  onNavigateNode,
  onNavigateDecision,
  registerNode,
  idPrefix,
}: Props & {
  readonly product: ProductElement;
  readonly index: number;
  readonly perspective: Perspective;
  readonly selectedNodeId: string | null;
  readonly connectedNodeIds: ReadonlySet<string>;
  readonly activeConnectionIds: ReadonlySet<string>;
  readonly onSelectNode: (nodeId: string) => void;
  readonly onNavigateNode: (nodeId: string) => void;
  readonly onNavigateDecision: (decisionId: string) => void;
  readonly registerNode: (
    nodeId: string,
    element: HTMLButtonElement | null,
  ) => void;
  readonly idPrefix: string;
}) {
  const nodeIds = getMappedSystemNodeIds(model.mappings, product.id);
  const nodes = nodeIds
    .map((nodeId) => getSystemNode(model.systemNodes, nodeId))
    .filter((node): node is SystemNode => Boolean(node));
  const nodeIdSet = new Set(nodeIds);
  const localConnections = model.connections.filter(
    ({ from, to, type }) =>
      type !== 'invalidation' && nodeIdSet.has(from) && nodeIdSet.has(to),
  );
  const containsSelection = selectedNodeId
    ? nodeIdSet.has(selectedNodeId)
    : false;
  const containsConnectedNode = nodes.some((node) =>
    connectedNodeIds.has(node.id),
  );
  const hasActiveOutgoingConnection = model.connections.some(
    (connection) =>
      activeConnectionIds.has(connection.id) &&
      nodeIdSet.has(connection.from) &&
      !nodeIdSet.has(connection.to),
  );
  const causalConnector =
    product.id === 'configure'
      ? {
          kind: 'forward' as const,
          connectionIds: ['configuration-validation'],
        }
      : product.id === 'generate'
        ? { kind: 'forward' as const, connectionIds: ['generation-result'] }
        : product.id === 'result'
          ? {
              kind: 'branch' as const,
              connectionIds: ['result-preview', 'result-export'],
            }
          : undefined;
  const headingId = `${idPrefix}-group-${product.id}`;

  return (
    <section
      className="inspectable-group"
      data-product-group={product.id}
      data-flow-position={product.layoutPosition}
      data-group-mode={perspective}
      data-contains-selection={String(containsSelection)}
      data-contains-connected={String(containsConnectedNode)}
      data-active-outgoing={String(hasActiveOutgoingConnection)}
      data-focal={String(product.id === 'result')}
      style={{ '--flow-index': index + 1 } as CSSProperties}
      aria-labelledby={headingId}
    >
      {perspective === 'system' && causalConnector ? (
        <CausalConnector
          kind={causalConnector.kind}
          productId={product.id}
          connectionIds={causalConnector.connectionIds}
          activeConnectionIds={activeConnectionIds}
          idPrefix={idPrefix}
        />
      ) : null}
      <header className="inspectable-group__product">
        <span className="product-element__step">0{index + 1}</span>
        <h3 id={headingId}>{product.label}</h3>
        <p>{product.summary}</p>
      </header>

      {perspective === 'system' ? (
        <div className="group-internals" data-group-internals={product.id}>
          <div className="group-internals__nodes">
            {nodes.map((node) => (
              <SystemNodeControl
                key={node.id}
                model={model}
                node={node}
                selectedNodeId={selectedNodeId}
                connectedNodeIds={connectedNodeIds}
                onSelectNode={onSelectNode}
                registerNode={registerNode}
              />
            ))}
          </div>
          <LocalTopology
            connections={localConnections}
            nodes={model.systemNodes}
            activeConnectionIds={activeConnectionIds}
            label={model.labels.topologyHeading}
          />
        </div>
      ) : null}

      {perspective === 'system' && containsSelection ? (
        <Inspector
          model={model}
          selectedNode={getSystemNode(model.systemNodes, selectedNodeId)}
          className="inspection-inspector--mobile"
          onNavigateNode={onNavigateNode}
          onNavigateDecision={onNavigateDecision}
        />
      ) : null}

      {perspective === 'system' ? (
        <div className="group-evidence">
          {model.evidence
            .filter(
              ({ placementProductId }) => placementProductId === product.id,
            )
            .map((evidence) => (
              <EvidenceArtifact
                key={evidence.id}
                model={model}
                evidence={evidence}
              />
            ))}
        </div>
      ) : null}
    </section>
  );
}

function CrossGroupTopology({
  model,
  activeConnectionIds,
  idPrefix,
}: Props & {
  readonly activeConnectionIds: ReadonlySet<string>;
  readonly idPrefix: string;
}) {
  const crossGroupConnections = model.connections.filter((connection) => {
    if (connection.type !== 'flow') return false;
    return (
      getMappedProductId(model.mappings, connection.from) !==
      getMappedProductId(model.mappings, connection.to)
    );
  });
  const invalidationConnections = model.connections.filter(
    ({ type }) => type === 'invalidation',
  );
  const flowHeadingId = `${idPrefix}-cross-flow-heading`;
  const invalidationHeadingId = `${idPrefix}-invalidation-heading`;

  return (
    <div className="stage-topology">
      <section className="cross-group-flow" aria-labelledby={flowHeadingId}>
        <h3 id={flowHeadingId}>{model.labels.topologyHeading}</h3>
        <ol>
          {crossGroupConnections.map((connection) => (
            <li
              key={connection.id}
              data-connection={connection.id}
              data-connection-state={
                activeConnectionIds.has(connection.id) ? 'active' : 'default'
              }
            >
              <strong>
                {getSystemNode(model.systemNodes, connection.from)?.label}
              </strong>
              <span className="visually-hidden">{connection.label}</span>
              <span aria-hidden="true">→</span>
              <strong>
                {getSystemNode(model.systemNodes, connection.to)?.label}
              </strong>
            </li>
          ))}
        </ol>
      </section>
      <section
        className="system-invalidation"
        aria-labelledby={invalidationHeadingId}
      >
        <h3 id={invalidationHeadingId}>{model.labels.invalidationHeading}</h3>
        {invalidationConnections.map((connection) => (
          <p key={connection.id} data-connection={connection.id}>
            <strong>
              {getSystemNode(model.systemNodes, connection.from)?.label}
            </strong>
            {' — '}
            {connection.label}
            {' — '}
            <strong>
              {getSystemNode(model.systemNodes, connection.to)?.label}
            </strong>
          </p>
        ))}
      </section>
    </div>
  );
}

function PersistentProjectStage({
  model,
  perspective,
  selectedNodeId,
  onSelectNode,
  onNavigateNode,
  onNavigateDecision,
  onInspectSystem,
  registerNode,
  idPrefix,
}: Props & {
  readonly perspective: Perspective;
  readonly selectedNodeId: string | null;
  readonly onSelectNode: (nodeId: string) => void;
  readonly onNavigateNode: (nodeId: string) => void;
  readonly onNavigateDecision: (decisionId: string) => void;
  readonly onInspectSystem: () => void;
  readonly registerNode: (
    nodeId: string,
    element: HTMLButtonElement | null,
  ) => void;
  readonly idPrefix: string;
}) {
  const connectedNodeIds = useMemo(
    () =>
      new Set(
        selectedNodeId
          ? getConnectedSystemNodeIds(model.connections, selectedNodeId)
          : [],
      ),
    [model.connections, selectedNodeId],
  );
  const activeConnectionIds = useMemo(
    () => new Set(getActiveConnectionIds(model.connections, selectedNodeId)),
    [model.connections, selectedNodeId],
  );
  const selectedNode = getSystemNode(model.systemNodes, selectedNodeId);
  const stageHeadingId = `${idPrefix}-stage-heading`;

  return (
    <section
      className="project-stage"
      aria-labelledby={stageHeadingId}
      data-project-stage
    >
      <header className="inspection-perspective__header">
        <p className="inspection-kicker">
          {perspective === 'product'
            ? model.labels.productPerspective
            : model.labels.systemPerspective}
        </p>
        <h2 id={stageHeadingId}>
          {perspective === 'product'
            ? model.labels.productHeading
            : model.labels.systemHeading}
        </h2>
        <p>
          {perspective === 'product'
            ? model.labels.productIntroduction
            : model.labels.systemIntroduction}
        </p>
        {perspective === 'product' ? (
          <p className="inspection-example">
            <span>{model.labels.exampleLabel}</span>
            {model.example.join(' · ')}
          </p>
        ) : null}
      </header>

      {perspective === 'product' ? (
        <ProductVisualFrame model={model} onInspectSystem={onInspectSystem} />
      ) : null}

      <div className="project-workspace">
        <div className="persistent-groups">
          {model.productElements.map((product, index) => (
            <InspectableGroup
              key={product.id}
              model={model}
              product={product}
              index={index}
              perspective={perspective}
              selectedNodeId={selectedNodeId}
              connectedNodeIds={connectedNodeIds}
              activeConnectionIds={activeConnectionIds}
              onSelectNode={onSelectNode}
              onNavigateNode={onNavigateNode}
              onNavigateDecision={onNavigateDecision}
              registerNode={registerNode}
              idPrefix={idPrefix}
            />
          ))}
          {perspective === 'system' ? (
            <CrossGroupTopology
              model={model}
              activeConnectionIds={activeConnectionIds}
              idPrefix={idPrefix}
            />
          ) : null}
        </div>

        {perspective === 'system' ? (
          <Inspector
            model={model}
            selectedNode={selectedNode}
            className="inspection-inspector--desktop"
            onNavigateNode={onNavigateNode}
            onNavigateDecision={onNavigateDecision}
          />
        ) : null}
      </div>
    </section>
  );
}

function Decisions({
  model,
  idPrefix = '',
  registerSummary,
}: Props & {
  readonly idPrefix?: string;
  readonly registerSummary?: (
    decisionId: string,
    element: HTMLElement | null,
  ) => void;
}) {
  const headingId = `${idPrefix}inspection-decisions-heading`;
  return (
    <section className="inspection-decisions" aria-labelledby={headingId}>
      <header>
        <h2 id={headingId}>{model.labels.decisionsHeading}</h2>
        <p>{model.labels.decisionsIntroduction}</p>
      </header>
      <div className="inspection-decisions__items">
        {model.decisions.map((decision, index) => (
          <details key={decision.id} id={`${idPrefix}${decision.id}`}>
            <summary ref={(element) => registerSummary?.(decision.id, element)}>
              <span className="decision-index">
                {model.labels.decisionItemLabel}{' '}
                {String(index + 1).padStart(2, '0')}
              </span>
              <span>
                <strong>{decision.title}</strong>
                <small>{decision.summary}</small>
              </span>
            </summary>
            <dl>
              <div>
                <dt>{model.labels.decisionContextLabel}</dt>
                <dd>{decision.context}</dd>
              </div>
              <div>
                <dt>{model.labels.decisionLabel}</dt>
                <dd>{decision.decision}</dd>
              </div>
              <div>
                <dt>{model.labels.consequenceLabel}</dt>
                <dd>{decision.consequence}</dd>
              </div>
            </dl>
          </details>
        ))}
      </div>
    </section>
  );
}

function StaticFallback({
  model,
  idPrefix,
}: Props & { readonly idPrefix: string }) {
  const productHeadingId = `${idPrefix}-product-heading`;
  const systemHeadingId = `${idPrefix}-system-heading`;
  const flowHeadingId = `${idPrefix}-flow-heading`;
  const invalidationHeadingId = `${idPrefix}-invalidation-heading`;

  return (
    <div className="inspection-static" data-inspection-fallback>
      <section
        className="inspection-static__product"
        aria-labelledby={productHeadingId}
      >
        <header className="inspection-perspective__header">
          <p className="inspection-kicker">{model.labels.productPerspective}</p>
          <h2 id={productHeadingId}>{model.labels.productHeading}</h2>
          <p>{model.labels.productIntroduction}</p>
        </header>
        <ProductVisualFrame model={model} />
        <div className="static-product-groups">
          {model.productElements.map((product) => (
            <article key={product.id}>
              <h3>{product.label}</h3>
              <p>{product.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        className="inspection-static__system"
        aria-labelledby={systemHeadingId}
        data-static-system
      >
        <header className="inspection-perspective__header">
          <p className="inspection-kicker">{model.labels.systemPerspective}</p>
          <h2 id={systemHeadingId}>{model.labels.systemHeading}</h2>
          <p>{model.labels.systemIntroduction}</p>
        </header>
        <div className="static-system-groups">
          {model.productElements.map((product) => (
            <section
              key={product.id}
              aria-labelledby={`${idPrefix}-static-group-${product.id}`}
            >
              <h3 id={`${idPrefix}-static-group-${product.id}`}>
                {product.label}
              </h3>
              {getMappedSystemNodeIds(model.mappings, product.id).map(
                (nodeId) => {
                  const node = getSystemNode(model.systemNodes, nodeId);
                  if (!node) return null;
                  return (
                    <article key={node.id}>
                      <span>{model.labels.kindLabels[node.kind]}</span>
                      <h4>{node.label}</h4>
                      <p>{node.inspection.role}</p>
                      <dl className="inspection-details">
                        <StaticRelationshipDetails model={model} node={node} />
                        <DetailList
                          label={model.labels.invalidationTriggersLabel}
                          values={node.inspection.invalidationTriggers}
                        />
                        <DetailList
                          label={model.labels.whyItMattersLabel}
                          values={node.inspection.whyItMatters}
                        />
                        <DetailList
                          label={model.labels.implementationNotesLabel}
                          values={node.inspection.implementationNotes}
                        />
                      </dl>
                    </article>
                  );
                },
              )}
              {model.evidence
                .filter(
                  ({ placementProductId }) => placementProductId === product.id,
                )
                .map((evidence) => (
                  <EvidenceArtifact
                    key={evidence.id}
                    model={model}
                    evidence={evidence}
                  />
                ))}
            </section>
          ))}
        </div>
        <section className="static-topology" aria-labelledby={flowHeadingId}>
          <h3 id={flowHeadingId}>{model.labels.topologyHeading}</h3>
          <ol>
            {model.connections
              .filter(({ type }) => type !== 'invalidation')
              .map((connection) => (
                <li key={connection.id}>
                  <strong>
                    {getSystemNode(model.systemNodes, connection.from)?.label}
                  </strong>
                  <span aria-hidden="true">→</span>
                  <strong>
                    {getSystemNode(model.systemNodes, connection.to)?.label}
                  </strong>
                </li>
              ))}
          </ol>
        </section>
        <section
          className="system-invalidation"
          aria-labelledby={invalidationHeadingId}
        >
          <h3 id={invalidationHeadingId}>{model.labels.invalidationHeading}</h3>
          {model.connections
            .filter(({ type }) => type === 'invalidation')
            .map((connection) => (
              <p key={connection.id}>
                <strong>
                  {getSystemNode(model.systemNodes, connection.from)?.label}
                </strong>
                {' — '}
                {connection.label}
                {' — '}
                <strong>
                  {getSystemNode(model.systemNodes, connection.to)?.label}
                </strong>
              </p>
            ))}
        </section>
      </section>
      <Decisions model={model} idPrefix="static-" />
    </div>
  );
}

export default function InspectableProjectStage({ model }: Props) {
  const [enhanced, setEnhanced] = useState(false);
  const [perspective, setPerspective] = useState<Perspective>('product');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const nodeRefs = useRef(new Map<string, HTMLButtonElement>());
  const decisionSummaryRefs = useRef(new Map<string, HTMLElement>());
  const systemPerspectiveRef = useRef<HTMLButtonElement>(null);
  const reactId = useId().replaceAll(':', '');
  const idPrefix = `inspection-${reactId}`;

  useEffect(() => setEnhanced(true), []);

  const selectPerspective = (nextPerspective: Perspective) => {
    setPerspective(nextPerspective);
    if (nextPerspective === 'product') setSelectedNodeId(null);
  };

  const inspectSystem = () => {
    selectPerspective('system');
    systemPerspectiveRef.current?.focus();
  };

  const registerNode = useCallback(
    (nodeId: string, element: HTMLButtonElement | null) => {
      if (element) nodeRefs.current.set(nodeId, element);
      else nodeRefs.current.delete(nodeId);
    },
    [],
  );

  const registerDecisionSummary = useCallback(
    (decisionId: string, element: HTMLElement | null) => {
      if (element) decisionSummaryRefs.current.set(decisionId, element);
      else decisionSummaryRefs.current.delete(decisionId);
    },
    [],
  );

  const navigateToNode = useCallback((nodeId: string) => {
    setSelectedNodeId(nodeId);
    requestAnimationFrame(() => nodeRefs.current.get(nodeId)?.focus());
  }, []);

  const navigateToDecision = useCallback((decisionId: string) => {
    const summary = decisionSummaryRefs.current.get(decisionId);
    const details = summary?.closest('details');
    if (!summary || !details) return;
    details.open = true;
    summary.focus();
    summary.scrollIntoView?.({ block: 'nearest' });
  }, []);

  return (
    <div
      className="inspectable-project"
      data-inspection-stage
      data-enhanced={String(enhanced)}
      data-perspective={perspective}
    >
      <StaticFallback model={model} idPrefix={`${idPrefix}-static`} />

      <div className="inspection-enhanced" data-inspection-enhanced>
        <fieldset className="perspective-control">
          <legend>{model.labels.perspectiveLegend}</legend>
          <div>
            <button
              type="button"
              aria-pressed={perspective === 'product'}
              onClick={() => selectPerspective('product')}
              data-perspective-control="product"
            >
              {model.labels.productPerspective}
            </button>
            <button
              type="button"
              aria-pressed={perspective === 'system'}
              onClick={() => selectPerspective('system')}
              data-perspective-control="system"
              ref={systemPerspectiveRef}
            >
              {model.labels.systemPerspective}
            </button>
          </div>
        </fieldset>

        <div className="inspection-stage-surface">
          <PersistentProjectStage
            model={model}
            perspective={perspective}
            selectedNodeId={selectedNodeId}
            onSelectNode={setSelectedNodeId}
            onNavigateNode={navigateToNode}
            onNavigateDecision={navigateToDecision}
            onInspectSystem={inspectSystem}
            registerNode={registerNode}
            idPrefix={idPrefix}
          />
        </div>

        <Decisions model={model} registerSummary={registerDecisionSummary} />
      </div>
    </div>
  );
}
