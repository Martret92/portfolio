import { describe, expect, it } from 'vitest';

import {
  duckyArenaRepository,
  getDuckyArenaContent,
} from '../content/projects/duckyarena';
import { locales } from '../i18n/config';

describe('DuckyArena verified story', () => {
  it('uses only the current repository as its public destination', () => {
    expect(duckyArenaRepository).toBe(
      'https://github.com/Martret92/DuckyArena',
    );
    expect(duckyArenaRepository).not.toMatch(/legacy|Isildu/);
  });

  it.each(locales)(
    '%s contains six evidence areas and the verified stack',
    (locale) => {
      const content = getDuckyArenaContent(locale);

      expect(Object.keys(content.evidence)).toHaveLength(6);
      expect(content.stack).toEqual([
        'React',
        'JavaScript',
        'Node.js',
        'Express',
        'PostgreSQL',
        'Docker',
        'REST API',
      ]);
    },
  );

  it('keeps collaboration, contribution, and limitations explicit', () => {
    const english = getDuckyArenaContent('en');
    const spanish = getDuckyArenaContent('es');

    expect(english.context.copy).toContain('three-person educational project');
    expect(spanish.context.copy).toContain(
      'proyecto educativo colaborativo de tres personas',
    );
    expect(english.contribution.heading).toBe('My contribution');
    expect(spanish.contribution.heading).toBe('Mi contribución');
    expect(english.status.copy).toMatch(
      /Authentication, broader frontend integration, automated tests and CI are still pending/,
    );
  });

  it('does not introduce forbidden ownership or completion claims', () => {
    const copy = locales
      .map((locale) => JSON.stringify(getDuckyArenaContent(locale)))
      .join(' ');

    expect(copy).not.toMatch(
      /individual project|built the entire backend|designed the entire database|production-ready|authentication is implemented|frontend integration is complete|automated tests already exist|CI already exists/i,
    );
  });
});
