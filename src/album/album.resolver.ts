import { AlbumResolvers, QueryResolvers } from "../generated/graphql";
import { albumMapper } from "./album.mapper";
import { artistMapper } from "../artist/artist.mapper";
import { trackMapper } from "../track/track.mapper";
import { Context } from "../types";
import { isSimilarityMatch } from "../utils/similarity";
import { config } from "../config";

export const albumQueries: QueryResolvers = {
  albums: async (parent, args, context) => {
    if (!args.title) {
      const albums = await context.prisma.albums.findMany();
      return albums.map(albumMapper);
    }

    const allAlbums = await context.prisma.albums.findMany();
    const matchingAlbums = allAlbums.filter(
      (album) =>
        album.Title &&
        isSimilarityMatch(album.Title, args.title, config.similarityThreshold),
    );

    return matchingAlbums.map(albumMapper);
  },
  album: async (parent, args, context) => {
    const album = await context.prisma.albums.findUnique({
      where: { AlbumId: Number(args.id) },
    });

    if (!album) {
      throw new Error(`Album with ID ${args.id} not found`);
    }

    return albumMapper(album);
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
