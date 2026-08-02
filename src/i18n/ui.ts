import type { Locale } from './config';

const ui = {
  en: {
    language: {
      navigationLabel: 'Language selection',
      switchTo: 'Español',
      current: 'English',
    },
    foundation: {
      title: 'Portfolio',
      heading: 'Localization foundation',
      description:
        'The English route is generated statically. Portfolio content arrives in the next milestones.',
    },
  },
  es: {
    language: {
      navigationLabel: 'Selección de idioma',
      switchTo: 'English',
      current: 'Español',
    },
    foundation: {
      title: 'Portfolio',
      heading: 'Base de localización',
      description:
        'La ruta en español se genera de forma estática. El contenido del portfolio llegará en los siguientes hitos.',
    },
  },
} as const satisfies Record<Locale, object>;

export function useTranslations(locale: Locale) {
  return ui[locale];
}
