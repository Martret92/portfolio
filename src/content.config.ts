import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

import { locales } from './i18n/config';
import { isProjectId, validateProjectContentIdentity } from './lib/projects';

const projects = defineCollection({
  loader: glob({
    base: './src/content/project-entries',
    pattern: '**/*.md',
    generateId: ({ entry, data }) =>
      validateProjectContentIdentity(entry, data),
  }),
  schema: z.object({
    projectId: z.string().refine(isProjectId, 'Unknown project ID'),
    locale: z.enum(locales),
    title: z.string().min(1),
    summary: z.string().min(1),
  }),
});

export const collections = { projects };
