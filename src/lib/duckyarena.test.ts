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
    '%s contains five verified screenshots and the current stack',
    (locale) => {
      const content = getDuckyArenaContent(locale);

      expect(Object.keys(content.images)).toHaveLength(5);
      expect(content.stack).toEqual([
        'React',
        'Vite',
        'Node.js',
        'Express',
        'Socket.IO',
        'PostgreSQL',
        'Docker',
        'GitHub Actions',
      ]);
    },
  );

  it('keeps collaboration, contribution, quality, and limits explicit', () => {
    const english = getDuckyArenaContent('en');
    const spanish = getDuckyArenaContent('es');

    expect(english.overview.paragraphs.join(' ')).toContain(
      'collaborative academic foundation',
    );
    expect(spanish.overview.paragraphs.join(' ')).toContain(
      'base académica colaborativa',
    );
    expect(english.contribution.introduction).toContain(
      'Built on a collaborative academic foundation',
    );
    expect(spanish.contribution.introduction).toContain(
      'Partiendo de una base académica colaborativa',
    );
    expect(english.quality.items.join(' ')).toContain('64 backend tests');
    expect(english.quality.items.join(' ')).toContain(
      'Browser E2E is not automated',
    );
    expect(english.outcomes.limits).toContain(
      'The realtime layer does not support horizontal scaling.',
    );
  });

  it('does not introduce forbidden ownership or completion claims', () => {
    const copy = locales
      .map((locale) => JSON.stringify(getDuckyArenaContent(locale)))
      .join(' ');

    expect(copy).not.toMatch(
      /individual project|built the entire backend|designed the entire database|production-ready|production-grade|publicly deployed|live demo|play now|horizontally scalable multiplayer platform/i,
    );
  });
});
