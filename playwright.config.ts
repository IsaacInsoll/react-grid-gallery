import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './test/browser',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'github' : 'list',
  snapshotPathTemplate: '{testDir}/__screenshots__/{arg}{ext}',
  expect: {
    toHaveScreenshot: {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixels: 0,
      scale: 'css',
    },
  },
  use: {
    colorScheme: 'light',
    deviceScaleFactor: 1,
    locale: 'en-US',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    viewport: { width: 800, height: 800 },
  },
  projects: [
    {
      name: 'react-18-browser',
      testMatch: /gallery\.(links|visual)\.spec\.ts/,
      use: { baseURL: 'http://127.0.0.1:4173' },
    },
    {
      name: 'react-19-smoke',
      testMatch: /react-19\.smoke\.spec\.ts/,
      use: { baseURL: 'http://127.0.0.1:4174' },
    },
  ],
  webServer: [
    {
      command:
        'vite --config test/fixtures/gallery/vite.config.ts --mode react18 --host 0.0.0.0 --port 4173',
      port: 4173,
      reuseExistingServer: !process.env.CI,
    },
    {
      command:
        'vite --config test/fixtures/gallery/vite.config.ts --mode react19 --host 0.0.0.0 --port 4174',
      port: 4174,
      reuseExistingServer: !process.env.CI,
    },
  ],
});
