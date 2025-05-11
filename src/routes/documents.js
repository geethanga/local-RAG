import { loadDocuments } from "../services/documentService.js";

export default async function (fastify, opts) {
  // Index documents
  fastify.post(
    "/documents",
    {
      schema: {
        body: {
          type: "object",
          required: ["folderPath"],
          properties: {
            folderPath: { type: "string" },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              message: { type: "string" },
              documents: { type: "array" },
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const { folderPath } = request.body;
        const documents = await loadDocuments(folderPath);
        return {
          success: true,
          message: "Documents indexed successfully",
          documents,
        };
      } catch (error) {
        request.log.error(error);
        return reply.code(500).send({
          success: false,
          message: error.message,
        });
      }
    }
  );

  // List indexed documents
  fastify.get(
    "/documents",
    {
      schema: {
        response: {
          200: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              documents: { type: "array" },
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const documents = await fastify.documentService.listDocuments();
        return {
          success: true,
          documents,
        };
      } catch (error) {
        request.log.error(error);
        return reply.code(500).send({
          success: false,
          message: error.message,
        });
      }
    }
  );
}
