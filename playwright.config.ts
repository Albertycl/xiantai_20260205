import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:5072',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'Desktop',
      use: { viewport: { width: 1280, height: 720 } },
    },
    {
      name: 'Mobile',
      use: { viewport: { width: 430, height: 932 } },
    },
  ],
});
