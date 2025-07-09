import { Resolvers } from "../../generated/graphql.js";
import { albumQueries } from "./album";

export const resolvers: Resolvers = {
  Query: {
    ...albumQueries,
  },
  Mutation: {},
};
