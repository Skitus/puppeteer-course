module.exports = {
  verbose: true,
  rootDir: ".",
  testTimeout: 30000,
  testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],
  testEnvironment: "jest-environment-puppeteer",
  setupFilesAfterEnv: ["jest-puppeteer"],
  globalSetup: "jest-environment-puppeteer/setup",
  globalTeardown: "jest-environment-puppeteer/teardown",
};
