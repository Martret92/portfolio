import type { Locale } from '@i18n/config';

export interface Project {
  readonly id: string;
  readonly slug: string;
}

export interface ProjectEditorialIdentity {
  readonly projectId: string;
  readonly locale: Locale;
}

export interface ProjectEditorialData extends ProjectEditorialIdentity {
  readonly title: string;
  readonly summary: string;
}

export interface ProjectEditorialEntry {
  readonly data: ProjectEditorialData;
}
