import { Resolvers } from "./generated/graphql.js";
import { albumFieldResolvers, albumQueries } from "./album/album.resolver.js";
import {
  artistFieldResolvers,
  artistQueries,
} from "./artist/artist.resolver.js";
import { trackFieldResolvers, trackQueries } from "./track/track.resolver.js";

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
