import { tracks as PrismaTrack } from "@prisma/client";
import { Track as GQLTrack } from "../generated/graphql.js";

// Maps a Prisma track object to a GraphQL track object
export const trackMapper = (track: PrismaTrack): GQLTrack & PrismaTrack => {
  return {
    ...track,
    id: String(track.TrackId),
    name: track.Name,
    album: null,
    bytes: track.Bytes,
    milliseconds: track.Milliseconds,
    price: track.UnitPrice.toNumber(),
    composer: track.Composer || null,
  };
};
