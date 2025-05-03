import fs from "fs";

export let vectors = []; // { embedding: [...], text: '...' }

export function resetVectors() {
  vectors = [];
}

export function normalizeVector(vec) {
  // Check for invalid values
  if (vec.some((val) => !Number.isFinite(val))) {
    throw new Error("Vector contains NaN or infinite values");
  }

  const norm = Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0));
  if (norm === 0) return vec;
  return vec.map((val) => val / norm);
}

export function addVector(embedding, text) {
  vectors.push({ embedding: normalizeVector(embedding), text });
}

export function saveVectors(filePath = "./data/vectors.json") {
  fs.writeFileSync(filePath, JSON.stringify(vectors, null, 2));
}

export function loadVectors(filePath = "./data/vectors.json") {
  vectors = JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

export function search(queryEmbedding, topK = 3) {
  if (vectors.length === 0) return [];

  // Check vector dimensions
  const expectedDim = vectors[0].embedding.length;
  if (queryEmbedding.length !== expectedDim) {
    throw new Error(
      `Query vector dimension (${queryEmbedding.length}) does not match stored vectors (${expectedDim})`
    );
  }

  const normalizedQuery = normalizeVector(queryEmbedding);
  const similarities = vectors.map((v) => ({
    text: v.text,
    score: cosineSimilarity(v.embedding, normalizedQuery),
  }));
  return similarities.sort((a, b) => b.score - a.score).slice(0, topK);
}

function cosineSimilarity(vecA, vecB) {
  const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const normA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const normB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dot / (normA * normB);
}
