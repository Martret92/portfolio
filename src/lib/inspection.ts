import type { ProjectInspectionModel } from '../types/inspection';

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
  assertUniqueIds(model.evidence, 'Evidence');

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

  for (const evidence of model.evidence) {
    if (!productIds.has(evidence.placementProductId)) {
      throw new Error(
        `Evidence ${evidence.id} references unknown product ${evidence.placementProductId}`,
      );
    }
    for (const nodeId of evidence.relatedNodeIds) {
      if (!nodeIds.has(nodeId)) {
        throw new Error(
          `Evidence ${evidence.id} references unknown node ${nodeId}`,
        );
      }
    }
    if (evidence.type === 'source' && !evidence.snippets.length) {
      throw new Error(`Source evidence ${evidence.id} requires a snippet`);
    }
    if (evidence.type === 'output') {
      const formats = new Set(evidence.formats.map(({ id }) => id));
      if (
        !['json', 'csv', 'sql'].every((format) =>
          formats.has(format as 'json' | 'csv' | 'sql'),
        )
      ) {
        throw new Error(
          `Output evidence ${evidence.id} requires JSON, CSV and SQL`,
        );
      }
    }
  }
}
