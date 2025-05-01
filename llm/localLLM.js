import fetch from "node-fetch";

export async function generateAnswer(contextTexts, question) {
  const prompt = `
Use the following context to answer the question:

Context:
${contextTexts.join("\n\n")}

Question:
${question}
`;

  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "mistral", // or whatever model you pulled locally
      prompt,
      stream: false,
    }),
  });

  const data = await response.json();
  return data.response;
}
