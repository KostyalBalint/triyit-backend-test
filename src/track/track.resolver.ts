import { QueryResolvers, TrackResolvers } from "../generated/graphql.js";
import { trackMapper } from "./track.mapper.js";
import { Context } from "../types.js";
import { albumMapper } from "../album/album.mapper.js";

export const trackQueries: QueryResolvers = {
  track: async (parent, args, context) => {
    const trackId = parseInt(args.id, 10);
    if (isNaN(trackId)) {
      throw new Error(`Invalid track ID: ${args.id}`);
    }

    const track = await context.prisma.tracks.findUnique({
      where: { TrackId: trackId },
    });

    if (!track) {
      throw new Error(`Track with ID ${args.id} not found`);
    }
    return trackMapper(track);
  },
};

export const trackFieldResolvers: TrackResolvers<
  Context,
  ReturnType<typeof trackMapper>
> = {
  album: async (parent, args, context) => {
    const album = await context.prisma.albums.findUnique({
      where: { AlbumId: parent.AlbumId },
    });

    if (!album) {
      throw new Error(`Album with ID ${parent.AlbumId} not found`);
    }
    return albumMapper(album);
  },
};
