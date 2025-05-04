import { defineConfig, devices } from '@playwright/test';
import path from 'path';

export default defineConfig({
  testDir: path.join(__dirname),
  timeout: 30_000,
  use: {
    baseURL: 'http://localhost:4200',   
    headless: true,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  testMatch: '*.spec.ts',
});
