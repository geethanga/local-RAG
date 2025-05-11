import fetch from "node-fetch";

export async function generateAnswer(
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

  let dots = 0;
  const loadingInterval = setInterval(() => {
    process.stdout.write("\rThinking" + ".".repeat(dots % 4) + "   ");
    dots++;
  }, 500);

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

  return new Promise((resolve, reject) => {
    let result = "";

    console.log("\n🤖 Answer : ");

    response.body.on("data", (chunk) => {
      clearInterval(loadingInterval);
      const lines = chunk.toString().split("\n").filter(Boolean);

      for (const line of lines) {
        try {
          const parsed = JSON.parse(line);
          if (parsed.response) {
            process.stdout.write(parsed.response);
            result += parsed.response;
          }
        } catch (err) {
          console.error("⚠️ Failed to parse chunk:", line);
        }
      }
    });

    response.body.on("end", () => {
      clearInterval(loadingInterval);
      const endTime = performance.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);

      // Print sources used
      console.log("\n\n📚 Sources used:");
      contextChunks.forEach((chunk, index) => {
        const source = chunk.metadata.filename || "Unknown source";
        const page = chunk.metadata.pageCount
          ? ` (Page ${chunk.metadata.chunkIndex + 1})`
          : "";
        console.log(`[${index + 1}] ${source}${page}`);
      });

      console.log(`\n⏱️  Generated in ${duration} seconds`);
      resolve(result);
    });

    response.body.on("error", (err) => {
      clearInterval(loadingInterval);
      reject(err);
    });
  });
}
