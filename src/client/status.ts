import { createContext } from "react";

import type {
  Server,
  QuickLook,
  Container,
  Uptime,
  System,
  Config,
} from "../types";

export type ServerStatus = {
  status: "down" | "loading" | "up";
  retry: number;
  showInfo: boolean;
  quicklook?: QuickLook;
  uptime?: Uptime;
  system?: System;
  containers?: Container[];
  tries: number;
  maxTries: number;
};

export type StatusCtxType = {
  allStats: { [x: string]: ServerStatus };
  setStatus: (server: string, status: ServerStatus) => void;
};

export const StatusCtx = createContext<StatusCtxType>({
  allStats: {},
  setStatus: () => {},
});

export function initStatusCtx(config: Config, ctx: StatusCtxType) {
  console.log("Setting up ping.");
  for (const server of config.servers) {
    // set up
    let stats = ctx.allStats[server.name];
    if (stats == undefined) {
      ctx.setStatus(server.name, {
        status: "loading",
        retry: 0,
        showInfo: false,
        tries: 0,
        maxTries: 3,
      });
      stats = ctx.allStats[server.name];
    }
  }
}

export function pingServer(server: Server, ctx: StatusCtxType) {
  console.log("Pinging server", server.name);
  const stats = ctx.allStats[server.name];
  stats.tries = 0;
  stats.status = "loading";
  let interval: string | number | NodeJS.Timeout | undefined;
  const ping = async () => {
    // ping
    try {
      if (!interval) {
        interval = setInterval(ping, 2000);
      }
      const base = `/stats/${server.name.replaceAll(/\s/g, "-")}/`;
      for (const field of ["quicklook", "containers", "uptime", "system"]) {
        const response = await fetch(base + field);
        const body = await response.json();
        if (body.error) {
          throw body.error;
        }

        /** @ts-ignore */
        stats[field] = body;
        stats.showInfo = false;
      }
      stats.status = "up";
    } catch {
      console.log(
        `Failed to ping server ${server.name} (${stats.tries}/${stats.maxTries})`,
      );
      stats.tries += 1;
      stats.showInfo = true;
      if (stats.tries > stats.maxTries) {
        stats.status = "down";
        clearInterval(interval);
      }
    }
    ctx.setStatus(server.name, stats);
  };
  ping();
}
