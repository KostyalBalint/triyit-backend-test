import { ArtistResolvers, QueryResolvers } from "../generated/graphql";
import { artistMapper } from "./artist.mapper";
import { albumMapper } from "../album/album.mapper";
import { Context } from "../types";

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
    const artists = await prisma.artists.findMany({
      where: {
        //TODO: Implement a more flexible search
        Name: {
          contains: name || "",
        },
      },
    });

    return artists.map(artistMapper);
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
