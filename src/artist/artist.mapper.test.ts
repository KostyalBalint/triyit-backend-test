import { artistMapper } from "./artist.mapper.js";

describe("Artist Mapper", () => {
  it("should map Prisma artist to GraphQL artist", () => {
    const prismaArtist = {
      ArtistId: 1,
      Name: "Beatles",
    };

    const result = artistMapper(prismaArtist);

    expect(result).toEqual({
      ArtistId: 1,
      Name: "Beatles",
      id: "1",
      name: "Beatles",
      albums: null,
    });
  });

  it("should handle null name", () => {
    const prismaArtist = {
      ArtistId: 2,
      Name: null,
    };

    const result = artistMapper(prismaArtist);

    expect(result).toEqual({
      ArtistId: 2,
      Name: null,
      id: "2",
      name: null,
      albums: null,
    });
  });

  it("should convert numeric id to string", () => {
    const prismaArtist = {
      ArtistId: 999,
      Name: "Test Artist",
    };

    const result = artistMapper(prismaArtist);

    expect(result.id).toBe("999");
    expect(typeof result.id).toBe("string");
  });

  it("should preserve all original properties", () => {
    const prismaArtist = {
      ArtistId: 1,
      Name: "Beatles",
    };

    const result = artistMapper(prismaArtist);

    expect(result.ArtistId).toBe(prismaArtist.ArtistId);
    expect(result.Name).toBe(prismaArtist.Name);
  });
});
