import { describe, it, expect } from "vitest";
import { splitTextIntoChunks } from "../loadDocuments.js";

describe("splitTextIntoChunks", () => {
  it("should handle empty text", () => {
    const result = splitTextIntoChunks("");
    expect(result).toEqual([]);
  });

  it("should split text into chunks of appropriate size", () => {
    const text =
      "First sentence. Second sentence. Third sentence. Fourth sentence.";
    const result = splitTextIntoChunks(text, 30);
    expect(result.length).toBeGreaterThan(1);
    result.forEach((chunk) => {
      expect(chunk.length).toBeLessThanOrEqual(30);
    });
  });

  it("should respect sentence boundaries", () => {
    const text = "First sentence. Second sentence. Third sentence.";
    const result = splitTextIntoChunks(text, 30);
    expect(result[0]).toContain("First sentence.");
    expect(result[1]).toContain("Second sentence.");
  });

  it("should handle text with multiple spaces and newlines", () => {
    const text = "First sentence. \n\n Second sentence.";
    const result = splitTextIntoChunks(text, 30);

    expect(result[0]).toBe("First sentence.");
    expect(result[1]).toBe("Second sentence.");
  });

  it("should create overlapping chunks", () => {
    const text = "First sentence. Second sentence. Third sentence.";
    const result = splitTextIntoChunks(text, 30, 10);
    // Should have more chunks than sentences due to overlap
    expect(result.length).toBeGreaterThan(3);
  });

  it("should handle very long sentences", () => {
    const longSentence =
      "This is a very long sentence that should be split into multiple chunks because it exceeds the maximum size limit that we have set for our chunks.";
    const result = splitTextIntoChunks(longSentence, 50);
    expect(result.length).toBeGreaterThan(1);
    result.forEach((chunk) => {
      expect(chunk.length).toBeLessThanOrEqual(50);
    });
  });

  it("should maintain text integrity", () => {
    const text = "First sentence. Second sentence. Third sentence.";
    const result = splitTextIntoChunks(text);
    const reconstructed = result.join(" ");
    expect(reconstructed).toContain("First sentence");
    expect(reconstructed).toContain("Second sentence");
    expect(reconstructed).toContain("Third sentence");
  });

  it("should handle custom chunk sizes", () => {
    const text = "First sentence. Second sentence. Third sentence.";
    const minSize = 5;
    const maxSize = 15;
    const result = splitTextIntoChunks(text, minSize, maxSize);
    result.forEach((chunk) => {
      expect(chunk.length).toBeLessThanOrEqual(maxSize);
    });
  });

  it("should handle text with no sentence endings", () => {
    const text =
      "This is a text without proper sentence endings it just goes on and on";
    const result = splitTextIntoChunks(text, 30);
    expect(result.length).toBeGreaterThan(1);
    result.forEach((chunk) => {
      expect(chunk.length).toBeLessThanOrEqual(30);
    });
  });
});
