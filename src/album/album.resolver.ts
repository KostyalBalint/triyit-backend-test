import { AlbumResolvers, QueryResolvers } from "../generated/graphql";
import { albumMapper } from "./album.mapper";
import { artistMapper } from "../artist/artist.mapper";
import { trackMapper } from "../track/track.mapper";
import { Context } from "../types";

export const albumQueries: QueryResolvers = {
  albums: async (parent, args, context) => {
    return (
      await context.prisma.albums.findMany({
        where: {
          //TODO: Implement a more flexible search
          Title: {
            contains: args.title || "",
          },
        },
      })
    ).map(albumMapper);
  },
};

export const albumFieldResolvers: AlbumResolvers<
  Context,
  ReturnType<typeof albumMapper>
> = {
  artist: async (parent, args, context) => {
    const artist = await context.prisma.artists.findUnique({
      where: { ArtistId: parent.ArtistId },
    });
    return artistMapper(artist);
  },
  tracks: async (parent, args, context) => {
    const tracks = await context.prisma.tracks.findMany({
      where: { AlbumId: parent.AlbumId },
    });

    return tracks.map(trackMapper);
  },
};
