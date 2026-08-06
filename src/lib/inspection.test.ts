import { describe, expect, it } from 'vitest';

import { getProjectInspectionModel } from '../content/project-inspections';
import { validateProjectInspectionModel } from './inspection';
import type { ProjectInspectionModel } from '../types/inspection';

const model = getProjectInspectionModel('devdata-generator', 'en');
const change = (
  patch: Partial<ProjectInspectionModel>,
): ProjectInspectionModel => ({
  ...model,
  ...patch,
});

describe('project inspection model', () => {
  it('validates the verified model and keeps identity separate from inspection content', () => {
    expect(() => validateProjectInspectionModel(model)).not.toThrow();
    expect(model.systemNodes[0]).not.toHaveProperty('productCounterpart');
    expect(model.systemNodes[0]?.inspection).not.toHaveProperty('label');
    expect(model.systemNodes[0]?.inspection).not.toHaveProperty('producedBy');
    expect(model.systemNodes[0]?.inspection).not.toHaveProperty('consumes');
    expect(model.systemNodes[0]?.inspection).not.toHaveProperty('consumedBy');
  });

  it('contains exactly the three verified V1 evidence artifacts', () => {
    expect(model.evidence).toHaveLength(3);
    expect(model.evidence.map(({ id }) => id)).toEqual([
      'generation-boundary',
      'configuration-invalidation',
      'multiple-output-representations',
    ]);
    expect(
      model.evidence
        .filter(({ type }) => type === 'source')
        .map(({ provenance }) => provenance),
    ).toEqual(['src/utils/generateData.js', 'src/App.jsx']);
    const output = model.evidence.find(
      ({ id }) => id === 'multiple-output-representations',
    );
    expect(output).toMatchObject({
      type: 'output',
      illustrativeLabel: 'Illustrative data, not a recorded execution',
    });
    if (output?.type === 'output') {
      expect(output.formats.map(({ id }) => id)).toEqual([
        'json',
        'csv',
        'sql',
      ]);
      for (const format of output.formats) {
        expect(format.content).toContain('Ana Torres');
        expect(format.content).toContain('ana.torres@example.com');
      }
    }
  });

  it('defines one localized authentic Product visual with intrinsic dimensions', () => {
    expect(model.productVisual).toEqual({
      src: '/images/projects/devdata/devdata-product-overview.png',
      optimizedSrc: '/images/projects/devdata/devdata-product-overview.jpg',
      width: 845,
      height: 1172,
      alt: 'DevData Generator configured with the Users template and three generated records shown in a table.',
      caption:
        'The real DevData interface connects dataset configuration, generation, preview and export in one workflow.',
    });

    const spanish = getProjectInspectionModel('devdata-generator', 'es');
    expect(spanish.productVisual.src).toBe(model.productVisual.src);
    expect(spanish.productVisual.alt).toContain('tres registros generados');
    expect(spanish.productVisual.caption).toContain('interfaz real de DevData');
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

  it('rejects invalid evidence references and incomplete output evidence', () => {
    expect(() =>
      validateProjectInspectionModel(
        change({
          evidence: [
            { ...model.evidence[0]!, relatedNodeIds: ['missing-node'] },
          ],
        }),
      ),
    ).toThrow('references unknown node');

    const output = model.evidence.find(({ type }) => type === 'output');
    if (!output || output.type !== 'output') throw new Error('Missing output');
    expect(() =>
      validateProjectInspectionModel(
        change({
          evidence: [{ ...output, formats: output.formats.slice(0, 2) }],
        }),
      ),
    ).toThrow('requires JSON, CSV and SQL');
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
