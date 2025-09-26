import { resolve } from "node:path";
import Fastify from "fastify";
import FastifyVite from "@fastify/vite";
import FastifyFormBody from "@fastify/formbody";
import AuthApi from "./server/authApi.js";
import FastifyCors from "@fastify/cors";
interface Database {
  todoList: string[];
}

const server = Fastify({
  logger: {
    transport: {
      target: "@fastify/one-line-logger",
    },
  },
});

await server.register(FastifyFormBody);

await server.register(FastifyVite, {
  // TODO handle via CLI path argument with proper resolve
  root: resolve(import.meta.dirname, ".."),
  distDir: import.meta.dirname, // This file will also live in the dist folder when built
  renderer: "@fastify/react",
});

await server.vite.ready();

server.decorate<Database>("db", {
  todoList: ["Do laundry", "Respond to emails", "Write report"],
});

server.put<{
  Body: string;
}>("/api/todo/items", (req, reply) => {
  const db = server.getDecorator<Database>("db");
  db.todoList.push(req.body);
  reply.send({ ok: true });
});

server.delete<{
  Body: number;
}>("/api/todo/items", (req, reply) => {
  const db = server.getDecorator<Database>("db");
  db.todoList.splice(req.body, 1);
  reply.send({ ok: true });
});

// Configure CORS policies
server.register(FastifyCors, {
  origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
  maxAge: 86400,
});

server.register(AuthApi);

await server.listen({ port: 3000 });
