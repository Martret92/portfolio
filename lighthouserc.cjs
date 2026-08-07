const { chromium } = require('@playwright/test');

module.exports = {
  ci: {
    collect: {
      startServerCommand: 'pnpm preview --host 127.0.0.1',
      startServerReadyPattern: 'Local',
      startServerReadyTimeout: 30000,
      url: [
        'http://127.0.0.1:4321/en',
        'http://127.0.0.1:4321/es',
        'http://127.0.0.1:4321/en/projects/questboard',
        'http://127.0.0.1:4321/es/projects/questboard',
        'http://127.0.0.1:4321/en/projects/devdata-generator',
        'http://127.0.0.1:4321/es/projects/devdata-generator',
        'http://127.0.0.1:4321/en/projects/duckyarena',
        'http://127.0.0.1:4321/es/projects/duckyarena',
      ],
      numberOfRuns: 2,
      chromePath: chromium.executablePath(),
      settings: {
        chromeFlags: '--headless --no-sandbox --disable-dev-shm-usage',
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 200 }],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: '.lighthouseci',
      reportFilenamePattern: '%%PATHNAME%%-%%DATETIME%%-report.%%EXTENSION%%',
    },
  },
};
