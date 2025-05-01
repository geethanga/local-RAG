import fs from "fs";

let vectors = []; // { embedding: [...], text: '...' }

export function addVector(embedding, text) {
  vectors.push({ embedding, text });
}

export function saveVectors(filePath = "./data/vectors.json") {
  fs.writeFileSync(filePath, JSON.stringify(vectors, null, 2));
}

export function loadVectors(filePath = "./data/vectors.json") {
  vectors = JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

export function search(queryEmbedding, topK = 3) {
  const similarities = vectors.map((v) => ({
    text: v.text,
    score: cosineSimilarity(v.embedding, queryEmbedding),
  }));
  return similarities.sort((a, b) => b.score - a.score).slice(0, topK);
}

function cosineSimilarity(vecA, vecB) {
  const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const normA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const normB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dot / (normA * normB);
}
