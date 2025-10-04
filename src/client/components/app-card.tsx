import cn from "../cn";
/** @ts-ignore no types */
import { type App, type Server } from "../../types";
import { Card } from "flowbite-react";
import _ from "lodash";

export default function AppIcon({
  app,
  servers,
}: {
  app: App;
  servers: Server[];
}) {
  const src = app.icon ? `/assets/${app.icon}` : `/public/no-image.svg`;
  const invert = app.icon ? "" : "dark:invert";
  return (
    <Card href={app.path} className="transition">
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
