import { resolve } from "node:path";
import Fastify from "fastify";
import FastifyVite from "@fastify/vite";
import FastifyCors from "@fastify/cors";

import ConfigPlugin from "./server/config.js";
import AuthApiPlugin from "./server/auth-api.js";
import InitAdminPlugin from "./server/init-admin.js";
import WakePlugin from "./server/wake.js";
import { createRenderFunction } from "./server/renderer.js";

const server = Fastify({
  logger: {
    transport: {
      target: "@fastify/one-line-logger",
    },
  },
});

await server.register(FastifyVite, {
  root: resolve(import.meta.dirname, ".."),
  distDir: import.meta.dirname,
  dev: process.argv.includes("--dev"),
  createRenderFunction,
});

await server.vite.ready();

// Configure CORS policies
server.register(FastifyCors, {
  origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
  maxAge: 86400,
});

await server.register(AuthApiPlugin);
await server.register(ConfigPlugin);
await server.register(InitAdminPlugin);
await server.register(WakePlugin);

const port = process.env.PORT ? +process.env.PORT : 3000;
await server.listen({ port });
