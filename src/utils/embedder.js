import { pipeline } from "@xenova/transformers";

let embedder;

export async function loadEmbedder() {
  embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
}

export async function getEmbedding(text) {
  if (!embedder) await loadEmbedder();
  const result = await embedder(text, { pooling: "mean", normalize: true });

  // FIX: Turn object {0:val, 1:val, ...} into array [val, val, ...]
  const embeddingArray = Array.isArray(result.data)
    ? result.data
    : Object.values(result.data);

  return embeddingArray;
}
