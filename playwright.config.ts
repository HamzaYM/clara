import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 1,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:3100",
  },
  webServer: {
    command: "npm run dev -- -p 3100",
    port: 3100,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
