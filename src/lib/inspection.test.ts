import { describe, expect, it } from 'vitest';

import { getProjectInspectionModel } from '../content/project-inspections';
import {
  getActiveConnectionIds,
  getConnectedSystemNodeIds,
  getMappedProductId,
  getMappedSystemNodeIds,
  getNodeRelationships,
  getRelationshipGroups,
  validateProjectInspectionModel,
} from './inspection';
import type { ProjectInspectionModel } from '../types/inspection';

const model = getProjectInspectionModel('devdata-generator', 'en');
const change = (
  patch: Partial<ProjectInspectionModel>,
): ProjectInspectionModel => ({
  ...model,
  ...patch,
});

describe('project inspection model', () => {
  it('validates the verified model and explicit product/system mappings', () => {
    expect(() => validateProjectInspectionModel(model)).not.toThrow();
    expect(getMappedSystemNodeIds(model.mappings, 'generate')).toEqual([
      'validation',
      'generate-data',
      'faker',
    ]);
    expect(getMappedSystemNodeIds(model.mappings, 'result')).toEqual([
      'generated-data',
    ]);
    expect(getMappedProductId(model.mappings, 'generated-data')).toBe('result');
    expect(model.systemNodes[0]).not.toHaveProperty('productCounterpart');
    expect(model.systemNodes[0]?.inspection).not.toHaveProperty('label');
    expect(model.systemNodes[0]?.inspection).not.toHaveProperty('producedBy');
    expect(model.systemNodes[0]?.inspection).not.toHaveProperty('consumes');
    expect(model.systemNodes[0]?.inspection).not.toHaveProperty('consumedBy');
  });

  it.each([
    [
      'Product element',
      {
        productElements: [...model.productElements, model.productElements[0]!],
      },
    ],
    [
      'System node',
      { systemNodes: [...model.systemNodes, model.systemNodes[0]!] },
    ],
    [
      'System connection',
      { connections: [...model.connections, model.connections[0]!] },
    ],
  ])('rejects duplicate %s IDs', (label, patch) => {
    expect(() => validateProjectInspectionModel(change(patch))).toThrow(
      `${label} IDs must be unique`,
    );
  });

  it('rejects unknown topology, mapping, and decision references', () => {
    expect(() =>
      validateProjectInspectionModel(
        change({
          connections: [{ ...model.connections[0]!, to: 'missing' }],
        }),
      ),
    ).toThrow('references an unknown node');
    expect(() =>
      validateProjectInspectionModel(
        change({
          mappings: [{ productId: 'missing', systemNodeIds: [] }],
        }),
      ),
    ).toThrow('unknown product');
    expect(() =>
      validateProjectInspectionModel(
        change({
          systemNodes: model.systemNodes.map((node) =>
            node.id === 'generated-data'
              ? {
                  ...node,
                  inspection: {
                    ...node.inspection,
                    relatedDecisionIds: ['missing'],
                  },
                }
              : node,
          ),
        }),
      ),
    ).toThrow('unknown decision');
  });

  it('derives connected nodes and active connections from selection', () => {
    expect(
      getConnectedSystemNodeIds(model.connections, 'generated-data'),
    ).toEqual(['generate-data', 'preview', 'export', 'configuration-state']);
    expect(getActiveConnectionIds(model.connections, null)).toEqual([]);
    expect(getActiveConnectionIds(model.connections, 'generated-data')).toEqual(
      [
        'generation-result',
        'result-preview',
        'result-export',
        'configuration-invalidates-result',
      ],
    );
  });

  it('derives directional flow, dependency, and invalidation relationships', () => {
    const generated = getNodeRelationships(model.connections, 'generated-data');
    expect(
      generated.map(({ connection, direction, targetNodeId }) => [
        connection.type,
        direction,
        targetNodeId,
      ]),
    ).toEqual([
      ['flow', 'incoming', 'generate-data'],
      ['flow', 'outgoing', 'preview'],
      ['flow', 'outgoing', 'export'],
      ['invalidation', 'incoming', 'configuration-state'],
    ]);

    expect(
      getNodeRelationships(model.connections, 'generate-data').find(
        ({ connection }) => connection.id === 'faker-generation',
      ),
    ).toMatchObject({
      direction: 'incoming',
      targetNodeId: 'faker',
      connection: { type: 'dependency' },
    });
  });

  it('presents verified relationships with directional semantics', () => {
    const groups = getRelationshipGroups(
      model.connections,
      model.systemNodes,
      'generated-data',
    );
    expect(
      Object.fromEntries(
        groups.map(({ semantic, relationships }) => [
          semantic,
          relationships.map(({ targetNodeId }) => targetNodeId),
        ]),
      ),
    ).toEqual({
      producedBy: ['generate-data'],
      consumedBy: ['preview', 'export'],
      invalidatedBy: ['configuration-state'],
    });

    expect(
      getRelationshipGroups(
        model.connections,
        model.systemNodes,
        'generate-data',
      ).find(({ semantic }) => semantic === 'dependsOn')?.relationships,
    ).toEqual([expect.objectContaining({ targetNodeId: 'faker' })]);
  });

  it('requires every node to map to exactly one product', () => {
    expect(() =>
      validateProjectInspectionModel(
        change({
          mappings: model.mappings.map((mapping) =>
            mapping.productId === 'configure'
              ? { ...mapping, systemNodeIds: [] }
              : mapping,
          ),
        }),
      ),
    ).toThrow('is not mapped to a product');

    expect(() =>
      validateProjectInspectionModel(
        change({
          mappings: model.mappings.map((mapping) =>
            mapping.productId === 'generate'
              ? {
                  ...mapping,
                  systemNodeIds: [
                    ...mapping.systemNodeIds,
                    'configuration-state',
                  ],
                }
              : mapping,
          ),
        }),
      ),
    ).toThrow('must map to one product');
  });
});
