import { albumMapper } from "./album.mapper.js";

describe("Album Mapper", () => {
  it("should map Prisma album to GraphQL album", () => {
    const prismaAlbum = {
      AlbumId: 1,
      Title: "Abbey Road",
      ArtistId: 1,
    };

    const result = albumMapper(prismaAlbum);

    expect(result).toEqual({
      AlbumId: 1,
      Title: "Abbey Road",
      ArtistId: 1,
      id: "1",
      title: "Abbey Road",
      artist: null,
      tracks: null,
    });
  });

  it("should handle empty title", () => {
    const prismaAlbum = {
      AlbumId: 2,
      Title: "",
      ArtistId: 1,
    };

    const result = albumMapper(prismaAlbum);

    expect(result).toEqual({
      AlbumId: 2,
      Title: "",
      ArtistId: 1,
      id: "2",
      title: "",
      artist: null,
      tracks: null,
    });
  });

  it("should convert numeric id to string", () => {
    const prismaAlbum = {
      AlbumId: 999,
      Title: "Test Album",
      ArtistId: 1,
    };

    const result = albumMapper(prismaAlbum);

    expect(result.id).toBe("999");
    expect(typeof result.id).toBe("string");
  });

  it("should preserve all original properties", () => {
    const prismaAlbum = {
      AlbumId: 1,
      Title: "Abbey Road",
      ArtistId: 1,
    };

    const result = albumMapper(prismaAlbum);

    expect(result.AlbumId).toBe(prismaAlbum.AlbumId);
    expect(result.Title).toBe(prismaAlbum.Title);
    expect(result.ArtistId).toBe(prismaAlbum.ArtistId);
  });

  it("should set artist and tracks to null for resolver handling", () => {
    const prismaAlbum = {
      AlbumId: 1,
      Title: "Abbey Road",
      ArtistId: 1,
    };

    const result = albumMapper(prismaAlbum);

    expect(result.artist).toBeNull();
    expect(result.tracks).toBeNull();
  });
});
