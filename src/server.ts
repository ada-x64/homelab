import { resolve } from "node:path";
import Fastify from "fastify";
import FastifyVite from "@fastify/vite";
import FastifyFormBody from "@fastify/formbody";
import FastifyCors from "@fastify/cors";

import ConfigPlugin from "./server/config.js";
import AuthApiPlugin from "./server/auth-api.js";
import InitAdminPlugin from "./server/init-admin.js";

const server = Fastify({
  logger: {
    transport: {
      target: "@fastify/one-line-logger",
    },
  },
});

await server.register(FastifyVite, {
  root: resolve(import.meta.dirname, ".."),
  distDir: import.meta.dirname, // This file will also live in the dist folder when built
  renderer: "@fastify/react",
  dev: true,
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

server.register(AuthApiPlugin);
server.register(ConfigPlugin);
server.register(InitAdminPlugin);

const port = process.env.PORT ? +process.env.PORT : 3000;
await server.listen({ port });
