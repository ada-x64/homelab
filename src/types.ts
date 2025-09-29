import { z } from "zod";

export const App = z.object({
  name: z.string(),
  host: z.string(),
  port: z.number().nonnegative().lte(9999),
  path: z.string().or(z.undefined()),
  hostPath: z.string().or(z.undefined()),
  icon: z.string().or(z.undefined()),
  embed: z.boolean().or(z.undefined()),
});

export const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
export const WakeOnLan = z.object({
  macAddress: z.string().regex(macRegex),
});

export const Server = z.object({
  name: z.string(),
  ip: z.ipv4().or(z.ipv6()),
  wakeOnLan: z.undefined().or(z.object()),
});

export const ConfigSchema = z.object({
  apps: z.array(App),
  servers: z.array(Server),
});

export type Config = z.infer<typeof ConfigSchema>;
