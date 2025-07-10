import { AlbumResolvers, QueryResolvers } from "../generated/graphql";
import { albumMapper } from "./album.mapper";
import { artistMapper } from "../artist/artist.mapper";
import { trackMapper } from "../track/track.mapper";
import { Context } from "../types";
import { isSimilarityMatch } from "../utils/similarity";
import { config } from "../config";
import { logger } from "../utils/logger";

export const albumQueries: QueryResolvers = {
  albums: async (parent, args, context) => {
    try {
      if (!args.title) {
        const albums = await context.prisma.albums.findMany();
        return albums.map(albumMapper);
      }

      const allAlbums = await context.prisma.albums.findMany();
      const matchingAlbums = allAlbums.filter(
        (album) =>
          album.Title &&
          isSimilarityMatch(
            album.Title,
            args.title,
            config.similarityThreshold,
          ),
      );

      return matchingAlbums.map(albumMapper);
    } catch (error) {
      logger.error(`Error fetching albums with title ${args.title}:`, error);
      throw new Error(`Failed to fetch albums: ${error.message}`);
    }
  },
  album: async (parent, args, context) => {
    const albumId = parseInt(args.id, 10);
    if (isNaN(albumId)) {
      throw new Error(`Invalid album ID: ${args.id}`);
    }

    const album = await context.prisma.albums.findUnique({
      where: { AlbumId: albumId },
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

    if (!artist) {
      throw new Error(`Artist with ID ${parent.ArtistId} not found`);
    }

    return artistMapper(artist);
  },
  tracks: async (parent, args, context) => {
    try {
      const tracks = await context.prisma.tracks.findMany({
        where: { AlbumId: parent.AlbumId },
      });

      return tracks.map(trackMapper);
    } catch (error) {
      logger.error(`Error fetching tracks for album ${parent.AlbumId}:`, error);
      throw new Error(`Failed to fetch tracks: ${error.message}`);
    }
  },
};
