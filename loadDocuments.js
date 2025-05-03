import fs from "fs";
import path from "path";
import pdf from "pdf-parse";
import Tesseract from "tesseract.js";

async function loadDocuments() {
  const dataFolder = "./data/";
  const files = fs.readdirSync(dataFolder);

  let allText = "";

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();

    console.log(`Loading file ${file}`);
    if (ext === ".txt") {
      const text = fs.readFileSync(path.join(dataFolder, file), "utf-8");
      allText += "\n" + text;
    } else if (ext === ".pdf") {
      const buffer = fs.readFileSync(path.join(dataFolder, file));
      const pdfData = await pdf(buffer);
      allText += "\n" + pdfData.text;
    } else if ([".jpg", ".jpeg", ".png"].includes(ext)) {
      const imagePath = path.join(dataFolder, file);
      const {
        data: { text },
      } = await Tesseract.recognize(imagePath, "eng");

      console.log(imagePath);
      console.log(text);

      allText += "\n" + text;
    } else {
      console.log(`Skipping unsupported file: ${file}`);
    }
  }

  const chunks = allText.match(/.{1,500}(\s|$)/gs) || [];

  return chunks
    .map((chunk) => chunk.trim())
    .filter((chunk) => chunk.length > 0);
}

export { loadDocuments };
