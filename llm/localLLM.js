import fetch from "node-fetch";

export async function generateAnswer(
  contextTexts,
  question,
  model = "mistral"
) {
  const prompt = `
    Use the following context to answer the question:
    
    Context:
    ${contextTexts.join("\n\n")}
    
    Question:
    ${question}
    `;

  console.log("\nProcessing the query ⏳");

  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      prompt,
      stream: true,
    }),
  });

  if (!response.ok || !response.body) {
    throw new Error("Failed to connect to Ollama generate endpoint");
  }

  return new Promise((resolve, reject) => {
    let result = "";

    console.log("\n🤖 Answer : ");

    response.body.on("data", (chunk) => {
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
      resolve(result);
    });

    response.body.on("error", (err) => {
      reject(err);
    });
  });
}
