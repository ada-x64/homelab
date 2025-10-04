/** @ts-ignore no types */
import {
  type Server,
  type QuickLook,
  type Uptime,
  type System,
  type Container,
} from "../../types";
import { Button, Card, Spinner } from "flowbite-react";
import _ from "lodash";
import { useEffect, useState, type Dispatch } from "react";
import ServerStats from "./server-stats";

export default function ServerCard({ server }: { server: Server }) {
  const [quicklook, setQuicklook] = useState<QuickLook | null>(null);
  const [containers, setContainers] = useState<Container[] | null>(null);
  const [uptime, setUptime] = useState<Uptime | null>(null);
  const [system, setSystem] = useState<System | null>(null);
  const [failed, setFailed] = useState<boolean>(false);
  const [retry, setRetry] = useState<number>(0);

  useEffect(() => {
    console.log("polling...");
    const maxTries = 3;
    let tries = 0;
    let interval: string | number | NodeJS.Timeout | undefined;
    const ping = async () => {
      try {
        console.log("ping");
        setFailed(false);
        const base = `http://${server.ip}:${server.status.apiPort}${server.status.apiRoute}`;
        for (const [endpoint, setter] of [
          ["/quicklook", setQuicklook],
          ["/containers", setContainers],
          ["/uptime", setUptime],
          ["/system", setSystem],
        ]) {
          const response = await fetch(base + endpoint);
          const body = await response.json();
          (setter as Dispatch<Object>)(body);
        }
        if (!interval) {
          interval = setInterval(ping, 2000);
        }
      } catch {
        tries += 1;
        if (tries > maxTries) {
          setFailed(true);
          console.info(
            `Failed to fetch stats for ${server.ip}. Clearing interval.`,
          );
          setQuicklook(null);
          setContainers(null);
          clearInterval(interval);
        }
      }
    };
    ping();
    return () => clearInterval(interval);
  }, [retry]);

  let content;
  if (!failed && quicklook == null && containers == null) {
    content = (
      <div className="flex flex-1 justify-center">
        <Spinner size="lg"></Spinner>
      </div>
    );
  } else if (failed) {
    content = (
      <>
        <div className="text-yellow-300 font-bold">Failed to fetch.</div>
        <Button
          color="alternative"
          onClick={() => {
            setRetry(retry + 1);
          }}
        >
          Retry
        </Button>
      </>
    );
  } else {
    // temp
    content = (
      <ServerStats
        quicklook={quicklook!}
        containers={containers!}
        uptime={uptime!}
        system={system!}
      ></ServerStats>
    );
  }

  return (
    <Card className="flex">
      <div className="text-sm font-semibold text-gray-500 dark:text-gray-200 flex items-center gap-2">
        <img
          src="/public/server.svg"
          className="size-4 dark:invert dark:brightness-25"
        />
        {server.name}
      </div>
      {content}
    </Card>
  );
}
