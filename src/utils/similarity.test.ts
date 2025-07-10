import { calculateSimilarity, isSimilarityMatch } from "./similarity.js";

describe("Similarity functions", () => {
  describe("calculateSimilarity", () => {
    it("should return 1 for identical strings", () => {
      expect(calculateSimilarity("hello", "hello")).toBe(1);
    });

    it("should return 1 for identical strings with different cases", () => {
      expect(calculateSimilarity("Hello", "hello")).toBe(1);
    });

    it("should return 0 for completely different strings", () => {
      expect(calculateSimilarity("hello", "world")).toBeLessThan(0.5);
    });

    it("should return high similarity for similar strings", () => {
      expect(calculateSimilarity("Beatles", "Beatle")).toBeGreaterThan(0.8);
    });

    it("should handle empty strings", () => {
      expect(calculateSimilarity("", "")).toBe(1);
      expect(calculateSimilarity("hello", "")).toBe(0);
      expect(calculateSimilarity("", "hello")).toBe(0);
    });

    it("should handle whitespace properly", () => {
      expect(calculateSimilarity("  hello  ", "hello")).toBe(1);
    });
  });

  describe("isSimilarityMatch", () => {
    it("should return true for >90% similarity", () => {
      expect(isSimilarityMatch("Beatles", "Beatles", 0.9)).toBe(true);
      expect(isSimilarityMatch("Beatles", "Beatle", 0.9)).toBe(false);
    });

    it("should return false for <90% similarity", () => {
      expect(isSimilarityMatch("Beatles", "Rolling Stones", 0.9)).toBe(false);
    });
  });
});
