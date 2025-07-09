import express from "express";
import { ApolloServer } from "apollo-server-express";
import { loadFilesSync } from "@graphql-tools/load-files";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { mergeTypeDefs } from "@graphql-tools/merge";
import path from "path";
import { fileURLToPath } from "url";
import { config } from "./config";
import { Context } from "./types.js";
import { resolvers } from "./resolvers";
import { PrismaClient } from "@prisma/client";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

const typeDefs = mergeTypeDefs(
  loadFilesSync(path.join(__dirname, "/**/*.graphql")),
);

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const app = express();
const server = new ApolloServer({
  schema,
  context: (): Context => ({
    prisma,
  }),
});

async function startServer() {
  await server.start();
  server.applyMiddleware({ app, path: config.gqlPath });

  app.listen(config.port, () => {
    console.log(
      `Listening on: http://localhost:${config.port}${server.graphqlPath}`,
    );
  });
}

startServer().catch((error) => {
  console.error("Error starting server:", error);
});
