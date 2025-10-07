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
  failed: boolean;
  retry: number;
  showInfo: boolean;
  quicklook?: QuickLook;
  uptime?: Uptime;
  system?: System;
  containers?: Container[];
};

export type StatusCtxType = { [x: string]: ServerStatus };

export const StatusCtx = createContext<StatusCtxType>({});

export function setupPing(config: Config, allStats: StatusCtxType) {
  console.log("Setting up ping.");
  for (const server of config.servers) {
    // set up
    let stats = allStats[server.name];
    if (stats == undefined) {
      allStats[server.name] = {
        failed: false,
        retry: 0,
        showInfo: false,
      };
      stats = allStats[server.name];
    }
  }
}

export function pingServer(server: Server, stats: ServerStatus) {
  console.log("Pinging server", server.name);
  const maxTries = 3;
  let tries = 0;
  let interval: string | number | NodeJS.Timeout | undefined;
  const ping = async () => {
    // ping
    try {
      if (!interval) {
        interval = setInterval(ping, 2000);
      }
      const base = `/status/${server.name.replaceAll(/\s/g, "-")}/`;
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
    } catch {
      console.log("Failed to ping server", server.name);
      tries += 1;
      stats.showInfo = true;
      if (tries > maxTries) {
        stats.failed = true;
        clearInterval(interval);
      }
    }
  };
  ping();
}
