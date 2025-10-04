import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs";
import path from "path";
import {
  addVector,
  loadVectors,
  saveVectors,
  search,
  normalizeVector,
  resetVectors,
} from "../src/utils/vectorStore";

const TEST_VECTORS_PATH = "../src/data/test_vectors.json";

describe("VectorStore", () => {
  beforeEach(() => {
    resetVectors();
    
    // Ensure the directory exists
    const dir = path.dirname(TEST_VECTORS_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(TEST_VECTORS_PATH, JSON.stringify([]));
  });

  afterEach(() => {
    // Clean up test file
    if (fs.existsSync(TEST_VECTORS_PATH)) {
      fs.unlinkSync(TEST_VECTORS_PATH);
    }
  });

  describe("Vector Operations", () => {
    it("should normalize vectors correctly", () => {
      const vector = [1, 2, 3];
      const normalized = normalizeVector(vector);

      // Check magnitude is 1
      const magnitude = Math.sqrt(
        normalized.reduce((sum, val) => sum + val * val, 0)
      );
      expect(Math.abs(magnitude - 1)).toBeLessThan(1e-6);

      // Check direction is preserved
      const ratio = normalized[0] / vector[0];
      expect(normalized[1] / vector[1]).toBeCloseTo(ratio);
      expect(normalized[2] / vector[2]).toBeCloseTo(ratio);
    });

    it("should handle zero vector", () => {
      const vector = [0, 0, 0];
      const normalized = normalizeVector(vector);
      expect(normalized).toEqual([0, 0, 0]);
    });
  });

  describe("Storage Operations", () => {
    it("should add and retrieve vectors", () => {
      const vector = [1, 2, 3];
      const text = "test text";

      addVector(vector, text);
      saveVectors(TEST_VECTORS_PATH);
      loadVectors(TEST_VECTORS_PATH);

      const results = search(vector);
      expect(results[0].text).toBe(text);
    });

    it("should save and load vectors correctly", () => {
      const vectors = [
        { vector: [1, 2, 3], text: "text1" },
        { vector: [4, 5, 6], text: "text2" },
      ];

      vectors.forEach(({ vector, text }) => addVector(vector, text));
      saveVectors(TEST_VECTORS_PATH);

      resetVectors();
      loadVectors(TEST_VECTORS_PATH);

      const results = search([1, 2, 3]);
      expect(results[0].text).toBe("text1");
    });
  });

  describe("Search Operations", () => {
    beforeEach(() => {
      // Add test vectors with more distinct directions
      addVector([1, 0, 0], "vector 1");
      addVector([0.1, 0.9, 0], "vector 2");
      addVector([0, 0, 1], "vector 3");
    });

    it("should return top K results", () => {
      const query = [1, 0, 0];
      const results = search(query, 2);

      expect(results.length).toBe(2);
      expect(results[0].text).toBe("vector 1");
    });

    it("should order results by similarity", () => {
      const query = [0.1, 0.9, 0];
      const results = search(query);

      expect(results[0].text).toBe("vector 2");
      expect(results[1].text).toBe("vector 1");
      expect(results[2].text).toBe("vector 3");
    });

    it("should handle empty vector store", () => {
      // Clear vectors
      fs.writeFileSync(TEST_VECTORS_PATH, JSON.stringify([]));
      loadVectors(TEST_VECTORS_PATH);

      const results = search([1, 0, 0]);
      expect(results).toEqual([]);
    });

    it("should handle different vector dimensions", () => {
      resetVectors();
      addVector([1, 0], "2d vector");
      const results = search([1, 0]);
      expect(results[0].text).toBe("2d vector");
    });
  });

  describe("Edge Cases", () => {
    it("should handle NaN values", () => {
      const vector = [1, NaN, 3];
      expect(() => normalizeVector(vector)).toThrow();
    });

    it("should handle infinite values", () => {
      const vector = [1, Infinity, 3];
      expect(() => normalizeVector(vector)).toThrow();
    });

    it("should handle different vector lengths in search", () => {
      addVector([1, 2, 3], "3d vector");
      expect(() => search([1, 2])).toThrow();
    });
  });
});
