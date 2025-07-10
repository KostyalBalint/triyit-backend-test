export default {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  testMatch: ["**/*.e2e.test.ts"],
  modulePathIgnorePatterns: ["<rootDir>/dist/", "<rootDir>/node_modules/"],
  extensionsToTreatAsEsm: [".ts"],
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
  setupFilesAfterEnv: ["<rootDir>/src/test-helpers/setup-e2e.ts"],
  testTimeout: 30000, // 30 seconds for E2E tests
  verbose: true,
};