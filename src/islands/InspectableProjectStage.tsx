import { useEffect, useId, useMemo, useState, type CSSProperties } from 'react';

import {
  getActiveConnectionIds,
  getConnectedSystemNodeIds,
  getMappedProductId,
  getMappedSystemNodeIds,
  getSystemNode,
} from '../lib/inspection';
import type {
  InspectionDecision,
  Perspective,
  ProductElement,
  ProjectInspectionModel,
  SystemConnection,
  SystemNode,
} from '../types/inspection';

import '../styles/inspectable-project.css';

interface Props {
  readonly model: ProjectInspectionModel;
}

interface InspectorProps extends Props {
  readonly selectedNode: SystemNode | undefined;
  readonly className?: string;
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

function Inspector({ model, selectedNode, className }: InspectorProps) {
  const relatedDecisions = selectedNode?.inspection.relatedDecisionIds
    ?.map((id) => model.decisions.find((decision) => decision.id === id))
    .filter((decision): decision is InspectionDecision => Boolean(decision));

  return (
    <aside className={`inspection-inspector ${className ?? ''}`} data-inspector>
      <p className="inspection-kicker">{model.labels.inspectorHeading}</p>
      {!selectedNode ? (
        <p data-inspector-empty>{model.labels.inspectorEmpty}</p>
      ) : (
        <div data-inspector-node={selectedNode.id}>
          <h3>{selectedNode.label}</h3>
          <dl className="inspection-details">
            <div>
              <dt>{model.labels.roleLabel}</dt>
              <dd>{selectedNode.inspection.role}</dd>
            </div>
            <DetailList
              label={model.labels.producedByLabel}
              values={selectedNode.inspection.producedBy}
            />
            <DetailList
              label={model.labels.consumesLabel}
              values={selectedNode.inspection.consumes}
            />
            <DetailList
              label={model.labels.consumedByLabel}
              values={selectedNode.inspection.consumedBy}
            />
            <DetailList
              label={model.labels.invalidatedWhenLabel}
              values={selectedNode.inspection.invalidatedWhen}
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
                        <a href={`#${decision.id}`}>{decision.title}</a>
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
}: Props & {
  readonly node: SystemNode;
  readonly selectedNodeId: string | null;
  readonly connectedNodeIds: ReadonlySet<string>;
  readonly onSelectNode: (nodeId: string) => void;
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
          data-connection-state={
            activeConnectionIds.has(connection.id) ? 'active' : 'default'
          }
        >
          <span>{getSystemNode(nodes, connection.from)?.label}</span>
          <span className="visually-hidden">{connection.label}</span>
          <span aria-hidden="true">→</span>
          <span>{getSystemNode(nodes, connection.to)?.label}</span>
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
  idPrefix,
}: Props & {
  readonly product: ProductElement;
  readonly index: number;
  readonly perspective: Perspective;
  readonly selectedNodeId: string | null;
  readonly connectedNodeIds: ReadonlySet<string>;
  readonly activeConnectionIds: ReadonlySet<string>;
  readonly onSelectNode: (nodeId: string) => void;
  readonly idPrefix: string;
}) {
  const nodeIds = getMappedSystemNodeIds(model.mappings, product.id);
  const nodes = nodeIds
    .map((nodeId) => getSystemNode(model.systemNodes, nodeId))
    .filter((node): node is SystemNode => Boolean(node));
  const nodeIdSet = new Set(nodeIds);
  const localConnections = model.connections.filter(
    ({ from, to, type }) =>
      type === 'flow' && nodeIdSet.has(from) && nodeIdSet.has(to),
  );
  const containsSelection = selectedNodeId
    ? nodeIdSet.has(selectedNodeId)
    : false;
  const headingId = `${idPrefix}-group-${product.id}`;

  return (
    <section
      className="inspectable-group"
      data-product-group={product.id}
      data-flow-position={product.layoutPosition}
      data-group-mode={perspective}
      data-contains-selection={String(containsSelection)}
      style={{ '--flow-index': index + 1 } as CSSProperties}
      aria-labelledby={headingId}
    >
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
        />
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
  idPrefix,
}: Props & {
  readonly perspective: Perspective;
  readonly selectedNodeId: string | null;
  readonly onSelectNode: (nodeId: string) => void;
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
          />
        ) : null}
      </div>
    </section>
  );
}

function Decisions({
  model,
  idPrefix = '',
}: Props & { readonly idPrefix?: string }) {
  const headingId = `${idPrefix}inspection-decisions-heading`;
  return (
    <section className="inspection-decisions" aria-labelledby={headingId}>
      <header>
        <h2 id={headingId}>{model.labels.decisionsHeading}</h2>
        <p>{model.labels.decisionsIntroduction}</p>
      </header>
      <div className="inspection-decisions__items">
        {model.decisions.map((decision) => (
          <details key={decision.id} id={`${idPrefix}${decision.id}`}>
            <summary>
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
                        <DetailList
                          label={model.labels.producedByLabel}
                          values={node.inspection.producedBy}
                        />
                        <DetailList
                          label={model.labels.consumesLabel}
                          values={node.inspection.consumes}
                        />
                        <DetailList
                          label={model.labels.consumedByLabel}
                          values={node.inspection.consumedBy}
                        />
                        <DetailList
                          label={model.labels.invalidatedWhenLabel}
                          values={node.inspection.invalidatedWhen}
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
            </section>
          ))}
        </div>
        <section className="static-topology" aria-labelledby={flowHeadingId}>
          <h3 id={flowHeadingId}>{model.labels.topologyHeading}</h3>
          <ol>
            {model.connections
              .filter(({ type }) => type === 'flow')
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
  const reactId = useId().replaceAll(':', '');
  const idPrefix = `inspection-${reactId}`;

  useEffect(() => setEnhanced(true), []);

  const selectPerspective = (nextPerspective: Perspective) => {
    setPerspective(nextPerspective);
    if (nextPerspective === 'product') setSelectedNodeId(null);
  };

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
            idPrefix={idPrefix}
          />
        </div>

        <Decisions model={model} />
      </div>
    </div>
  );
}
