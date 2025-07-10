import { config } from "dotenv";
import path from "path";
import { logger } from "../utils/logger.js";

config({ path: path.resolve(process.cwd(), ".env.test") });

global.beforeAll = global.beforeAll || (() => {});
global.afterAll = global.afterAll || (() => {});

beforeAll(() => {
  logger.info("Starting E2E tests with sample database");
});

afterAll(() => {
  logger.info("E2E tests completed");
});
