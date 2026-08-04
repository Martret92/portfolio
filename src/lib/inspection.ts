import type {
  ProductSystemMapping,
  ProjectInspectionModel,
  SystemConnection,
  SystemNode,
} from '../types/inspection';

function assertUniqueIds(
  values: readonly { readonly id: string }[],
  label: string,
): void {
  if (new Set(values.map((value) => value.id)).size !== values.length) {
    throw new Error(`${label} IDs must be unique`);
  }
}

export function validateProjectInspectionModel(
  model: ProjectInspectionModel,
): void {
  assertUniqueIds(model.productElements, 'Product element');
  assertUniqueIds(model.systemNodes, 'System node');
  assertUniqueIds(model.connections, 'System connection');
  assertUniqueIds(model.decisions, 'Decision');

  const productIds = new Set(model.productElements.map(({ id }) => id));
  const nodeIds = new Set(model.systemNodes.map(({ id }) => id));
  const decisionIds = new Set(model.decisions.map(({ id }) => id));
  const mappedProductIds = new Set<string>();
  const mappedNodeIds = new Set<string>();

  for (const connection of model.connections) {
    if (!nodeIds.has(connection.from) || !nodeIds.has(connection.to)) {
      throw new Error(
        `System connection ${connection.id} references an unknown node`,
      );
    }
  }

  for (const mapping of model.mappings) {
    if (!productIds.has(mapping.productId)) {
      throw new Error(
        `Product mapping references unknown product ${mapping.productId}`,
      );
    }

    if (mappedProductIds.has(mapping.productId)) {
      throw new Error(`Product mapping ${mapping.productId} must be unique`);
    }

    mappedProductIds.add(mapping.productId);

    for (const nodeId of mapping.systemNodeIds) {
      if (!nodeIds.has(nodeId)) {
        throw new Error(`Product mapping references unknown node ${nodeId}`);
      }

      if (mappedNodeIds.has(nodeId)) {
        throw new Error(`System node ${nodeId} must map to one product`);
      }

      mappedNodeIds.add(nodeId);
    }
  }

  for (const nodeId of nodeIds) {
    if (!mappedNodeIds.has(nodeId)) {
      throw new Error(`System node ${nodeId} is not mapped to a product`);
    }
  }

  for (const node of model.systemNodes) {
    for (const decisionId of node.inspection.relatedDecisionIds ?? []) {
      if (!decisionIds.has(decisionId)) {
        throw new Error(
          `System node ${node.id} references unknown decision ${decisionId}`,
        );
      }
    }
  }
}

export function getSystemNode(
  nodes: readonly SystemNode[],
  nodeId: string | null,
): SystemNode | undefined {
  return nodeId ? nodes.find((node) => node.id === nodeId) : undefined;
}

export function getConnectedSystemNodeIds(
  connections: readonly SystemConnection[],
  nodeId: string,
): string[] {
  return [
    ...new Set(
      connections
        .filter(
          (connection) =>
            connection.from === nodeId || connection.to === nodeId,
        )
        .map((connection) =>
          connection.from === nodeId ? connection.to : connection.from,
        ),
    ),
  ];
}

export function getActiveConnectionIds(
  connections: readonly SystemConnection[],
  nodeId: string | null,
): string[] {
  if (!nodeId) return [];

  return connections
    .filter(
      (connection) => connection.from === nodeId || connection.to === nodeId,
    )
    .map((connection) => connection.id);
}

export function getMappedSystemNodeIds(
  mappings: readonly ProductSystemMapping[],
  productId: string,
): readonly string[] {
  return (
    mappings.find((mapping) => mapping.productId === productId)
      ?.systemNodeIds ?? []
  );
}

export function getMappedProductId(
  mappings: readonly ProductSystemMapping[],
  nodeId: string,
): string | undefined {
  return mappings.find((mapping) => mapping.systemNodeIds.includes(nodeId))
    ?.productId;
}
