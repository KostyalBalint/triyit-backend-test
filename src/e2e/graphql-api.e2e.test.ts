import request from "supertest";
import { createApp, closeApp, AppInstance } from "../app.js";

describe("GraphQL API E2E Tests", () => {
  let appInstance: AppInstance;
  let app: any;

  beforeAll(async () => {
    appInstance = await createApp();
    app = appInstance.app;
  });

  afterAll(async () => {
    await closeApp(appInstance);
  });

  describe("Artist Queries", () => {
    it("should fetch all artists", async () => {
      const query = `
        query {
          artists {
            id
            name
          }
        }
      `;

      const response = await request(app)
        .post("/gql")
        .send({ query })
        .expect(200);

      expect(response.body.data.artists).toBeDefined();
      expect(Array.isArray(response.body.data.artists)).toBe(true);
      expect(response.body.data.artists.length).toBeGreaterThan(0);

      const firstArtist = response.body.data.artists[0];
      expect(firstArtist).toHaveProperty("id");
      expect(firstArtist).toHaveProperty("name");
      expect(typeof firstArtist.id).toBe("string");
      expect(typeof firstArtist.name).toBe("string");
    });

    it("should fetch artist by ID", async () => {
      const query = `
        query {
          artist(id: "1") {
            id
            name
          }
        }
      `;

      const response = await request(app)
        .post("/gql")
        .send({ query })
        .expect(200);

      expect(response.body.data.artist).toBeDefined();
      expect(response.body.data.artist.id).toBe("1");
      expect(response.body.data.artist.name).toBe("AC/DC");
    });

    it("should return error for non-existent artist", async () => {
      const query = `
        query {
          artist(id: "99999") {
            id
            name
          }
        }
      `;

      const response = await request(app)
        .post("/gql")
        .send({ query })
        .expect(200);

      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].message).toContain(
        "Artist with ID 99999 not found",
      );
    });

    it("should search artists by name with similarity matching", async () => {
      const query = `
        query {
          artists(name: "AC/DC") {
            id
            name
          }
        }
      `;

      const response = await request(app)
        .post("/gql")
        .send({ query })
        .expect(200);

      expect(response.body.data.artists).toBeDefined();
      expect(response.body.data.artists.length).toBeGreaterThan(0);

      const acdc = response.body.data.artists.find(
        (artist: any) => artist.name === "AC/DC",
      );
      expect(acdc).toBeDefined();
      expect(acdc.id).toBe("1");
    });

    it("should fetch artist with albums", async () => {
      const query = `
        query {
          artist(id: "1") {
            id
            name
            albums {
              id
              title
            }
          }
        }
      `;

      const response = await request(app)
        .post("/gql")
        .send({ query })
        .expect(200);

      expect(response.body.data.artist).toBeDefined();
      expect(response.body.data.artist.albums).toBeDefined();
      expect(Array.isArray(response.body.data.artist.albums)).toBe(true);
      expect(response.body.data.artist.albums.length).toBeGreaterThan(0);

      const firstAlbum = response.body.data.artist.albums[0];
      expect(firstAlbum).toHaveProperty("id");
      expect(firstAlbum).toHaveProperty("title");
    });
  });

  describe("Album Queries", () => {
    it("should fetch all albums", async () => {
      const query = `
        query {
          albums {
            id
            title
          }
        }
      `;

      const response = await request(app)
        .post("/gql")
        .send({ query })
        .expect(200);

      expect(response.body.data.albums).toBeDefined();
      expect(Array.isArray(response.body.data.albums)).toBe(true);
      expect(response.body.data.albums.length).toBeGreaterThan(0);

      const firstAlbum = response.body.data.albums[0];
      expect(firstAlbum).toHaveProperty("id");
      expect(firstAlbum).toHaveProperty("title");
    });

    it("should fetch album by ID", async () => {
      const query = `
        query {
          album(id: "1") {
            id
            title
          }
        }
      `;

      const response = await request(app)
        .post("/gql")
        .send({ query })
        .expect(200);

      expect(response.body.data.album).toBeDefined();
      expect(response.body.data.album.id).toBe("1");
      expect(response.body.data.album.title).toBe(
        "For Those About To Rock We Salute You",
      );
    });

    it("should return error for non-existent album", async () => {
      const query = `
        query {
          album(id: "99999") {
            id
            title
          }
        }
      `;

      const response = await request(app)
        .post("/gql")
        .send({ query })
        .expect(200);

      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].message).toContain(
        "Album with ID 99999 not found",
      );
    });

    it("should search albums by title with similarity matching", async () => {
      const query = `
        query {
          albums(title: "For Those About To Rock We Salute You") {
            id
            title
          }
        }
      `;

      const response = await request(app)
        .post("/gql")
        .send({ query })
        .expect(200);

      expect(response.body.data.albums).toBeDefined();
      expect(response.body.data.albums.length).toBeGreaterThan(0);

      const album = response.body.data.albums.find(
        (album: any) => album.title === "For Those About To Rock We Salute You",
      );
      expect(album).toBeDefined();
      expect(album.id).toBe("1");
    });

    it("should fetch album with artist and tracks", async () => {
      const query = `
        query {
          album(id: "1") {
            id
            title
            artist {
              id
              name
            }
            tracks {
              id
              name
              milliseconds
              bytes
              price
            }
          }
        }
      `;

      const response = await request(app)
        .post("/gql")
        .send({ query })
        .expect(200);

      expect(response.body.data.album).toBeDefined();
      expect(response.body.data.album.artist).toBeDefined();
      expect(response.body.data.album.artist.name).toBe("AC/DC");
      expect(response.body.data.album.tracks).toBeDefined();
      expect(Array.isArray(response.body.data.album.tracks)).toBe(true);
      expect(response.body.data.album.tracks.length).toBeGreaterThan(0);

      const firstTrack = response.body.data.album.tracks[0];
      expect(firstTrack).toHaveProperty("id");
      expect(firstTrack).toHaveProperty("name");
      expect(firstTrack).toHaveProperty("milliseconds");
      expect(firstTrack).toHaveProperty("bytes");
      expect(firstTrack).toHaveProperty("price");
    });
  });

  describe("Track Queries", () => {
    it("should fetch track by ID", async () => {
      const query = `
        query {
          track(id: "1") {
            id
            name
            composer
            milliseconds
            bytes
            price
          }
        }
      `;

      const response = await request(app)
        .post("/gql")
        .send({ query })
        .expect(200);

      expect(response.body.data.track).toBeDefined();
      expect(response.body.data.track.id).toBe("1");
      expect(response.body.data.track.name).toBe(
        "For Those About To Rock (We Salute You)",
      );
      expect(response.body.data.track.composer).toBe(
        "Angus Young, Malcolm Young, Brian Johnson",
      );
    });

    it("should return error for non-existent track", async () => {
      const query = `
        query {
          track(id: "99999") {
            id
            name
          }
        }
      `;

      const response = await request(app)
        .post("/gql")
        .send({ query })
        .expect(200);

      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].message).toContain(
        "Track with ID 99999 not found",
      );
    });

    it("should fetch track with album", async () => {
      const query = `
        query {
          track(id: "1") {
            id
            name
            album {
              id
              title
              artist {
                id
                name
              }
            }
          }
        }
      `;

      const response = await request(app)
        .post("/gql")
        .send({ query })
        .expect(200);

      expect(response.body.data.track).toBeDefined();
      expect(response.body.data.track.album).toBeDefined();
      expect(response.body.data.track.album.title).toBe(
        "For Those About To Rock We Salute You",
      );
      expect(response.body.data.track.album.artist).toBeDefined();
      expect(response.body.data.track.album.artist.name).toBe("AC/DC");
    });
  });

  describe("Complex Nested Queries", () => {
    it("should fetch artist with albums and tracks", async () => {
      const query = `
        query {
          artist(id: "1") {
            id
            name
            albums {
              id
              title
              tracks {
                id
                name
                milliseconds
                price
              }
            }
          }
        }
      `;

      const response = await request(app)
        .post("/gql")
        .send({ query })
        .expect(200);

      expect(response.body.data.artist).toBeDefined();
      expect(response.body.data.artist.albums).toBeDefined();
      expect(response.body.data.artist.albums.length).toBeGreaterThan(0);

      // Check that albums have tracks
      const firstAlbum = response.body.data.artist.albums[0];
      expect(firstAlbum.tracks).toBeDefined();
      expect(Array.isArray(firstAlbum.tracks)).toBe(true);
      expect(firstAlbum.tracks.length).toBeGreaterThan(0);
    });

    it("should handle large result sets efficiently", async () => {
      const query = `
        query {
          artists {
            id
            name
            albums {
              id
              title
            }
          }
        }
      `;

      const response = await request(app)
        .post("/gql")
        .send({ query })
        .expect(200);

      expect(response.body.data.artists).toBeDefined();
      expect(response.body.data.artists.length).toBeGreaterThan(100); // Should have many artists
    });
  });

  describe("Similarity Search Edge Cases", () => {
    it("should handle empty search string, should return all artists", async () => {
      const query = `
        query {
          artists(name: "") {
            id
            name
          }
        }
      `;

      const response = await request(app)
        .post("/gql")
        .send({ query })
        .expect(200);

      expect(response.body.data.artists).toBeDefined();
      expect(response.body.data.artists.length).toBeGreaterThan(0);
    });

    it("should handle null search string", async () => {
      const query = `
        query {
          artists(name: null) {
            id
            name
          }
        }
      `;

      const response = await request(app)
        .post("/gql")
        .send({ query })
        .expect(200);

      expect(response.body.data.artists).toBeDefined();
      expect(response.body.data.artists.length).toBeGreaterThan(0);
    });

    it("should handle search with no matches", async () => {
      const query = `
        query {
          artists(name: "NonExistentArtistXYZ123") {
            id
            name
          }
        }
      `;

      const response = await request(app)
        .post("/gql")
        .send({ query })
        .expect(200);

      expect(response.body.data.artists).toBeDefined();
      expect(response.body.data.artists.length).toBe(0);
    });

    it("should handle case-insensitive search", async () => {
      const query = `
        query {
          artists(name: "ac/dc") {
            id
            name
          }
        }
      `;

      const response = await request(app)
        .post("/gql")
        .send({ query })
        .expect(200);

      expect(response.body.data.artists).toBeDefined();
      expect(response.body.data.artists.length).toBeGreaterThan(0);

      // Should find AC/DC despite case difference
      const acdc = response.body.data.artists.find(
        (artist: any) => artist.name === "AC/DC",
      );
      expect(acdc).toBeDefined();
    });
  });

  describe("GraphQL Schema Validation", () => {
    it("should reject invalid query syntax", async () => {
      const query = `
        query {
          artist(id: "1") {
            id
            name
            invalidField
          }
        }
      `;

      const response = await request(app)
        .post("/gql")
        .send({ query })
        .expect(400);

      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].message).toContain("Cannot query field");
    });

    it("should reject missing required arguments", async () => {
      const query = `
        query {
          artist {
            id
            name
          }
        }
      `;

      const response = await request(app)
        .post("/gql")
        .send({ query })
        .expect(400);

      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].message).toContain(
        'Field "artist" argument "id" of type "ID!" is required',
      );
    });

    it("should handle malformed JSON", async () => {
      const response = await request(app)
        .post("/gql")
        .set("Content-Type", "application/json")
        .send("invalid json")
        .expect(400);

      // Different servers may handle malformed JSON differently
      expect(response.status).toBe(400);
    });
  });
});
