import { loadDocuments as loadDocs } from "../utils/loadDocuments.js";
import { addVector, saveVectors, loadVectors } from "../utils/vectorStore.js";

export async function loadDocuments(folderPath) {
  try {
    const documents = await loadDocs(folderPath);
    return documents;
  } catch (error) {
    throw new Error(`Failed to load documents: ${error.message}`);
  }
}

export async function listDocuments() {
  try {
    const vectors = await loadVectors();
    return vectors.map((v) => ({
      text: v.text,
      metadata: v.metadata,
    }));
  } catch (error) {
    throw new Error(`Failed to list documents: ${error.message}`);
  }
}

export async function addDocument(text, metadata) {
  try {
    await addVector(text, metadata);
    await saveVectors();
    return { success: true };
  } catch (error) {
    throw new Error(`Failed to add document: ${error.message}`);
  }
}
