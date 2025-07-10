import { artists as PrismaArtist } from "@prisma/client";
import { Artist as GqlArtist } from "../generated/graphql.js";

// Maps a Prisma artist object to a GraphQL artist object
export const artistMapper = (
  artist: PrismaArtist,
): GqlArtist & PrismaArtist => {
  return {
    ...artist,
    id: String(artist.ArtistId),
    name: artist.Name,
    albums: null,
  };
};
