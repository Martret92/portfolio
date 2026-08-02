import { describe, expect, it } from 'vitest';

import { getFoundationStatus } from './foundation';

describe('foundation', () => {
  it('exposes a passing smoke test for the unit-test pipeline', () => {
    expect(getFoundationStatus()).toBe('ready');
  });
});
