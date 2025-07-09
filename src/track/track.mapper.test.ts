import { trackMapper } from "./track.mapper";
import { Decimal } from "@prisma/client/runtime/library";

describe("Track Mapper", () => {
  it("should map Prisma track to GraphQL track", () => {
    const prismaTrack = {
      TrackId: 1,
      Name: "Come Together",
      AlbumId: 1,
      MediaTypeId: 1,
      GenreId: 1,
      Composer: "Lennon-McCartney",
      Milliseconds: 259226,
      Bytes: 8374308,
      UnitPrice: new Decimal(0.99),
    };

    const result = trackMapper(prismaTrack);

    expect(result).toEqual({
      TrackId: 1,
      Name: "Come Together",
      AlbumId: 1,
      MediaTypeId: 1,
      GenreId: 1,
      Composer: "Lennon-McCartney",
      Milliseconds: 259226,
      Bytes: 8374308,
      UnitPrice: new Decimal(0.99),
      id: "1",
      name: "Come Together",
      album: null,
      bytes: 8374308,
      milliseconds: 259226,
      composer: "Lennon-McCartney",
      price: 0.99,
    });
  });

  it("should handle null composer", () => {
    const prismaTrack = {
      TrackId: 2,
      Name: "Something",
      AlbumId: 1,
      MediaTypeId: 1,
      GenreId: 1,
      Composer: null,
      Milliseconds: 183000,
      Bytes: 5900000,
      UnitPrice: new Decimal(0.99),
    };

    const result = trackMapper(prismaTrack);

    expect(result.composer).toBeNull();
    expect(result.Composer).toBeNull();
  });

  it("should convert numeric id to string", () => {
    const prismaTrack = {
      TrackId: 999,
      Name: "Test Track",
      AlbumId: 1,
      MediaTypeId: 1,
      GenreId: 1,
      Composer: "Test Composer",
      Milliseconds: 180000,
      Bytes: 6000000,
      UnitPrice: new Decimal(1.29),
    };

    const result = trackMapper(prismaTrack);

    expect(result.id).toBe("999");
    expect(typeof result.id).toBe("string");
  });

  it("should preserve all original properties", () => {
    const prismaTrack = {
      TrackId: 1,
      Name: "Come Together",
      AlbumId: 1,
      MediaTypeId: 1,
      GenreId: 1,
      Composer: "Lennon-McCartney",
      Milliseconds: 259226,
      Bytes: 8374308,
      UnitPrice: new Decimal(0.99),
    };

    const result = trackMapper(prismaTrack);

    expect(result.TrackId).toBe(prismaTrack.TrackId);
    expect(result.Name).toBe(prismaTrack.Name);
    expect(result.AlbumId).toBe(prismaTrack.AlbumId);
    expect(result.Composer).toBe(prismaTrack.Composer);
    expect(result.Milliseconds).toBe(prismaTrack.Milliseconds);
    expect(result.Bytes).toBe(prismaTrack.Bytes);
    expect(result.UnitPrice).toBe(prismaTrack.UnitPrice);
  });

  it("should set album to null for resolver handling", () => {
    const prismaTrack = {
      TrackId: 1,
      Name: "Come Together",
      AlbumId: 1,
      MediaTypeId: 1,
      GenreId: 1,
      Composer: "Lennon-McCartney",
      Milliseconds: 259226,
      Bytes: 8374308,
      UnitPrice: new Decimal(0.99),
    };

    const result = trackMapper(prismaTrack);

    expect(result.album).toBeNull();
  });

  it("should map price from UnitPrice", () => {
    const prismaTrack = {
      TrackId: 1,
      Name: "Come Together",
      AlbumId: 1,
      MediaTypeId: 1,
      GenreId: 1,
      Composer: "Lennon-McCartney",
      Milliseconds: 259226,
      Bytes: 8374308,
      UnitPrice: new Decimal(1.29),
    };

    const result = trackMapper(prismaTrack);

    expect(result.price).toBe(1.29);
    expect(result.UnitPrice.toNumber()).toBe(1.29);
  });
});