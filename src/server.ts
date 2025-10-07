import path, { resolve } from "node:path";
import Fastify from "fastify";
import FastifyVite from "@fastify/vite";
import FastifyCors from "@fastify/cors";
import FastifyStatic from "@fastify/static";

import ConfigPlugin from "./server/config.js";
import AuthApiPlugin from "./server/auth-api.js";
import InitAdminPlugin from "./server/init-admin.js";
import WakePlugin from "./server/wake.js";
import { getRenderFunction } from "./server/renderer.js";

const server = Fastify({
  logger: {
    transport: {
      target: "@fastify/one-line-logger",
    },
  },
});

await server.register(ConfigPlugin);

await server.register(FastifyVite, {
  root: resolve(import.meta.dirname, ".."),
  distDir: import.meta.dirname,
  dev: process.argv.includes("--dev"),
  createRenderFunction: getRenderFunction(server.config),
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
await server.register(InitAdminPlugin);
await server.register(WakePlugin);

// For serving files that the user provides.
await server.register(FastifyStatic, {
  root: path.join(import.meta.dirname, "../config/public"),
  prefix: "/config",
});

const port = process.env.PORT ? +process.env.PORT : 3000;
await server.listen({ host: "0.0.0.0", port });
