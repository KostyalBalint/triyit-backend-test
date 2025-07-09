import { artists as PrismaArtist } from "@prisma/client";
import { Artist as GqlArtist } from "../generated/graphql";

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
