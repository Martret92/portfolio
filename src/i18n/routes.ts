import { defaultLocale, isLocale, type Locale } from './config';

export function getLocaleFromPathname(pathname: string): Locale {
  const [, segment] = pathname.split('/');

  return isLocale(segment) ? segment : defaultLocale;
}

export function getLocalizedPath(locale: Locale, pathname = '/'): string {
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;

  const segments = normalizedPath.split('/').filter(Boolean);

  if (isLocale(segments[0])) {
    segments.shift();
  }

  const rest = segments.length > 0 ? `/${segments.join('/')}` : '';

  return `/${locale}${rest}`;
}

export function getAlternateLocale(locale: Locale): Locale {
  return locale === 'en' ? 'es' : 'en';
}

export function getAlternateLocalePath(
  locale: Locale,
  pathname: string,
): string {
  return getLocalizedPath(getAlternateLocale(locale), pathname);
}
