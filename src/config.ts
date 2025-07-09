import pkg from "env-var";
const { get } = pkg;

export const config = {
  port: get("PORT").default("8080").asString(),
  host: get("HOST").default("localhost").asString(),
  gqlPath: get("GQL_PATH").default("/gql").asString(),
};
