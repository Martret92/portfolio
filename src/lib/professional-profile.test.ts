import { describe, expect, it } from 'vitest';

import {
  getProfessionalProfile,
  professionalLinks,
  publicCvPath,
} from '../content/professional-profile';
import { locales } from '../i18n/config';

describe('professional profile content', () => {
  it('keeps verified public destinations stable', () => {
    expect(professionalLinks).toEqual({
      email: 'jaime.martret@gmail.com',
      github: 'https://github.com/Martret92',
      linkedin: 'https://www.linkedin.com/in/jaime-martret/',
      credential:
        'https://www.credly.com/badges/77c61d68-3aea-4011-83ba-060dbde3f766/public_url',
    });
    expect(publicCvPath).toBe('/jaime-martret-full-stack-cv.pdf');
  });

  it.each(locales)('%s identifies Jaime without provisional copy', (locale) => {
    const profile = getProfessionalProfile(locale);
    const serialized = JSON.stringify(profile);

    expect(profile.identity).toBe('Jaime Martret');
    expect(serialized).not.toMatch(
      /Developer Name|Nombre de desarrollo|placeholder|provisional|temporary portfolio|base temporal/i,
    );
  });

  it('states education status accurately in both locales', () => {
    const english = getProfessionalProfile('en');
    const spanish = getProfessionalProfile('es');

    expect(english.education.entries[0].status).toBe('In progress');
    expect(english.education.entries[2].status).toBe('Studies not completed');
    expect(spanish.education.entries[0].status).toBe('En curso');
    expect(spanish.education.entries[2].status).toBe('Estudios no finalizados');
  });

  it('does not introduce prohibited professional claims or private contact data', () => {
    const content = locales
      .map((locale) => JSON.stringify(getProfessionalProfile(locale)))
      .join(' ');

    expect(content).not.toMatch(
      /senior developer|experienced software engineer|professional backend engineer|cloud engineer|expert|specialist/i,
    );
    expect(content).not.toMatch(/\+34|\b[679]\d{8}\b/);
  });
});
