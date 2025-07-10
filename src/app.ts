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

  try {
    await prisma.$connect();
    logger.info("Database connection established successfully");
  } catch (error) {
    logger.error("Failed to connect to database:", error);
    throw new Error("Database connection failed");
  }

  let typeDefs;
  try {
    logger.info("Loading GraphQL schema files...");
    typeDefs = mergeTypeDefs(
      loadFilesSync(path.join(__dirname, "/**/*.graphql")),
    );
  } catch (error) {
    logger.error("Failed to load GraphQL schema files:", error);
    throw new Error("GraphQL schema loading failed");
  }

  let schema;
  try {
    logger.debug("Creating executable schema...");
    schema = makeExecutableSchema({
      typeDefs,
      resolvers,
    });
  } catch (error) {
    logger.error("Failed to create executable schema:", error);
    throw new Error("GraphQL schema creation failed");
  }

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

  try {
    await server.start();
    server.applyMiddleware({ app, path: config.gqlPath });
  } catch (error) {
    logger.error("Failed to start Apollo Server:", error);
    throw new Error("Apollo Server startup failed");
  }

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
