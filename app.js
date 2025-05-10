import { loadDocuments } from "./loadDocuments.js";
import {
  addVector,
  loadVectors,
  saveVectors,
  search,
} from "./store/vectorStore.js";
import { getEmbedding } from "./embeddings/embedder.js";
import { generateAnswer } from "./llm/localLLM.js";

async function indexDocuments() {
  const chunks = await loadDocuments();

  for (const chunk of chunks) {
    if (chunk.text.trim().length === 0) continue;
    const embedding = await getEmbedding(chunk.text);
    addVector(embedding, chunk.text, chunk.metadata);
  }

  saveVectors();
  console.log("✅ Indexing completed.");
}

async function queryDocuments(userQuery) {
  loadVectors();
  const queryEmbedding = await getEmbedding(userQuery);
  const topChunks = search(queryEmbedding).map((result) => result.text);

  await generateAnswer(topChunks, userQuery);
}

async function main() {
  try {
    const mode = process.argv[2];
    const input = process.argv.slice(3).join(" ");

    if (mode === "index") {
      await indexDocuments();
    } else if (mode === "query") {
      if (!input) {
        console.error("❌ Error: Please provide a query text.");
        process.exit(1);
      }
      await queryDocuments(input);
    } else {
      console.log(`
                    Usage:
                    npm run index            # To index documents
                    QUERY="your question" npm run query  # To query documents

                    Examples:
                    npm run index
                    QUERY="How do I reset my password?" npm run query
                `);
    }
  } catch (err) {
    console.error("❌ Unexpected error:", err.message);
    process.exit(1);
  }
}

main();
