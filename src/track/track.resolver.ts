import { QueryResolvers, TrackResolvers } from "../generated/graphql";
import { trackMapper } from "./track.mapper";
import { Context } from "../types";
import { albumMapper } from "../album/album.mapper";

export const trackQueries: QueryResolvers = {
  track: async (parent, args, context) => {
    const track = await context.prisma.tracks.findUnique({
      where: { TrackId: Number(args.id) },
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
