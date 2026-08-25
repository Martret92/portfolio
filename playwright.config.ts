import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'line',
  use: {
    baseURL: 'http://127.0.0.1:4321',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: 'pnpm preview --host 127.0.0.1',
      url: 'http://127.0.0.1:4321',
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'pnpm dev --host 127.0.0.1 --port 4322',
      url: 'http://127.0.0.1:4322/en/design-system',
      reuseExistingServer: !process.env.CI,
      env: { CODEX_THREAD_ID: '' },
    },
  ],
});
