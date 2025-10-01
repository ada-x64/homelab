import { z } from "zod";

export const AppSchema = z.object({
  name: z.string(),
  host: z.string(),
  port: z.number().nonnegative().lte(9999),
  path: z.string().or(z.undefined()),
  hostPath: z.string().or(z.undefined()),
  icon: z.string().or(z.undefined()),
  embed: z.boolean().or(z.undefined()),
});
export type App = z.infer<typeof AppSchema>;

export const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
export const WolSchema = z.object({
  macAddress: z.string().regex(macRegex),
  from: z.ipv4().or(z.undefined()).or(z.string().regex(/^all$/)).default("all"),
  interval: z.number().or(z.undefined()).default(100),
  port: z.number().or(z.undefined()).default(9),
  count: z.number().or(z.undefined()).default(3),
  broadcastAddr: z.string().or(z.undefined()),
});
export type WolOpts = z.infer<typeof WolSchema>;

export const ServerSchema = z.object({
  name: z.string(),
  ip: z.ipv4().or(z.ipv6()),
  wakeOnLan: z.undefined().or(WolSchema),
});
export type Server = z.infer<typeof ServerSchema>;

export const ConfigSchema = z.object({
  apps: z.array(AppSchema),
  servers: z.array(ServerSchema),
});

export type Config = z.infer<typeof ConfigSchema>;
