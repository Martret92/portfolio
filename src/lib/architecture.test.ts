import { describe, expect, it } from 'vitest';

import type {
  ArchitectureConnection,
  ArchitectureNode,
} from '../types/architecture';
import {
  getArchitectureNode,
  getConnectedNodeIds,
  getConnectionsForNode,
  validateArchitectureGraph,
} from './architecture';

const nodes = [
  { id: 'interface', label: 'Interface', description: 'Temporary.' },
  { id: 'application', label: 'Application', description: 'Temporary.' },
  { id: 'data', label: 'Data', description: 'Temporary.' },
] satisfies readonly ArchitectureNode[];

const connections = [
  {
    id: 'interface-application',
    from: 'interface',
    to: 'application',
    label: 'Temporary connection',
  },
  {
    id: 'application-data',
    from: 'application',
    to: 'data',
    label: 'Temporary connection',
  },
] satisfies readonly ArchitectureConnection[];

describe('architecture graph helpers', () => {
  it('looks up a node by stable ID', () => {
    expect(getArchitectureNode(nodes, 'application')?.label).toBe(
      'Application',
    );
    expect(getArchitectureNode(nodes, 'unknown')).toBeUndefined();
  });

  it('finds connections and neighboring nodes deterministically', () => {
    expect(getConnectionsForNode(connections, 'application')).toHaveLength(2);
    expect(getConnectedNodeIds(connections, 'application')).toEqual([
      'interface',
      'data',
    ]);
  });

  it('rejects duplicate node IDs', () => {
    expect(() =>
      validateArchitectureGraph(
        [
          ...nodes,
          {
            id: 'interface',
            label: 'Duplicate interface',
            description: 'Temporary.',
          },
        ],
        connections,
      ),
    ).toThrow('Architecture node IDs must be unique');
  });

  it('rejects duplicate connection IDs', () => {
    expect(() =>
      validateArchitectureGraph(nodes, [
        ...connections,
        {
          id: 'interface-application',
          from: 'interface',
          to: 'data',
          label: 'Duplicate connection',
        },
      ]),
    ).toThrow('Architecture connection IDs must be unique');
  });

  it('rejects connections that reference unknown nodes', () => {
    expect(() =>
      validateArchitectureGraph(nodes, [
        ...connections,
        { id: 'invalid', from: 'data', to: 'unknown', label: 'Invalid' },
      ]),
    ).toThrow('Architecture connection invalid references an unknown node');
  });
});
