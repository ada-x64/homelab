// This works by using a reverse proxy given the config at config/config.json.
import _ from "lodash";

import type { FastifyPluginAsync } from "fastify";
import { readFile } from "node:fs/promises";
import { type Config, ConfigSchema } from "../types.js";
import proxy from "@fastify/http-proxy";
import z from "zod";
import fp from "fastify-plugin";

export let config: Config | undefined;

const plugin: FastifyPluginAsync = async (server) => {
  try {
    let raw = await readFile("config/config.json", { encoding: "utf8" });
    raw = JSON.parse(raw.toString());
    config = ConfigSchema.parse(raw);
    server.log.info("Successfully parsed config file.");
  } catch (e: any) {
    if (e.issues) {
      server.log.error(z.prettifyError(e));
    } else {
      server.log.error(e);
    }
    server.log.error(
      "Please specify a valid configuration file at config/config.json. For more information, see the README.",
    );
    throw new Error();
  }

  server.decorate("config", config);
  const serverMap = _.keyBy(config.servers, "name");

  // apps
  for (const app of config.apps) {
    const ip = serverMap[app.host].ip;
    server.register(proxy, {
      upstream: `http://${ip}:${app.port}`,
      prefix: app.path,
      rewritePrefix: app.hostPath,
    });
  }

  // status
  for (const cserver of config.servers) {
    server.register(proxy, {
      upstream: `http://${cserver.ip}:${cserver.status.apiPort}`,
      prefix: `status/${cserver.name.replaceAll(/\s/g, "-")}`,
      rewritePrefix: cserver.status.apiRoute,
    });
  }
};

declare module "fastify" {
  interface FastifyInstance {
    config: Config;
  }
}

export default fp(plugin, { name: "config" });
