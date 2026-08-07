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
});
