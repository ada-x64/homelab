// derived from https://github.com/gigafied/wakeonlan/blob/master/index.js

import os from "os";
import net from "net";
import dgram, { type SocketType } from "dgram";
import type { WolOpts } from "../types.js";
import _ from "lodash";
import type { FastifyPluginCallback } from "fastify";

const packet = ({ macAddress }: WolOpts) => {
  return Buffer.from(
    "ff".repeat(6) + macAddress.replace(/:|-/g, "").repeat(16),
    "hex",
  );
};

const broadcastAddr = (ip: string, netmask: string) => {
  const a = ip.split(".").map((s) => parseInt(s, 10));
  const b = netmask.split(".").map((s) => parseInt(s, 10));
  const c = _.zip(a, b).map(([a, b]) => {
    if (!a || !b) return;
    (a & b) | (b ^ 255);
  });
  return c.join(".");
};

const sendToAll = (opts: WolOpts) => {
  const promises = Object.values(os.networkInterfaces())?.flatMap((values) => {
    values?.map((i) => {
      if (i.internal || !net.isIPv4(i.address)) {
        return;
      }
      let optsClone = Object.assign({}, opts);
      optsClone.from = i.address;
      optsClone.macAddress = broadcastAddr(i.address, i.netmask);
      return send(optsClone);
    });
  });
  return Promise.all(promises);
};

const sendSingle = (opts: WolOpts) => {
  return new Promise<void>((resolve, reject) => {
    try {
      const pkt = packet(opts);
      const socket = dgram.createSocket({
        type: (net.isIPv6(opts.macAddress) ? "upd6" : "upd4") as SocketType,
      });
      socket.unref();

      let interval: NodeJS.Timeout | undefined;
      let count = opts.count;
      const checkDone = (err: Error | null) => {
        count--;
        if (!count || err) {
          socket.close();
          clearInterval(interval);
          if (err) return reject(err);
          return resolve();
        }
      };

      const doSend = () =>
        socket.send(pkt, 0, pkt.length, opts.port, opts.macAddress, checkDone);

      socket.bind(0, opts.from, () => {
        socket.setBroadcast(true);
        socket.once("error", checkDone);
        doSend();
        interval = setInterval(doSend, opts.interval);
      });
    } catch (err) {
      reject(err);
    }
  });
};

export function send(opts: WolOpts) {
  if (!opts.from) {
    return sendToAll(opts);
  } else {
    return sendSingle(opts);
  }
}

export const plugin: FastifyPluginCallback = (server) => {
  server.post(
    "/wake",
    {
      schema: {
        body: {
          type: "object",
          properties: {
            server: { type: "string" },
          },
        },
      },
    },
    async (req, reply) => {
      server.log.info(req);
      const session = await req.getSession();
      if (session == null || session == undefined) {
        return reply.status(401).send();
      }
      const toWake = server.config.servers.find(
        (server) => server.name == req.body.sever,
      );
      if (!toWake) {
        return reply.status(404).send("Could not find the requested server.");
      }
      if (!toWake?.wakeOnLan) {
        return reply.status(403).send("This server is not set up for WOL.");
      }
      send(toWake.wakeOnLan)
        .then(() => {
          return reply.status(200).send("WOL packet sent!");
        })
        .catch((err) => {
          return reply.status(500).send(err);
        });
    },
  );
};

export default plugin;
