import pkg from "env-var";
const { get } = pkg;
import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: get("PORT").default("8080").asString(),
  host: get("HOST").default("localhost").asString(),
  gqlPath: get("GQL_PATH").default("/gql").asString(),
  similarityThreshold: get("SIMILARITY_THRESHOLD")
    .default(0.9)
    .asFloatPositive(),
};
