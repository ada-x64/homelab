import cn from "../cn";
import { useRouteContext } from "@fastify/react/client";
import { ConfigSchema, type Config, type App, type Server } from "../../types";

export async function getData(): Promise<{ config: Config }> {
  const fs = await import("fs");
  const json = JSON.parse(fs.readFileSync("assets/config.json", "utf8"));
  const config = ConfigSchema.parse(json);

  return {
    config,
  };
}

export function getMeta() {
  return {
    title: "LAN Dashboard",
  };
}

export function Glances({ title, src }: { title: string; src: URL | string }) {
  // sync from glances... just use an iframe
  return <iframe title={title} src={src.toString()} />;
}

function AppIcon({ app, servers }: { app: App; servers: Server[] }) {
  return <div>{app.name}</div>;
}
function ServerStatus({ server }: { server: Server }) {
  return <div>{server.name}</div>;
}

export default function Index() {
  const { data }: { data: { config: Config } } = useRouteContext();
  const config = data.config;
  return (
    <>
      <div className={cn(["grid", "grid-cols-2"])}>
        <div className={cn(["p-4", "bg-gray-100"])}>
          {config.apps.map((app) => (
            <AppIcon key={app.name} app={app} servers={config.servers} />
          ))}
        </div>
        <div id="statuses">
          {config.servers.map((server) => (
            <ServerStatus key={server.name} server={server} />
          ))}
        </div>
      </div>
    </>
  );
}
