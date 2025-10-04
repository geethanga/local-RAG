import { describe, it, expect, beforeAll } from "vitest";
import { loadEmbedder, getEmbedding } from "../src/utils/embedder";

describe("Embedder", () => {
  beforeAll(async () => {
    await loadEmbedder();
  });

  it("should generate embeddings for text", async () => {
    const text = "Hello world";
    const embedding = await getEmbedding(text);

    expect(embedding).toBeDefined();
    expect(Array.isArray(embedding)).toBe(true);
    expect(embedding.length).toBeGreaterThan(0);
    expect(typeof embedding[0]).toBe("number");
  });

  it("should handle empty string", async () => {
    const embedding = await getEmbedding("");
    expect(embedding).toBeDefined();
    expect(Array.isArray(embedding)).toBe(true);
  });

  it("should handle long text", async () => {
    const longText = "a ".repeat(1000);
    const embedding = await getEmbedding(longText);
    expect(embedding).toBeDefined();
    expect(Array.isArray(embedding)).toBe(true);
  });

  it("should generate consistent embeddings for same text", async () => {
    const text = "Consistent test";
    const embedding1 = await getEmbedding(text);
    const embedding2 = await getEmbedding(text);

    expect(embedding1).toEqual(embedding2);
  });

  it("should generate different embeddings for different texts", async () => {
    const embedding1 = await getEmbedding("Hello");
    const embedding2 = await getEmbedding("World");

    expect(embedding1).not.toEqual(embedding2);
  });

  it("should normalize embeddings", async () => {
    const embedding = await getEmbedding("Test normalization");
    const magnitude = Math.sqrt(
      embedding.reduce((sum, val) => sum + val * val, 0)
    );

    // Check if magnitude is close to 1 (allowing for floating point imprecision)
    expect(Math.abs(magnitude - 1)).toBeLessThan(1e-6);
  });

  it("should handle special characters", async () => {
    const text = 'Hello! @#$%^&*()_+{}|:"<>?';
    const embedding = await getEmbedding(text);
    expect(embedding).toBeDefined();
    expect(Array.isArray(embedding)).toBe(true);
  });

  it("should handle multiple spaces", async () => {
    const text = "Hello    world";
    const embedding = await getEmbedding(text);
    expect(embedding).toBeDefined();
    expect(Array.isArray(embedding)).toBe(true);
  });
});
