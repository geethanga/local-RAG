import fetch from "node-fetch";

export async function* generateAnswer(
  contextChunks,
  question,
  model = "mistral"
) {
  const startTime = performance.now();

  // Format context with citations
  const formattedContext = contextChunks
    .map((chunk, index) => {
      const source = chunk.metadata.filename || "Unknown source";
      const page = chunk.metadata.pageCount
        ? ` (Page ${chunk.metadata.chunkIndex + 1})`
        : "";
      return `[${index + 1}] ${chunk.text}\nSource: ${source}${page}`;
    })
    .join("\n\n");

  const prompt = `
    Use the following context to answer the question. When using information from the context, cite the source using the format [1], [2], etc.
    
    Context:
    ${formattedContext}
    
    Question:
    ${question}
    
    Instructions:
    1. Answer the question using the provided context
    2. Cite your sources using the format [1], [2], etc.
    3. If you're not sure about something, say so
    4. Keep your answer concise and to the point
    `;

  console.log("\nProcessing the query ⏳");

  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      prompt,
      stream: true,
      max_tokens: 500,
      context_length: 32768,
    }),
  });

  if (!response.ok || !response.body) {
    throw new Error("Failed to connect to Ollama generate endpoint");
  }

  let buffer = "";

  for await (const chunk of response.body) {
    buffer += chunk.toString();
    const lines = buffer.split("\n");
    buffer = lines.pop(); // Keep the last incomplete line in the buffer

    for (const line of lines) {
      if (line.trim()) {
        try {
          const parsed = JSON.parse(line);
          if (parsed.response) {
            yield parsed.response;
          }
        } catch (err) {
          console.error("⚠️ Failed to parse chunk:", line);
        }
      }
    }
  }

  // Process any remaining data in the buffer
  if (buffer.trim()) {
    try {
      const parsed = JSON.parse(buffer);
      if (parsed.response) {
        yield parsed.response;
      }
    } catch (err) {
      console.error("⚠️ Failed to parse final chunk:", buffer);
    }
  }
}
