import type { FastifyPluginCallback, FastifyRequest } from "fastify";
import { auth } from "./auth.js";
import type { FastifyInstance } from "fastify/types/instance.js";

const plugin: FastifyPluginCallback = (server) => {
  server.route({
    method: ["GET", "POST"],
    url: "/api/auth/*",
    async handler(request, reply) {
      try {
        // Construct request URL
        const url = new URL(request.url, `http://${request.headers.host}`);

        // Convert Fastify headers to standard Headers object
        const headers = new Headers();
        Object.entries(request.headers).forEach(([key, value]) => {
          if (value) headers.append(key, value.toString());
        });
        // Create Fetch API-compatible request
        const req = new Request(url.toString(), {
          method: request.method,
          headers,
          body: request.body ? JSON.stringify(request.body) : undefined,
        });
        // Process authentication request
        const response = await auth.handler(req);
        // Forward response to client
        reply.status(response.status);
        response.headers.forEach((value, key) => reply.header(key, value));
        reply.send(response.body ? await response.text() : null);
      } catch (error) {
        server.log.error("Authentication Error:", error as any);
        reply.status(500).send({
          error: "Internal authentication error",
          code: "AUTH_FAILURE",
        });
      }
    },
  });

  server.decorateRequest("getSession", getSession);
};
async function getSession(this: FastifyRequest) {
  try {
    const headers = new Headers();
    Object.entries(this.headers).forEach(([key, value]) => {
      if (value) headers.append(key, value.toString());
    });
    return await auth.api.getSession({ headers });
  } catch (error) {
    null;
  }
}

declare module "fastify" {
  interface FastifyRequest {
    getSession: typeof getSession;
  }
}

export default plugin;
