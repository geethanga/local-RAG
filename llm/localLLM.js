import fetch from "node-fetch";

export async function generateAnswer(
  contextTexts,
  question,
  model = "mistral"
) {
  const startTime = performance.now();
  const prompt = `
    Use the following context to answer the question:
    
    Context:
    ${contextTexts.join("\n\n")}
    
    Question:
    ${question}
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
      console.log(`\n\n⏱️  Generated in ${duration} seconds`);
      resolve(result);
    });

    response.body.on("error", (err) => {
      clearInterval(loadingInterval);
      reject(err);
    });
  });
}
