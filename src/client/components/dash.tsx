import cn from "../cn";
/** @ts-ignore no types */
import { type Config, type App, type Server } from "../../types";

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

export default function Dash({ config }: { config: Config }) {
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
