import { ArtistResolvers, QueryResolvers } from "../generated/graphql.js";
import { artistMapper } from "./artist.mapper.js";
import { albumMapper } from "../album/album.mapper.js";
import { Context } from "../types.js";
import { isSimilarityMatch } from "../utils/similarity.js";
import { config } from "../config.js";
import { logger } from "../utils/logger.js";

export const artistQueries: QueryResolvers = {
  artist: async (_, { id }, { prisma }) => {
    const artistId = parseInt(id, 10);
    if (isNaN(artistId)) {
      throw new Error(`Invalid artist ID: ${id}`);
    }

    const artist = await prisma.artists.findUnique({
      where: { ArtistId: artistId },
    });

    if (!artist) {
      throw new Error(`Artist with ID ${id} not found`);
    }

    return artistMapper(artist);
  },

  artists: async (_, { name }, { prisma }) => {
    if (!name) {
      const artists = await prisma.artists.findMany();
      return artists.map(artistMapper);
    }

    const allArtists = await prisma.artists.findMany();
    const matchingArtists = allArtists.filter(
      (artist) =>
        artist.Name &&
        isSimilarityMatch(artist.Name, name, config.similarityThreshold),
    );

    return matchingArtists.map(artistMapper);
  },
};

export const artistFieldResolvers: ArtistResolvers<
  Context,
  ReturnType<typeof artistMapper>
> = {
  albums: async (parent, _, { prisma }) => {
    try {
      const albums = await prisma.albums.findMany({
        where: { ArtistId: parent.ArtistId },
      });

      return albums.map(albumMapper);
    } catch (error) {
      logger.error(
        `Error fetching albums for artist ${parent.ArtistId}:`,
        error,
      );
      throw new Error(`Failed to fetch albums: ${error.message}`);
    }
  },
};
