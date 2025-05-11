# RAG Local Node

A local RAG (Retrieval-Augmented Generation) system built with Node.js, using Ollama for LLM inference and local vector storage.

## Features

- **Local Document Processing**

  - Support for TXT, PDF, and image files (JPG, PNG)
  - Automatic text extraction from PDFs and images
  - Smart text chunking with sentence boundary preservation
  - Metadata extraction (filename, type, creation date, etc.)

- **Vector Storage**

  - Local vector storage using JSON files
  - Cosine similarity search
  - Metadata filtering support
  - Automatic vector normalization

- **Query Interface**
  - Real-time streaming responses using Server-Sent Events (SSE)
  - Source citation in answers
  - Interactive UI with:
    - Query input
    - Streaming answer display
    - Source references
    - Debug mode toggle
    - Clear all functionality
    - Stop query option

## Prerequisites

- Node.js 18+
- Ollama (with Mistral model)
- Tesseract OCR (for image processing)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/geethanga/rag-local-node.git
   cd rag-local-node
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a data directory:

   ```bash
   mkdir data
   ```

4. Start Ollama (if not already running):
   ```bash
   ollama serve
   ```

## Usage

1. Start the server:

   ```bash
   npm start
   ```

2. Open your browser to `http://localhost:3000`

3. Add documents:

   - Place your documents in the `data` directory
   - Supported formats: TXT, PDF, JPG, PNG
   - Documents are automatically processed and indexed

4. Query your documents:
   - Enter your question in the query box
   - Watch the answer stream in real-time
   - View source references below the answer
   - Use debug mode to see detailed logs
   - Clear all to reset the interface

## API Endpoints

- `GET /query?query=<your-query>` - Stream query results
- `POST /query` - Regular query endpoint
- `POST /documents` - Index documents
- `GET /documents` - List indexed documents
- `GET /health` - Health check

## Development

- `npm run dev` - Start in development mode
- `npm test` - Run tests
- `npm run lint` - Run linter

## Project Structure

```
src/
├── public/          # Static files
├── routes/          # API routes
├── services/        # Business logic
├── utils/           # Utility functions
│   ├── embedder.js  # Text embedding
│   ├── localLLM.js  # LLM integration
│   └── vectorStore.js # Vector storage
└── server.js        # Main application
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT
