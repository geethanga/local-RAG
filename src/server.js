import Fastify from "fastify";
import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import env from "@fastify/env";
import staticFiles from "@fastify/static";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import * as documentService from "./services/documentService.js";
import * as queryService from "./services/queryService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envSchema = {
  type: "object",
  required: ["PORT"],
  properties: {
    PORT: {
      type: "string",
      default: 3000,
    },
  },
};

const server = Fastify({
  logger: true,
});

// Register plugins
await server.register(env, {
  schema: envSchema,
  dotenv: true,
});

await server.register(cors, {
  origin: true,
});

await server.register(swagger, {
  swagger: {
    info: {
      title: "RAG Local API",
      description: "API for local RAG system",
      version: "1.0.0",
    },
  },
});

await server.register(swaggerUi, {
  routePrefix: "/docs",
});

// Register static file serving
await server.register(staticFiles, {
  root: join(__dirname, "public"),
  prefix: "/",
});

// Register services
server.decorate("documentService", documentService);
server.decorate("queryService", queryService);

// Register routes
await server.register(import("./routes/documents.js"));
await server.register(import("./routes/query.js"));

// Health check
server.get("/health", async () => {
  return { status: "ok" };
});

// Start server
try {
  await server.listen({ port: server.config.PORT, host: "0.0.0.0" });
  server.log.info(`Server listening on ${server.server.address().port}`);
} catch (err) {
  server.log.error(err);
  process.exit(1);
}
