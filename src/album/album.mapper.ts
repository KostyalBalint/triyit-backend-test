import type { albums as PrismaAlbum } from "@prisma/client";
import { Album as GqlAlbum } from "../generated/graphql";

// Maps a Prisma album object to a GraphQL album object
export const albumMapper = (album: PrismaAlbum): GqlAlbum & PrismaAlbum => {
  return {
    ...album,
    id: String(album.AlbumId),
    title: album.Title,
    artist: null, // This will be resolved in the resolver
    tracks: null, // This will be resolved in the resolver
  };
};
