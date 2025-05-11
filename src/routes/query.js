export default async function (fastify, opts) {
  // GET endpoint for SSE
  fastify.get(
    "/query",
    {
      schema: {
        querystring: {
          type: "object",
          required: ["query"],
          properties: {
            query: { type: "string" },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const { query } = request.query;
        fastify.log.info("Received query:", query);

        // Set headers for SSE
        reply.raw.writeHead(200, {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        });

        // Create stream
        const stream = fastify.queryService.streamQuery(query);
        fastify.log.info("Stream created");

        // Handle client disconnect
        request.raw.on("close", () => {
          fastify.log.info("Client disconnected");
          stream.return?.();
        });

        try {
          for await (const chunk of stream) {
            fastify.log.info("Sending chunk:", chunk);
            reply.raw.write(`data: ${JSON.stringify(chunk)}\n\n`);
          }
        } catch (error) {
          fastify.log.error("Stream error:", error);
          reply.raw.write(
            `data: ${JSON.stringify({
              type: "error",
              content: error.message,
            })}\n\n`
          );
        } finally {
          fastify.log.info("Stream ended");
          reply.raw.end();
          // Close the connection explicitly
          reply.raw.destroy();
        }
      } catch (error) {
        fastify.log.error("Route error:", error);
        reply.raw.write(
          `data: ${JSON.stringify({
            type: "error",
            content: error.message,
          })}\n\n`
        );
        reply.raw.end();
      }
    }
  );

  // POST endpoint for regular API calls
  fastify.post(
    "/query",
    {
      schema: {
        body: {
          type: "object",
          required: ["query"],
          properties: {
            query: { type: "string" },
            filters: {
              type: "object",
              properties: {
                fileType: { type: "string" },
                dateRange: {
                  type: "object",
                  properties: {
                    start: { type: "string" },
                    end: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const { query, filters } = request.body;
      const result = await fastify.queryService.query(query, filters);
      return result;
    }
  );
}
