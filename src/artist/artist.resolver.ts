import { ArtistResolvers, QueryResolvers } from "../generated/graphql";
import { artistMapper } from "./artist.mapper";
import { albumMapper } from "../album/album.mapper";
import { Context } from "../types";
import { isSimilarityMatch } from "../utils/similarity";
import { config } from "../config";

export const artistQueries: QueryResolvers = {
  artist: async (_, { id }, { prisma }) => {
    const artist = await prisma.artists.findUnique({
      where: { ArtistId: Number(id) },
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
    const albums = await prisma.albums.findMany({
      where: { ArtistId: parent.ArtistId },
    });

    return albums.map(albumMapper);
  },
};
