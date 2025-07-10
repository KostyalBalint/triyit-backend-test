import express from "express";
import { ApolloServer } from "apollo-server-express";
import { loadFilesSync } from "@graphql-tools/load-files";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { mergeTypeDefs } from "@graphql-tools/merge";
import path from "path";
import { fileURLToPath } from "url";
import { resolvers } from "./resolvers";
import { PrismaClient } from "@prisma/client";
import { Context } from "./types";
import { config } from "./config";
import { logger, dbLogger, httpLogger } from "./utils/logger";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface AppInstance {
  app: express.Application;
  server: ApolloServer;
  prisma: PrismaClient;
}

export async function createApp(): Promise<AppInstance> {
  logger.info("Initializing Prisma client...");
  const prisma = new PrismaClient({
    log: [
      { emit: "event", level: "query" },
      { emit: "event", level: "error" },
      { emit: "event", level: "info" },
      { emit: "event", level: "warn" },
    ],
  });

  prisma.$on("query", (e) => {
    dbLogger.debug(`Query: ${e.query} - Duration: ${e.duration}ms`);
  });

  prisma.$on("error", (e) => {
    dbLogger.error(`Database error: ${e.message}`);
  });

  prisma.$on("info", (e) => {
    dbLogger.info(`Database info: ${e.message}`);
  });

  prisma.$on("warn", (e) => {
    dbLogger.warn(`Database warning: ${e.message}`);
  });

  logger.info("Loading GraphQL schema files...");
  const typeDefs = mergeTypeDefs(
    loadFilesSync(path.join(__dirname, "/**/*.graphql")),
  );

  logger.debug("Creating executable schema...");
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  logger.debug("Setting up Express app...");
  const app = express();

  app.use((req, res, next) => {
    httpLogger.http(`${req.method} ${req.url} - ${req.ip}`);
    next();
  });

  logger.info("Creating Apollo Server...");
  const server = new ApolloServer({
    schema,
    context: (): Context => ({
      prisma,
    }),
    plugins: [
      {
        requestDidStart() {
          return Promise.resolve({
            didResolveOperation(requestContext) {
              logger.info(
                `GraphQL operation: ${requestContext.request.operationName || "anonymous"}`,
              );
              return Promise.resolve();
            },
            didEncounterErrors(requestContext) {
              logger.error(
                `GraphQL errors: ${JSON.stringify(requestContext.errors)}`,
              );
              return Promise.resolve();
            },
          });
        },
      },
    ],
  });

  await server.start();
  server.applyMiddleware({ app, path: config.gqlPath });

  logger.info("Application setup completed");
  return { app, server, prisma };
}

export async function closeApp(appInstance: AppInstance): Promise<void> {
  logger.info("Shutting down Apollo Server...");
  await appInstance.server.stop();
  logger.info("Disconnecting Prisma client...");
  await appInstance.prisma.$disconnect();
  logger.info("Application shutdown completed");
}
