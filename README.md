# 🧠 Local RAG (Retrieval-Augmented Generation) System

This project is a fully local implementation of a Retrieval-Augmented Generation (RAG) system. It supports `.txt` and `.pdf` document ingestion, generates embeddings using local transformer models, stores them in memory, and uses a local LLM (like [Mistral](https://ollama.com/library/mistral)) for generating grounded answers — all offline.

---

## 🚀 Features

- 100% offline (no API keys or cloud calls), everything you do will stay in your machine with complete privacy
- Uses [Ollama](https://ollama.com/) to run local LLMs (e.g. `mistral`, `codellama`)
- Embedding generation via `@xenova/transformers` (browser-compatible transformer models)
- PDF support using `pdf-parse`
- Fast cosine similarity search for vector retrieval

---

## 🧰 Tech Stack

- Node.js + ES Modules
- `@xenova/transformers` for local embedding
- `ollama` for local LLM inference
- `pdf-parse` for PDF parsing
- Cosine similarity-based vector search (in-memory)
- No database or external service dependencies

---

## 📁 Folder Structure

```
/data/              - .txt and .pdf files for custom context
/embeddings/        - Embedding logic
/store/             - Vector storage & search
/llm/               - LLM integration (Ollama)
app.js              - CLI entry point (index/query)
```

---

## 📦 Setup Instructions

```bash
# Clone and install dependencies
git clone https://github.com/geethangaa/rag-local-node.git
cd rag-local-node
npm install

# Install Ollama if not already
curl -fsSL https://ollama.com/install.sh | sh

# Pull a model (e.g., mistral)
ollama pull mistral
```

---

## 📚 Index Your Documents

1. Place `.txt` and `.pdf` files inside the `./data/` directory.
2. Run:

```bash
npm run index
```

This will:

- Extract text from your documents
- Chunk them into ~500 character blocks
- Generate embeddings
- Save them into `vectors.json`

---

## 💬 Query the Assistant

Ask a question using:

```bash
npm run query "How do I reset my password?"
```

The system will:

- Embed your query
- Find the top matching document chunks
- Feed them (with your question) into the local LLM
- Return a grounded answer

---

## 📌 Requirements

- Node.js ≥ 18
- ~8GB RAM minimum
- Ollama installed with at least 1 model pulled (e.g., `mistral`)
- Optional: [pnpm](https://pnpm.io) for faster installs

---

## 🛠️ Ideas for Future Features

- Add streaming token-based responses
- Build a simple web UI using React or Next.js
- Persist chat history for multi-turn conversations
- Support `.docx`, `.md`, and HTML files
- Support for scanned PDF files and Images
- Add document tagging and filtering

---

## 🤖 Example Supported Models (via Ollama)

```bash
ollama pull mistral
ollama pull codellama
ollama pull phi
ollama pull llama3
```

---

## 📝 License

MIT — build and share freely!
