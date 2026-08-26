import { describe, expect, it } from 'vitest';

import {
  getQuestBoardContent,
  questBoardLinks,
} from '../content/projects/questboard';

describe('QuestBoard content', () => {
  it('keeps verified workflow and external links explicit', () => {
    const content = getQuestBoardContent('en');

    expect(content.workflowStates).toEqual([
      'BACKLOG',
      'READY',
      'IN_PROGRESS',
      'REVIEW',
      'DONE',
    ]);
    expect(content.roles).toEqual(['OWNER', 'REVIEWER', 'CONTRIBUTOR']);
    expect(questBoardLinks.repository).toBe(
      'https://github.com/Martret92/questboard',
    );
    expect(questBoardLinks.apiDocs).toBe(
      'https://questboard-4tnl.onrender.com/api/docs/',
    );
  });

  it('provides equivalent localized case-study structure', () => {
    const english = getQuestBoardContent('en');
    const spanish = getQuestBoardContent('es');

    for (const section of [
      'overview',
      'workflow',
      'dependencies',
      'permissions',
      'audit',
      'concurrency',
      'challenge',
      'delivery',
    ] as const) {
      expect(english[section].heading).toBeTruthy();
      expect(spanish[section].heading).toBeTruthy();
    }
  });

  it('keeps the localized Home flagship grounded in verified domain rules', () => {
    const english = getQuestBoardContent('en');
    const spanish = getQuestBoardContent('es');

    expect(english.home.evidence).toHaveLength(4);
    expect(spanish.home.evidence).toHaveLength(4);
    expect(english.home.rules).toHaveLength(2);
    expect(spanish.home.rules).toHaveLength(2);
    expect(english.home.evidence.map(({ heading }) => heading)).toEqual([
      'Transition API',
      'Contextual authority',
      'Durable audit',
      'Transactional integrity',
    ]);
    expect(english.home.rules[0].value).toContain('DONE before READY');
    expect(spanish.home.rules[0].value).toContain('DONE antes de READY');
  });
});
