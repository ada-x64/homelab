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

export const ZPercent = z.number().gte(0).lte(100);

/** Percpu in the style of Glances.
 * https://glances.readthedocs.io/en/latest/api.html#get-percpu
 */
export const PercpuSchema = z.object({
  cpu_number: z.int(),
  total: ZPercent.describe("Sum of CPU percentages (percent)"),
  system: ZPercent,
  user: ZPercent,
  iowait: ZPercent.or(z.undefined()),
  idle: ZPercent,
  irq: ZPercent.or(z.undefined()),
  nice: ZPercent.or(z.undefined()),
  steal: ZPercent.or(z.undefined()),
  guest: ZPercent.or(z.undefined()),
  guest_nice: ZPercent.or(z.undefined()),
  softirq: ZPercent.or(z.undefined()),
  dpc: ZPercent.or(z.undefined()),
  interrupt: ZPercent.or(z.undefined()),
});

/** Quick look in the style of Glances.
 * https://glances.readthedocs.io/en/latest/api.html#get-quicklook
 */
export const QuickLookSchema = z.object({
  cpu: ZPercent.describe("CPU usage (percent)"),
  mem: ZPercent.describe("Memory usage (percent)"),
  swap: ZPercent.describe("Swap usage (percent)"),
  load: z
    .number()
    .lte(100)
    .gte(0)
    .describe("Load average (percent)")
    .or(z.undefined().describe("LOAD only available on unix.")),
  cpu_log_core: z.int().describe("Number of logical cores."),
  cpu_phys_core: z.int().describe("Number of physical cores."),
  cpu_name: z.string(),
  cpu_hz_current: z.number().describe("Current CPU speed in Hz"),
  cpu_hz: z.number().describe("Maximum CPU speed in Hz"),
  percpu: z.array(PercpuSchema),
});

export type QuickLook = z.infer<typeof QuickLookSchema>;

/** Containers schema in the style of Glances.
 * https://glances.readthedocs.io/en/latest/api.html#get-containers
 */
export const ContainersSchema = z.object({
  name: z.string(),
  id: z.string(),
  image: z.array(z.string()),
  status: z.string(),
  created: z.iso.datetime(),
  command: z.string(),
  cpu_percent: ZPercent,
  memory_inactive_file: z.number(),
  memory_limit: z.number(),
  memory_usage: z.number(),
  io_rx: z.number(),
  io_wx: z.number(),
  network_rx: z.number(),
  network_tx: z.number(),
  uptime: z.string(),
  engine: z.string(),
  pod_name: z.string().or(z.undefined()),
  pod_id: z.string().or(z.undefined()),
  io: z.object({
    cumulative_ior: z.number(),
    cumulative_iow: z.number(),
    time_since_update: z.number(),
    ior: z.number(),
    iow: z.number(),
  }),
  cpu: z.object({
    total: z.number(),
  }),
  memory: z.object({
    usage: z.number(),
    limite: z.number(),
    inactive_file: z.number(),
  }),
  network: z.object({
    cumulative_rx: z.number(),
    cumulative_tx: z.number(),
    time_since_update: z.number(),
    rx: z.number(),
    tx: z.number(),
  }),
});

type Containers = z.infer<typeof ContainersSchema>;
