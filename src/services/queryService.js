import { generateAnswer } from "../utils/localLLM.js";
import { getEmbedding } from "../utils/embedder.js";
import { search } from "../utils/vectorStore.js";

export async function query(query, filters = {}) {
  try {
    // Get query embedding
    const queryEmbedding = await getEmbedding(query);

    // Search for relevant chunks
    const chunks = await search(queryEmbedding, filters);

    // Generate answer
    let answer = "";
    for await (const chunk of generateAnswer(chunks, query)) {
      answer += chunk;
    }

    return {
      answer,
      sources: chunks.map((chunk) => ({
        text: chunk.text,
        metadata: chunk.metadata,
      })),
    };
  } catch (error) {
    throw new Error(`Query failed: ${error.message}`);
  }
}

export async function* streamQuery(query, filters = {}) {
  try {
    // Get query embedding
    const queryEmbedding = await getEmbedding(query);

    // Search for relevant chunks
    const chunks = await search(queryEmbedding, filters);

    // Stream the answer generation
    for await (const chunk of generateAnswer(chunks, query)) {
      yield {
        type: "answer",
        content: chunk,
      };
    }

    // Send sources at the end
    const sources = chunks.map((chunk) => ({
      text: chunk.text,
      metadata: {
        filename: chunk.metadata.filename || "Unknown",
        pageCount: chunk.metadata.pageCount,
        chunkIndex: chunk.metadata.chunkIndex,
      },
    }));

    yield {
      type: "sources",
      content: sources,
    };
  } catch (error) {
    yield {
      type: "error",
      content: error.message,
    };
  }
}
