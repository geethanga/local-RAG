# RAG Local Node

A local RAG (Retrieval-Augmented Generation) system built with Node.js and React, using Ollama for LLM inference and local vector storage.

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

- **Modern React Frontend**
  - Built with React 19 and Vite for fast development
  - Real-time streaming responses using Server-Sent Events (SSE)
  - Source citation in answers
  - Interactive UI with:
    - Query input
    - Streaming answer display
    - Source references
    - Debug mode toggle
    - Clear all functionality
    - Stop query option
    - Hot reloading for rapid development

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
   cd frontend && npm install
   ```

3. Create a data directory:

   ```bash
   mkdir src/data
   ```

4. Start Ollama (if not already running):
   ```bash
   ollama serve
   ```

## Usage

### Production Mode

1. Build the React frontend:

   ```bash
   npm run build
   ```

2. Start the server:

   ```bash
   npm start
   ```

3. Open your browser to `http://localhost:3000`

### Development Mode

1. Start both frontend and backend in development mode:

   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on `http://localhost:3000`
   - React dev server on `http://localhost:5173` (with hot reloading)

2. For frontend development, open `http://localhost:5173` for the best experience with hot reloading

3. For backend-only development:

   ```bash
   npm run dev:server
   ```

4. For frontend-only development:

   ```bash
   npm run dev:client
   ```

### Adding Documents

- Place your documents in the `src/data` directory
- Supported formats: TXT, PDF, JPG, PNG
- Documents are automatically processed and indexed

### Querying Documents

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

### Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run dev:server` - Start only the backend server
- `npm run dev:client` - Start only the React frontend with hot reloading
- `npm run build` - Build React frontend for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run linter (in frontend directory)

### Development Workflow

1. **Frontend Development**: Use `npm run dev:client` and visit `http://localhost:5173` for hot reloading
2. **Backend Development**: Use `npm run dev:server` for backend-only development
3. **Full Stack Development**: Use `npm run dev` to run both servers simultaneously
4. **Production Testing**: Use `npm run build` then `npm start` to test the production build

## Project Structure

```
├── frontend/                    # React frontend application
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── services/          # Frontend services
│   │   ├── App.jsx            # Main React component
│   │   └── main.jsx           # React entry point
│   ├── package.json           # Frontend dependencies
│   └── vite.config.js         # Vite configuration
├── src/                        # Backend application
│   ├── public/                # React build output (generated)
│   ├── data/                  # Document storage directory
│   ├── routes/                # API routes
│   ├── services/              # Business logic
│   ├── utils/                 # Utility functions
│   │   ├── embedder.js        # Text embedding
│   │   ├── localLLM.js        # LLM integration
│   │   └── vectorStore.js     # Vector storage
│   └── server.js              # Main application
├── test/                       # Test files
└── package.json               # Root dependencies and scripts
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT
