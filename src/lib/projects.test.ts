import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { isLocale } from '../i18n/config';
import type { ProjectEditorialIdentity } from '../types/project';
import {
  assertProjectLocaleParity,
  getProject,
  requireProject,
  validateProjectContentIdentity,
} from './projects';

const projectEntriesDirectory = resolve('src/content/project-entries');

function discoverMarkdownFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      return discoverMarkdownFiles(entryPath);
    }

    return entry.isFile() && entry.name.endsWith('.md') ? [entryPath] : [];
  });
}

function readEditorialIdentity(filePath: string): ProjectEditorialIdentity {
  const source = readFileSync(filePath, 'utf8');
  const projectId = /^projectId:\s*(.+)$/m.exec(source)?.[1]?.trim();
  const locale = /^locale:\s*(.+)$/m.exec(source)?.[1]?.trim();

  if (!projectId || !isLocale(locale)) {
    throw new Error(`Invalid editorial identity in ${filePath}`);
  }

  return { projectId, locale };
}

const editorialEntries = discoverMarkdownFiles(projectEntriesDirectory).map(
  readEditorialIdentity,
);

describe('project data', () => {
  it('retrieves a project by its stable ID', () => {
    expect(getProject('devdata-generator')).toEqual({
      id: 'devdata-generator',
      slug: 'devdata-generator',
    });
  });

  it('rejects invalid project IDs', () => {
    expect(getProject('unknown-project')).toBeUndefined();
    expect(() => requireProject('unknown-project')).toThrow(
      'Unknown project ID: unknown-project',
    );
  });

  it('accepts exactly one editorial entry per supported locale', () => {
    expect(() => assertProjectLocaleParity(editorialEntries)).not.toThrow();
  });

  it('rejects missing or duplicate localized entries', () => {
    const withoutSpanishDevData = editorialEntries.filter(
      (entry) =>
        entry.projectId !== 'devdata-generator' || entry.locale !== 'es',
    );
    const englishDevData = editorialEntries.find(
      (entry) =>
        entry.projectId === 'devdata-generator' && entry.locale === 'en',
    );

    expect(() => assertProjectLocaleParity(withoutSpanishDevData)).toThrow(
      'Expected exactly one es entry for project devdata-generator; found 0',
    );

    expect(englishDevData).toBeDefined();
    expect(() => {
      if (!englishDevData) {
        throw new Error('Missing English DevData test entry');
      }

      assertProjectLocaleParity([...editorialEntries, englishDevData]);
    }).toThrow(
      'Expected exactly one en entry for project devdata-generator; found 2',
    );
  });

  it('requires localized entries to match their locale and project path', () => {
    expect(
      validateProjectContentIdentity('en/devdata-generator.md', {
        projectId: 'devdata-generator',
        locale: 'en',
      }),
    ).toBe('en/devdata-generator');

    expect(() =>
      validateProjectContentIdentity('es/devdata-generator.md', {
        projectId: 'devdata-generator',
        locale: 'en',
      }),
    ).toThrow('expected path en/devdata-generator.md');
  });

  it('keeps the English and Spanish entries on the same stable project ID', () => {
    const devDataEntries = editorialEntries.filter(
      ({ projectId }) => projectId === 'devdata-generator',
    );

    expect(new Set(devDataEntries.map(({ projectId }) => projectId))).toEqual(
      new Set(['devdata-generator']),
    );
  });
});
