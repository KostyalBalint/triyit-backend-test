import { QueryResolvers } from "../../generated/graphql";

export const albumQueries: QueryResolvers = {
  albums: async (parent, args, context) => {
    //return context.prisma.album.findMany();
    return [];
  },
};
