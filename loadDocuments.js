import fs from "fs";
import path from "path";
import pdf from "pdf-parse";
import Tesseract from "tesseract.js";

async function loadDocuments() {
  const dataFolder = "./data/";
  const files = fs.readdirSync(dataFolder);

  let chunks = [];

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    let fileText = "";

    console.log(`Loading file ${file}`);
    if (ext === ".txt") {
      fileText = fs.readFileSync(path.join(dataFolder, file), "utf-8");
    } else if (ext === ".pdf") {
      const buffer = fs.readFileSync(path.join(dataFolder, file));
      const pdfData = await pdf(buffer);
      fileText = pdfData.text;
    } else if ([".jpg", ".jpeg", ".png"].includes(ext)) {
      const imagePath = path.join(dataFolder, file);
      const {
        data: { text },
      } = await Tesseract.recognize(imagePath, "eng");
      fileText = text;
    } else {
      console.log(`Skipping unsupported file: ${file}`);
    }

    if (fileText !== "") {
      chunks = chunks.concat(splitTextIntoChunks(fileText));
    }
  }

  return chunks
    .map((chunk) => chunk.trim())
    .filter((chunk) => chunk.length > 0);
}

export { loadDocuments };

export function splitTextIntoChunks(
  text,
  minSize = 500,
  maxSize = 2000,
  overlap = 100
) {
  // Step 1: Normalize whitespace
  const cleanedText = text.replace(/\s+/g, " ").trim();

  // Step 2: Split into sentences
  const sentenceSplitter = /(?<=[.?!])\s+(?=[A-Z])/g;
  const sentences = cleanedText.split(sentenceSplitter);

  const chunks = [];
  let currentChunk = "";

  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i];
    const prospectiveChunk =
      currentChunk + (currentChunk ? " " : "") + sentence;

    if (prospectiveChunk.length <= maxSize) {
      currentChunk = prospectiveChunk;
    } else {
      if (currentChunk.length >= minSize) {
        chunks.push(currentChunk.trim());
        currentChunk = sentence;
      } else {
        currentChunk += " " + sentence;
      }
    }
  }

  // Push the last chunk if it's not empty
  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }

  // Add overlap to improve context retention
  const finalChunks = [];
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    finalChunks.push(chunk);

    if (i < chunks.length - 1) {
      const nextChunk = chunks[i + 1];
      const overlapStart = Math.max(0, chunk.length - overlap);
      const overlapText =
        chunk.slice(overlapStart) + " " + nextChunk.split(" ")[0];
      finalChunks.push(overlapText.trim());
    }
  }

  return finalChunks;
}
