import fs from "fs";

let vectors = []; // { embedding: [...], text: '...' }

function normalizeVector(vec) {
  const norm = Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0));
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
