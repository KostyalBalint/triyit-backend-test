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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface AppInstance {
  app: express.Application;
  server: ApolloServer;
  prisma: PrismaClient;
}

export async function createApp(): Promise<AppInstance> {
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

  await server.start();
  server.applyMiddleware({ app, path: config.gqlPath });

  return { app, server, prisma };
}

export async function closeApp(appInstance: AppInstance): Promise<void> {
  await appInstance.server.stop();
  await appInstance.prisma.$disconnect();
}
