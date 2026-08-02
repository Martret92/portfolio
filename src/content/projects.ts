import type { Project } from '../types/project';

export const projects = {
  'devdata-generator': {
    id: 'devdata-generator',
    slug: 'devdata-generator',
  },
} as const satisfies Record<string, Project>;

export type ProjectId = keyof typeof projects;
