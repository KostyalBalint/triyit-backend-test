import { config } from "dotenv";
import path from "path";

config({ path: path.resolve(process.cwd(), ".env.test") });

global.beforeAll = global.beforeAll || (() => {});
global.afterAll = global.afterAll || (() => {});

beforeAll(() => {
  console.log("Starting E2E tests with sample database");
});

afterAll(() => {
  console.log("E2E tests completed");
});
