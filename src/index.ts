import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { loadFilesSync } from '@graphql-tools/load-files';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { mergeTypeDefs } from '@graphql-tools/merge';
import path from 'path';
import { fileURLToPath } from 'url';
import { resolvers } from './graphql/resolvers';
import {config} from "./config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const typeDefs = mergeTypeDefs(loadFilesSync(path.join(__dirname, 'graphql/schemas/**/*.graphql')));

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

const app = express();
const server = new ApolloServer({ schema });

async function startServer() {
  await server.start();
  server.applyMiddleware({ app, path: config.gqlPath });
  
  app.listen(config.port, () => {
    console.log(`Listening on: http://localhost:${config.port}${server.graphqlPath}`);
  });
}

startServer().catch(error => {
  console.error('Error starting server:', error);
});