import { describe, expect, it } from 'vitest';

import { getProjectInspectionModel } from '../content/project-inspections';
import {
  getActiveConnectionIds,
  getConnectedSystemNodeIds,
  getMappedProductId,
  getMappedSystemNodeIds,
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
