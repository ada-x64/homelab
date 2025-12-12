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

export class AllStats {
  stats: { [x: string]: ServerStatus } = {};
  constructor(config: Config) {
    for (const server of config.servers) {
      // set up
      this.stats[server.name] = {
        status: "loading",
        retry: 0,
        showInfo: false,
        tries: 0,
        maxTries: 3,
      };
    }
  }
}

export type StatusCtxType = {
  allStats: AllStats;
  setStatus: (server: string, status: ServerStatus) => void;
};
/** @ts-ignore */
export const StatusCtx = createContext<StatusCtxType>(undefined);

export function pingServer(
  server: Server,
  status: ServerStatus,
  setStatus: any,
) {
  console.log("Pinging server", server.name);
  status.tries = 0;
  status.status = "loading";
  const ping = async () => {
    let success = false;
    // ping
    try {
      const base = `/status/${server.name.replaceAll(/\s/g, "-")}/`;
      for (const field of ["quicklook", "containers", "uptime", "system"]) {
        const ctrl = new AbortController();
        setTimeout(() => {
          ctrl.abort();
        }, 5000);
        const response = await fetch(base + field, { signal: ctrl.signal });
        const body = await response.json();
        if (body.error) {
          throw body.error;
        }

        /** @ts-ignore */
        status[field] = body;
        status.showInfo = false;
        success = true;
      }
      console.log(` Succesfully pinged ${server.name}`);
      status.status = "up";
    } catch {
      console.log(
        `Failed to ping server ${server.name} (${status.tries}/${status.maxTries})`,
      );
      status.tries += 1;
      status.showInfo = true;
    }
    setStatus(server.name, status);
    if (!success) {
      if (status.tries < status.maxTries) {
        await ping();
      } else {
        status.status = "down";
      }
    }
  };

  ping();
}
