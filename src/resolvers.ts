import { Resolvers } from "./generated/graphql";
import { albumFieldResolvers, albumQueries } from "./album/album.resolver";
import { artistFieldResolvers, artistQueries } from "./artist/artist.resolver";
import { trackFieldResolvers, trackQueries } from "./track/track.resolver";

export const resolvers: Resolvers = {
  Query: {
    ...albumQueries,
    ...artistQueries,
    ...trackQueries,
  },
  Album: {
    ...albumFieldResolvers,
  },
  Artist: {
    ...artistFieldResolvers,
  },
  Track: {
    ...trackFieldResolvers,
  },
};
