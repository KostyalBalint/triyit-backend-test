import { QueryResolvers, TrackResolvers } from "../generated/graphql";
import { trackMapper } from "./track.mapper";
import { Context } from "../types";
import { albumMapper } from "../album/album.mapper";

export const trackQueries: QueryResolvers = {
  track: (parent, args, context) => {
    return context.prisma.tracks
      .findUnique({ where: { TrackId: Number(args.id) } })
      .then((track) => {
        if (!track) {
          throw new Error(`Track with ID ${args.id} not found`);
        }
        return trackMapper(track);
      });
  },
};

export const trackFieldResolvers: TrackResolvers<
  Context,
  ReturnType<typeof trackMapper>
> = {
  album: (parent, args, context) => {
    return context.prisma.albums
      .findUnique({ where: { AlbumId: parent.AlbumId } })
      .then((album) => {
        if (!album) {
          throw new Error(`Album with ID ${parent.AlbumId} not found`);
        }
        return albumMapper(album);
      });
  },
};
