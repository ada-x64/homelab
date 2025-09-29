// This works by using a reverse proxy given the config at assets/config.json.
import _ from "lodash";

import type { FastifyPluginAsync } from "fastify";
import { readFile } from "node:fs/promises";
import { type Config, ConfigSchema } from "../types.js";
import proxy from "@fastify/http-proxy";
import z from "zod";

const plugin: FastifyPluginAsync = async (server) => {
  let config: Config;
  try {
    let raw = await readFile("assets/config.json", { encoding: "utf8" });
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
      "Please specify a valid configuration file at assets/config.json. For more information, see the README.",
    );
    throw new Error();
  }

  const serverMap = _.keyBy(config.servers, "name");
  for (const app of config.apps) {
    const ip = serverMap[app.host].ip;
    server.register(proxy, {
      upstream: `http://${ip}:${app.port}`,
      prefix: app.path,
      rewritePrefix: app.hostPath,
    });
  }
};

export default plugin;
