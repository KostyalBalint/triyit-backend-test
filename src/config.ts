import pkg from "env-var";
const { get } = pkg;
import dotenv from "dotenv";
import { LogLevel } from "./utils/logger.js";
dotenv.config();

export const config = {
  port: get("PORT").default("8080").asString(),
  host: get("HOST").default("localhost").asString(),
  gqlPath: get("GQL_PATH").default("/gql").asString(),
  similarityThreshold: get("SIMILARITY_THRESHOLD")
    .default(0.9)
    .asFloatPositive(),
  logLevel: get("LOG_LEVEL").asEnum([
    "error",
    "http",
    "info",
    "debug",
    "warn",
  ] as LogLevel[]),
};
