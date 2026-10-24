import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 120_000,
  expect: { timeout: 20_000 },
  retries: 0,
  workers: 1, // 单服务器 + 游戏内状态,串行执行
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:8619',
    headless: true,
  },
  webServer: {
    command: 'python3 -m http.server 8619',
    url: 'http://127.0.0.1:8619/index.html',
    reuseExistingServer: true,
    timeout: 15_000,
  },
});
