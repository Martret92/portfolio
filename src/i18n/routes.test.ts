import { describe, expect, it } from 'vitest';

import {
  getAlternateLocale,
  getAlternateLocalePath,
  getLocaleFromPathname,
  getLocalizedAlternatePaths,
  getLocalizedPath,
} from './routes';

describe('localized routes', () => {
  it('detects the locale from a localized pathname', () => {
    expect(getLocaleFromPathname('/en/projects/devdata-generator')).toBe('en');
    expect(getLocaleFromPathname('/es/about')).toBe('es');
  });

  it('falls back to the default locale for an unlocalized pathname', () => {
    expect(getLocaleFromPathname('/')).toBe('en');
    expect(getLocaleFromPathname('/projects/devdata-generator')).toBe('en');
  });

  it('adds a locale to an unlocalized pathname', () => {
    expect(getLocalizedPath('es', '/about')).toBe('/es/about');
  });

  it('replaces an existing locale instead of duplicating it', () => {
    expect(getLocalizedPath('es', '/en/projects/devdata-generator')).toBe(
      '/es/projects/devdata-generator',
    );
  });

  it('returns the opposite supported locale', () => {
    expect(getAlternateLocale('en')).toBe('es');
    expect(getAlternateLocale('es')).toBe('en');
  });

  it('preserves the current route when switching locale', () => {
    expect(getAlternateLocalePath('en', '/en/projects/devdata-generator')).toBe(
      '/es/projects/devdata-generator',
    );
  });

  it('builds localized and default alternate paths for the same page', () => {
    expect(
      getLocalizedAlternatePaths('/es/projects/devdata-generator'),
    ).toEqual({
      en: '/en/projects/devdata-generator',
      es: '/es/projects/devdata-generator',
      'x-default': '/en/projects/devdata-generator',
    });
  });
});
