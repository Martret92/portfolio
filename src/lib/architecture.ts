import type {
  ArchitectureConnection,
  ArchitectureNode,
} from '../types/architecture';

export function getArchitectureNode(
  nodes: readonly ArchitectureNode[],
  nodeId: string,
): ArchitectureNode | undefined {
  return nodes.find((node) => node.id === nodeId);
}

export function getConnectionsForNode(
  connections: readonly ArchitectureConnection[],
  nodeId: string,
): ArchitectureConnection[] {
  return connections.filter(
    (connection) => connection.from === nodeId || connection.to === nodeId,
  );
}

export function getConnectedNodeIds(
  connections: readonly ArchitectureConnection[],
  nodeId: string,
): string[] {
  return [
    ...new Set(
      getConnectionsForNode(connections, nodeId).map((connection) =>
        connection.from === nodeId ? connection.to : connection.from,
      ),
    ),
  ];
}

export function validateArchitectureGraph(
  nodes: readonly ArchitectureNode[],
  connections: readonly ArchitectureConnection[],
): void {
  const nodeIds = new Set(nodes.map((node) => node.id));

  if (nodeIds.size !== nodes.length) {
    throw new Error('Architecture node IDs must be unique');
  }

  const connectionIds = new Set(connections.map((connection) => connection.id));

  if (connectionIds.size !== connections.length) {
    throw new Error('Architecture connection IDs must be unique');
  }

  for (const connection of connections) {
    if (!nodeIds.has(connection.from) || !nodeIds.has(connection.to)) {
      throw new Error(
        `Architecture connection ${connection.id} references an unknown node`,
      );
    }
  }
}
