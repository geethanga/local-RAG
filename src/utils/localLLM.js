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
    You are a helpful assistant that answers questions based on the provided context.
    
    Context:
    ${formattedContext}
    
    Question:
    ${question}
    
    Instructions:
    1. Answer the question using ONLY the information from the provided context
    2. Use citation numbers [1], [2], etc. to reference your sources
    3. DO NOT include the actual source text in your answer
    4. DO NOT include any lines starting with "Source:" or containing source information
    5. DO NOT list the sources at the end of your answer
    6. Keep your answer concise and to the point
    7. If you're not sure about something, say so
    
    Example of good answer:
    "The capital of France is Paris [1]. It is known for the Eiffel Tower [2]."
    
    Example of bad answer:
    "The capital of France is Paris. Source: [1] France.txt
    It is known for the Eiffel Tower. Source: [2] landmarks.txt"
    `;

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
            // Debug log the response
            console.log("LLM Response:", parsed.response);
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
