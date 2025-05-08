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

export function splitTextIntoChunks(text, maxSize = 2000, overlap = 100) {
  if (!text || text.trim().length === 0) {
    return [];
  }

  // Step 1: Split into sentences using regex
  const sentenceRegex = /[^.!?]+[.!?]/g;
  const matches = text.match(sentenceRegex);

  // Step 2: Clean and normalize each sentence
  const sentences = matches
    ? matches.map((s) => s.trim()).filter((s) => s.length > 0)
    : [text.trim()];

  // For short text, return as a single chunk
  if (text.length <= maxSize) {
    return [text.trim()];
  }

  // Step 3: Create chunks
  const chunks = [];
  let currentChunk = "";

  const addChunk = (text) => {
    if (!text) return;

    // If text is longer than maxSize, split by words
    if (text.length > maxSize) {
      const words = text.split(" ");
      let tempChunk = "";

      for (const word of words) {
        const prospectiveChunk = tempChunk ? tempChunk + " " + word : word;

        if (prospectiveChunk.length <= maxSize) {
          tempChunk = prospectiveChunk;
        } else {
          if (tempChunk) {
            chunks.push(tempChunk);
            tempChunk = word;
          } else if (word.length > maxSize) {
            // Split long word
            for (let i = 0; i < word.length; i += maxSize) {
              chunks.push(word.slice(i, Math.min(i + maxSize, word.length)));
            }
            tempChunk = "";
          } else {
            tempChunk = word;
          }
        }
      }

      if (tempChunk) {
        chunks.push(tempChunk);
      }
    } else {
      chunks.push(text);
    }
  };

  // Process each sentence
  for (const sentence of sentences) {
    if (!sentence) continue;

    // If adding this sentence would exceed maxSize, start a new chunk
    if (currentChunk && (currentChunk + " " + sentence).length > maxSize) {
      addChunk(currentChunk);
      currentChunk = sentence;
    } else {
      currentChunk = currentChunk ? currentChunk + " " + sentence : sentence;
    }

    // If current chunk is already too long, split it
    if (currentChunk.length > maxSize) {
      addChunk(currentChunk);
      currentChunk = "";
    }
  }

  // Add any remaining chunk
  if (currentChunk) {
    addChunk(currentChunk);
  }

  // Step 4: Add overlaps
  if (chunks.length <= 1 || overlap <= 0) {
    return chunks;
  }

  const finalChunks = [];
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    finalChunks.push(chunk);

    if (i < chunks.length - 1) {
      const nextChunk = chunks[i + 1];
      const overlapStart = Math.max(0, chunk.length - overlap);
      const overlapEnd = Math.min(overlap, nextChunk.length);

      if (overlapEnd > 0) {
        const overlapText =
          chunk.slice(overlapStart) + " " + nextChunk.slice(0, overlapEnd);
        if (overlapText.length <= maxSize) {
          finalChunks.push(overlapText);
        }
      }
    }
  }

  return finalChunks;
}
