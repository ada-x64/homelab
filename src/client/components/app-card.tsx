import cn from "../cn";
import { type App } from "../../types";
import { Card, Spinner } from "flowbite-react";
import _ from "lodash";
import { StatusCtx } from "../status";
import { useContext } from "react";

export default function AppIcon({
  app,
  className,
}: {
  app: App;
  className?: string;
}) {
  const { allStats } = useContext(StatusCtx);
  let stats;
  try {
    stats = allStats.stats[app.host] ?? { status: "loading" };
  } catch {
    stats = { status: "down" };
  }
  const src = app.icon ? `/config/${app.icon}` : `/no-image.svg`;
  const invert = app.icon ? "" : "dark:invert";
  const href = stats.status === "up" ? app.path : undefined;
  if (stats.status === "down") {
    className += " cursor-not-allowed opacity-50";
  } else if (stats.status === "loading") {
    className += " cursor-wait";
  }

  return (
    <Card
      href={href}
      className={cn(["hover:transition", className ?? ""])}
      title={`${app.name}: ${stats.status}`}
    >
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
          <div className="flex align-middle gap-1">{app.name}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400 flex align-center gap-1">
            {stats.status === "loading" ? (
              <Spinner size="sm" className="size-3" light></Spinner>
            ) : (
              <img
                src={`/status-${stats.status}.svg`}
                className="size-3 dark:invert dark:brightness-25 h-full"
              />
            )}
            <div>
              {app.host}
              {stats.status === "loading"
                ? ` (${stats.tries + 1}/${stats.maxTries})`
                : ""}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
