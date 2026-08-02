import { projects, type ProjectId } from '../content/projects';
import { isLocale, locales, type Locale } from '../i18n/config';
import type {
  Project,
  ProjectEditorialEntry,
  ProjectEditorialIdentity,
} from '../types/project';

export function isProjectId(value: string): value is ProjectId {
  return Object.hasOwn(projects, value);
}

export function getProject(projectId: string): Project | undefined {
  return isProjectId(projectId) ? projects[projectId] : undefined;
}

export function requireProject(projectId: string): Project {
  const project = getProject(projectId);

  if (!project) {
    throw new Error(`Unknown project ID: ${projectId}`);
  }

  return project;
}

export function getProjectEditorialEntry<TEntry extends ProjectEditorialEntry>(
  entries: readonly TEntry[],
  projectId: ProjectId,
  locale: Locale,
): TEntry | undefined {
  return entries.find(
    (entry) =>
      entry.data.projectId === projectId && entry.data.locale === locale,
  );
}

export function validateProjectContentIdentity(
  entryPath: string,
  data: Record<string, unknown>,
): string {
  const projectId = data.projectId;
  const locale = data.locale;

  if (typeof projectId !== 'string') {
    throw new Error(`${entryPath}: projectId must be a string`);
  }

  if (typeof locale !== 'string' || !isLocale(locale)) {
    throw new Error(`${entryPath}: locale must be a supported locale`);
  }

  const project = requireProject(projectId);
  const normalizedPath = entryPath.replaceAll('\\', '/');
  const expectedPath = `${locale}/${project.slug}.md`;

  if (normalizedPath !== expectedPath) {
    throw new Error(
      `${entryPath}: expected path ${expectedPath} for ${locale}/${projectId}`,
    );
  }

  return `${locale}/${projectId}`;
}

export function assertProjectLocaleParity(
  entries: readonly ProjectEditorialIdentity[],
): void {
  for (const projectId of Object.keys(projects) as ProjectId[]) {
    for (const locale of locales) {
      const matches = entries.filter(
        (entry) => entry.projectId === projectId && entry.locale === locale,
      );

      if (matches.length !== 1) {
        throw new Error(
          `Expected exactly one ${locale} entry for project ${projectId}; found ${matches.length}`,
        );
      }
    }
  }
}
