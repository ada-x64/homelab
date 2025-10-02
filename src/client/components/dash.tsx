import cn from "../cn";
/** @ts-ignore no types */
import { type Config, type App, type Server } from "../../types";
import { Card } from "flowbite-react";
import _ from "lodash";

export function Glances({ title, src }: { title: string; src: URL | string }) {
  // sync from glances... just use an iframe
  return <iframe title={title} src={src.toString()} />;
}

function AppIcon({ app, servers }: { app: App; servers: Server[] }) {
  const src = app.icon ? `/assets/${app.icon}` : `/public/no-image.svg`;
  const invert = app.icon ? "" : "dark:invert";
  return (
    <Card href={app.path} className="transition shadow-2xl">
      <div className="flex gap-5">
        <div
          className={cn([
            "size-16",
            "rounded-xl",
            "border",
            "border-gray-200",
            "dark:border-gray-700",
          ])}
        >
          <img src={src} className={cn(["rounded-xl", invert])} />
        </div>
        <div className="space-y-1 flex flex-col justify-center font-medium dark:text-white">
          <div>{app.name}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {app.host}
          </div>
        </div>
      </div>
    </Card>
  );
}

function ServerStatus({ server }: { server: Server }) {
  const quicklook = useState({});
  return (
    <Card>
      <div className="flex"></div>
    </Card>
  );
}

export default function Dash({ config }: { config: Config }) {
  return (
    <>
      <div className={cn(["grid", "grid-cols-2", "gap-10"])}>
        <Card className={cn(["min-w-md"])}>
          {config.apps.map((app) => (
            <AppIcon
              key={crypto.randomUUID()}
              app={app}
              servers={config.servers}
            />
          ))}
        </Card>
        <Card>
          {config.servers.map((server) => (
            <ServerStatus key={crypto.randomUUID()} server={server} />
          ))}
        </Card>
      </div>
    </>
  );
}
